import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const body = await req.json()
    const { title, description, price, inventory, slug, categoryId, subcategoryId, images, sizes, colors } = body

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

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (subcategoryId) where.subcategoryId = subcategoryId

    const products = await prisma.product.findMany({ where })
    return NextResponse.json(products)
}
