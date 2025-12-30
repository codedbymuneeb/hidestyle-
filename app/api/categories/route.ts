import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true
            }
        })
        return NextResponse.json(categories)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
