'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
    return (
        <div className="container min-h-[60vh] flex flex-col items-center justify-center text-center py-12">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Thank you for your order. We have received your details and will process your order shortly. You will receive a confirmation soon.
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
                <Link href="/categories">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        </div>
    )
}
