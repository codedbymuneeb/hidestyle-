import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, phone, address, items, total } = body

        if (!name || !email || !phone || !address || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create Order in Database
        const order = await prisma.order.create({
            data: {
                status: 'pending',
                total: total,
                items: JSON.stringify(items),
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                shippingAddress: address,
                paymentMethod: 'cod'
            }
        })

        // Webhook Integration (Zapier / Make / Custom)
        const webhookUrl = process.env.ORDER_WEBHOOK_URL
        if (webhookUrl) {
            try {
                // Send formatted data as requested for "Instagram DM trigger" via automation
                const webhookPayload = {
                    event: 'new_order',
                    order_id: order.id,
                    customer: {
                        name,
                        email,
                        phone,
                        address
                    },
                    items: items.map((i: any) => ({
                        product: i.title,
                        quantity: i.quantity,
                        size: i.size,
                        price: i.price / 100
                    })),
                    total: total / 100,
                    payment_method: 'Cash on Delivery',
                    timestamp: new Date().toISOString()
                }

                const webhookRes = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(webhookPayload)
                })

                if (!webhookRes.ok) {
                    console.error('Webhook failed with status:', webhookRes.status, await webhookRes.text())
                } else {
                    console.log('Webhook notification sent successfully')
                }
            } catch (webhookError) {
                console.error('Failed to trigger webhook:', webhookError)
                // Don't fail the order just because webhook failed
            }
        }

        return NextResponse.json({ success: true, orderId: order.id })
    } catch (error) {
        console.error('Order creation error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
