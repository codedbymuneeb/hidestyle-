import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { orderId, status } = body

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        return NextResponse.json(order)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
}
