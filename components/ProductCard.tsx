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
        <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-none">
            <Link href={href}>
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    {images[0] ? (
                        <Image
                            src={images[0]}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No Image
                        </div>
                    )}
                </div>
            </Link>
            <CardContent className="p-4">
                <Link href={href}>
                    <h3 className="font-semibold text-lg hover:underline">{product.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">${(product.price / 100).toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
            </CardFooter>
        </Card>
    )
}
