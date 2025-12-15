'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
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

const AVAILABLE_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']
const AVAILABLE_COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Grey']

export default function CreateProductPage() {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([])
    const [imageUrl, setImageUrl] = useState<string>('')
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])

    // Fetch categories on mount
    useEffect(() => {
        fetch('/api/admin/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Failed to fetch categories', err))
    }, [])

    // Update subcategories when category changes
    useEffect(() => {
        if (selectedCategory) {
            const category = categories.find(c => c.id === selectedCategory)
            setAvailableSubcategories(category ? category.subcategories : [])
        } else {
            setAvailableSubcategories([])
        }
    }, [selectedCategory, categories])

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error('Upload failed')

            const data = await res.json()
            setImageUrl(data.url)
        } catch (error) {
            console.error(error)
            alert('Image upload failed')
        } finally {
            setUploading(false)
        }
    }

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
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data: any = Object.fromEntries(formData.entries())

        // Add image URL and sizes/colors
        data.images = imageUrl
        data.sizes = JSON.stringify(selectedSizes)
        data.colors = JSON.stringify(selectedColors)

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                body: JSON.stringify(data)
            })
            if (!res.ok) throw new Error('Failed to create product')

            window.location.href = '/admin/products'
        } catch (error) {
            console.error(error)
            alert('Error creating product. Please check your inputs.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Product Title</label>
                    <Input name="title" required placeholder="Air Max 90" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        required
                        placeholder="Premium running shoe with responsive cushioning..."
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <Input name="slug" required placeholder="air-max-90" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price (in cents)</label>
                        <Input name="price" type="number" required placeholder="2999" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Inventory</label>
                        <Input name="inventory" type="number" required placeholder="100" />
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
                    <label className="text-sm font-medium">Product Image</label>
                    <div className="space-y-3">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                        {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                        {imageUrl && (
                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                                <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>
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

                <Button type="submit" disabled={loading || uploading || !imageUrl}>
                    {loading ? 'Creating...' : 'Create Product'}
                </Button>
            </form>
        </div>
    )
}
