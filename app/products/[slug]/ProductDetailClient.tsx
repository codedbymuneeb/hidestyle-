'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/providers/CartProvider'

interface Product {
    id: string
    title: string
    slug: string
    description: string | null
    price: number
    images: string
    sizes: string | null
    colors: string | null
    inventory: number
    category: { name: string }
    subcategory: { name: string } | null
}

export default function ProductDetailClient({ product }: { product: Product }) {
    const router = useRouter()
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)

    // Parse JSON fields
    const images: string[] = (() => {
        try {
            return JSON.parse(product.images) as string[]
        } catch {
            return []
        }
    })()

    const sizes: string[] = (() => {
        try {
            return product.sizes ? JSON.parse(product.sizes) as string[] : []
        } catch {
            return []
        }
    })()

    const colors: string[] = (() => {
        try {
            return product.colors ? JSON.parse(product.colors) as string[] : []
        } catch {
            return []
        }
    })()

    // Auto-select first size and color if available
    useEffect(() => {
        if (sizes.length > 0 && !selectedSize) setSelectedSize(sizes[0])
        if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0])
    }, [sizes, colors, selectedSize, selectedColor])

    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            images: product.images,
            quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined
        })
        router.push('/checkout')
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="space-y-4">
                        <div className="aspect-square relative bg-muted rounded-2xl overflow-hidden border shadow-lg">
                            {images[0] && (
                                <Image
                                    src={images[0]}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground uppercase tracking-wide">
                                {product.category.name}
                                {product.subcategory && ` / ${product.subcategory.name}`}
                            </p>
                            <h1 className="text-4xl font-bold tracking-tight">{product.title}</h1>
                            <p className="text-3xl font-semibold text-primary">
                                ${(product.price / 100).toFixed(2)}
                            </p>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="prose prose-sm max-w-none">
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Available Sizes */}
                        {sizes.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-sm font-semibold uppercase tracking-wide">
                                    Select Size
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-5 py-3 border-2 rounded-lg transition-all font-medium ${selectedSize === size
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-input hover:border-primary hover:bg-primary/5'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Colors */}
                        {colors.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-sm font-semibold uppercase tracking-wide">
                                    Select Color
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-5 py-3 border-2 rounded-lg transition-all font-medium capitalize ${selectedColor === color
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-input hover:border-primary hover:bg-primary/5'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold uppercase tracking-wide">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 border-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                                    className="px-4 py-2 border-2 rounded-lg hover:bg-muted transition-colors"
                                    disabled={quantity >= product.inventory}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Stock Info */}
                        <div className="pt-2">
                            <p className="text-sm text-muted-foreground">
                                {product.inventory > 0 ? (
                                    <span className="text-green-600 font-medium">In Stock ({product.inventory} available)</span>
                                ) : (
                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                )}
                            </p>
                        </div>

                        {/* Add to Cart */}
                        <div className="pt-4 space-y-3">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full text-lg py-6 rounded-xl"
                                disabled={product.inventory === 0}
                            >
                                Add to Cart
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Free shipping on orders over $50
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
