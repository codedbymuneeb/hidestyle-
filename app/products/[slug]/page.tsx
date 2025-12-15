import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { category: true, subcategory: true }
    })

    if (!product) return notFound()

    return <ProductDetailClient product={product} />
}
