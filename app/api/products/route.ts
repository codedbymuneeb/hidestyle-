import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    // Security: Only Admins can modify products
    // @ts-ignore
    if (!session || session.user.role !== 'admin') {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, price, inventory, slug, categoryId, subcategoryId, images, sizes, colors, status } = body

    const product = await prisma.product.create({
        data: {
            title,
            description,
            price: Number(price),
            inventory: Number(inventory),
            slug,
            categoryId,
            subcategoryId,
            // Handle images: could be array or single string. Store as JSON string.
            images: JSON.stringify(Array.isArray(images) ? images : (images ? [images] : [])),
            // Store sizes and colors as JSON strings
            sizes: sizes || null,
            colors: colors || null,
            status: status || 'draft',
        }
    })


    // Purge cache for instant update
    revalidatePath('/')
    revalidatePath('/admin/products')

    return NextResponse.json(product)
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId')
    const subcategoryId = searchParams.get('subcategoryId')
    const sort = searchParams.get('sort') // 'newest' | 'price-asc' | 'price-desc'

    const where: any = {
        status: 'published' // Default: Only fetch published products (Storefront logic)
    }

    // Admin Override (if needed internally, but prefer dedicated admin route)
    // For now, strict 'published' only for public API.

    if (categoryId) where.categoryId = categoryId
    if (subcategoryId) where.subcategoryId = subcategoryId

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }

    const products = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: true }
    })

    return NextResponse.json(products)
}
