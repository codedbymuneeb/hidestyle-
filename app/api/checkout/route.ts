import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items, email } = body

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty or invalid' },
                { status: 400 }
            )
        }

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            )
        }

        // Validate and sanitize each item
        const line_items = items.map((item: any) => {
            // Validate required item fields
            if (!item.title || !item.price || !item.quantity) {
                throw new Error('Invalid item data: missing required fields')
            }

            // Ensure price is a valid number
            const price = typeof item.price === 'number' ? item.price : parseInt(item.price, 10)
            if (isNaN(price) || price <= 0) {
                throw new Error('Invalid item price')
            }

            // Ensure quantity is valid
            const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10)
            if (isNaN(quantity) || quantity <= 0) {
                throw new Error('Invalid item quantity')
            }

            // Handle images safely - ensure it's an array and has valid values
            let images: string[] = []
            if (item.images) {
                if (Array.isArray(item.images)) {
                    images = item.images.filter((img: any) => img && typeof img === 'string')
                } else if (typeof item.images === 'string') {
                    images = [item.images]
                }
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        images: images.length > 0 ? [images[0]] : [],
                    },
                    unit_amount: price, // cents
                },
                quantity: quantity,
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
            customer_email: email,
            metadata: {
                // We can pass order info here to recover in webhook
                items: JSON.stringify(items.map((i: any) => ({
                    id: i.id || 'unknown',
                    quantity: i.quantity
                })))
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Checkout error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}
