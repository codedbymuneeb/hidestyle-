import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.subcategory.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 })
    }
}
