'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from './providers/CartProvider'
import { useRouter } from 'next/navigation'

interface Product {
    id: string
    title: string
    price: number
    slug: string
    images: string
    category: { slug: string }
    subcategory?: { slug: string } | null
}

export function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart()
    const router = useRouter()
    const href = `/products/${product.slug}`

    let images: string[] = [];
    try {
        images = JSON.parse(product.images);
    } catch (e) {
        images = [];
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault() // prevent link navigation
        e.stopPropagation()
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            images: product.images,
            quantity: 1,
            // Default first size/color not selected here, passed undefined
        })
        router.push('/checkout') // Direct redirect as requested
    }

    return (
    return (
        <div className="group relative">
            <Link href={href} className="block aspect-[3/4] relative overflow-hidden bg-zinc-100 mb-4">
                {images[0] ? (
                    <Image
                        src={images[0]}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        No Image
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <Button onClick={handleAddToCart} className="w-full bg-white text-black hover:bg-zinc-100 font-medium">
                        Quick Add
                    </Button>
                </div>
            </Link>
            <div className="space-y-1">
                <Link href={href}>
                    <h3 className="font-medium text-sm text-zinc-900 group-hover:underline decoration-1 underline-offset-4">{product.title}</h3>
                </Link>
                <p className="text-sm font-semibold text-zinc-900">${(product.price / 100).toFixed(2)}</p>
            </div>
        </div>
    )
}
