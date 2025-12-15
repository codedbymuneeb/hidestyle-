import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const categories = await prisma.category.findMany({
        include: { subcategories: true }
    })
    return NextResponse.json(categories)
}

export async function POST(req: Request) {
    const body = await req.json()
    const { name, slug } = body
    const category = await prisma.category.create({
        data: { name, slug }
    })
    return NextResponse.json(category)
}
