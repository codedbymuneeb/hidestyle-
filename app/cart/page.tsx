'use client'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/providers/CartProvider'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart()

    return (
        <div className="container py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {items.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-lg text-muted-foreground mb-4">Your cart is currently empty.</p>
                    <Link href="/categories">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            let imageUrl = ''
                            try {
                                const imgs = JSON.parse(item.images)
                                imageUrl = imgs[0] || ''
                            } catch {
                                imageUrl = ''
                            }

                            return (
                                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 p-4 border rounded-lg">
                                    <div className="relative h-24 w-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                        {imageUrl && (
                                            <Image src={imageUrl} alt={item.title} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.size && `Size: ${item.size}`}
                                            {item.size && item.color && ' | '}
                                            {item.color && `Color: ${item.color}`}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <p className="font-semibold">${(item.price * item.quantity / 100).toFixed(2)}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 bg-muted/20 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>${(cartTotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                                <span>Total</span>
                                <span>${(cartTotal / 100).toFixed(2)}</span>
                            </div>
                            <Link href="/checkout" className="w-full">
                                <Button className="w-full" size="lg">Proceed to Checkout</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
