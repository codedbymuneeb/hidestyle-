import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, slug, categoryId } = body

        const subcategory = await prisma.subcategory.create({
            data: { name, slug, categoryId }
        })

        return NextResponse.json(subcategory)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 })
    }
}
