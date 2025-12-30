'use client'

import { useState } from 'react'
import { useCart } from '@/components/providers/CartProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    if (items.length === 0) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <p>Your cart is empty.</p>
                <Button className="mt-4" onClick={() => router.push('/')}>Go Shopping</Button>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            customerName: formData.get('name'),
            customerEmail: formData.get('email'),
            phone: formData.get('phone'),
            shippingAddress: formData.get('address'),
            items: items,
            totalAmount: cartTotal,
            paymentMethod: 'cod'
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error('Order failed')

            toast({
                title: "Order Placed!",
                description: "Your order has been received successfully."
            })

            clearCart()
            router.push('/checkout/success')
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to place order. Please try again.",
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" required placeholder="Ali Khan" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required placeholder="alikhan@gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" required placeholder="0301XXXXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Textarea id="address" name="address" required placeholder="House 22, Block B, Lahore" />
                                </div>

                                <div className="pt-4">
                                    <Label>Payment Method</Label>
                                    <div className="mt-2 p-4 border rounded-md bg-muted/20 flex items-center justify-between">
                                        <span className="font-medium">Cash on Delivery (COD)</span>
                                        <span className="text-green-600 text-sm font-bold">ACTIVE</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Pay cash upon receiving your order.</p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Section */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map(item => {
                                let imageUrl = ''
                                try {
                                    imageUrl = JSON.parse(item.images)[0]
                                } catch { }

                                return (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="relative h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                            {imageUrl && <Image src={imageUrl} alt={item.title} fill className="object-cover" />}
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                            {item.size && <p className="text-muted-foreground">Size: {item.size}</p>}
                                        </div>
                                        <p className="font-medium">${(item.price * item.quantity / 100).toFixed(2)}</p>
                                    </div>
                                )
                            })}

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${(cartTotal / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2">
                                    <span>Total</span>
                                    <span>${(cartTotal / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" form="checkout-form" disabled={isLoading}>
                                {isLoading ? 'Placing Order...' : 'Place Order Now'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
