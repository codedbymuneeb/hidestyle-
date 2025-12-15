import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
            subcategory: true
        }
    })
    return NextResponse.json(products)
}
