import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: { category: true, subcategory: true }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json()
        const { title, description, price, inventory, slug, categoryId, subcategoryId, images, sizes, colors } = body

        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                title,
                description,
                price: Number(price),
                inventory: Number(inventory),
                slug,
                categoryId,
                subcategoryId: subcategoryId || null,
                images: typeof images === 'string' ? images : JSON.stringify(Array.isArray(images) ? images : (images ? [images] : [])),
                sizes: sizes || null,
                colors: colors || null,
            }
        })

        revalidatePath('/')
        revalidatePath('/admin/products')
        revalidatePath(`/products/${product.slug}`)

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: { id: params.id }
        })

        revalidatePath('/')
        revalidatePath('/admin/products')

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
