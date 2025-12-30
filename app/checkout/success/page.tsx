'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CheckoutSuccessPage() {
    const router = useRouter()

    return (
        <div className="container py-24 flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Order Placed Successfully!</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Thank you for your purchase. We have received your order and will begin processing it right away.
            </p>
            <div className="flex gap-4 pt-4">
                <Button onClick={() => router.push('/')}>Continue Shopping</Button>
                <Button variant="outline" onClick={() => router.push('/products')}>View Collection</Button>
            </div>
        </div>
    )
}
