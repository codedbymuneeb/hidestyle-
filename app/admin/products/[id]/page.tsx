'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Subcategory {
    id: string
    name: string
    slug: string
}

interface Category {
    id: string
    name: string
    slug: string
    subcategories: Subcategory[]
}

interface Product {
    id: string
    title: string
    description: string
    slug: string
    price: number
    inventory: number
    categoryId: string
    subcategoryId: string | null
    images: string
    sizes: string | null
    colors: string | null
    status: string
}

const AVAILABLE_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']
const AVAILABLE_COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Grey']

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [product, setProduct] = useState<Product | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([])
    const [imageUrl, setImageUrl] = useState<string>('')
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [status, setStatus] = useState<string>('draft')

    useEffect(() => {
        Promise.all([
            fetch('/api/categories').then(res => res.json()), // Updated API endpoint
            fetch(`/api/products/${params.id}`).then(res => res.json())
        ]).then(([categoriesData, productData]) => {
            setCategories(categoriesData)
            setProduct(productData)
            setSelectedCategory(productData.categoryId)
            setStatus(productData.status || 'draft')

            // Parse images
            try {
                const imgs = JSON.parse(productData.images)
                setImageUrl(Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '')
            } catch {
                setImageUrl('')
            }

            // Parse sizes
            try {
                const sizes = productData.sizes ? JSON.parse(productData.sizes) : []
                setSelectedSizes(Array.isArray(sizes) ? sizes : [])
            } catch {
                setSelectedSizes([])
            }

            // Parse colors
            try {
                const colors = productData.colors ? JSON.parse(productData.colors) : []
                setSelectedColors(Array.isArray(colors) ? colors : [])
            } catch {
                setSelectedColors([])
            }

            setLoading(false)
        }).catch(err => {
            console.error('Failed to load data', err)
            alert('Failed to load product')
            router.push('/admin/products')
        })
    }, [params.id, router])

    useEffect(() => {
        if (selectedCategory) {
            const category = categories.find(c => c.id === selectedCategory)
            setAvailableSubcategories(category ? category.subcategories : [])
        } else {
            setAvailableSubcategories([])
        }
    }, [selectedCategory, categories])

    function toggleSize(size: string) {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        )
    }

    function toggleColor(color: string) {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const data: any = Object.fromEntries(formData.entries())

        data.images = imageUrl
        data.sizes = JSON.stringify(selectedSizes)
        data.colors = JSON.stringify(selectedColors)
        data.status = status

        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (!res.ok) throw new Error('Failed to update product')

            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Error updating product')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading || !product) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-card">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Product Title</label>
                    <Input name="title" required defaultValue={product.title} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        required
                        defaultValue={product.description || ''}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <Input name="slug" required defaultValue={product.slug} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price (in cents)</label>
                        <Input name="price" type="number" required defaultValue={product.price} />
                        <p className="text-xs text-muted-foreground ml-1">Example: 2000 = $20.00</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Inventory</label>
                        <Input name="inventory" type="number" required defaultValue={product.inventory} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            name="categoryId"
                            required
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subcategory</label>
                        <select
                            name="subcategoryId"
                            disabled={!selectedCategory || availableSubcategories.length === 0}
                            defaultValue={product.subcategoryId || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select Subcategory</option>
                            {availableSubcategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Live)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Product Image URL</label>
                    <Input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL"
                    />
                    {imageUrl && (
                        <div className="relative w-32 h-32 border rounded-lg overflow-hidden mt-2">
                            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_SIZES.map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-4 py-2 rounded-md border transition-colors ${selectedSizes.includes(size)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-muted'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Available Colors</label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => toggleColor(color)}
                                className={`px-4 py-2 rounded-md border transition-colors ${selectedColors.includes(color)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-muted'
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={submitting} className={status === 'published' ? '' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}>
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            status === 'published' ? 'Update & Publish' : 'Update Draft'
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
