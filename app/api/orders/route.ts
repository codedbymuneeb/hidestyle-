import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminOrderNotification } from '@/lib/email'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { customerName, customerEmail, phone, shippingAddress, items, totalAmount, paymentMethod } = body

        // Validate required fields
        if (!customerName || !customerEmail || !totalAmount || !items) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Create Order
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                phone: phone || '',
                shippingAddress: shippingAddress || '',
                items: JSON.stringify(items), // Store items as JSON
                totalAmount: Number(totalAmount),
                paymentMethod: paymentMethod || 'cod',
                paymentStatus: 'pending',
                orderStatus: 'new',
                isNew: true
            }
        })

        // Send Admin Notification
        try {
            await sendAdminOrderNotification(order)
        } catch (error) {
            console.error("Notification failed:", error)
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Order creation failed:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
