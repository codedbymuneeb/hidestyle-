'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Category {
    id: string
    name: string
    subcategories: { id: string; name: string }[]
}

export default function CreateProductPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        inventory: '',
        slug: '',
        categoryId: '',
        subcategoryId: '',
        imageUrl: '',
        status: 'draft' // Default to draft
    })

    // Fetch Categories for Select
    useEffect(() => {
        async function fetchCats() {
            const res = await fetch('/api/categories') // Ensure this API exists or use server action
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        }
        fetchCats()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Auto-generate slug from title if empty
        if (name === 'title' && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
                    images: formData.imageUrl, // Single image for now as per prompt "Image Upload" (URL)
                })
            })

            if (!res.ok) {
                if (res.status === 401) throw new Error("Unauthorized: Admin Access Only")
                throw new Error('Failed to create product')
            }

            toast({
                title: 'Success',
                description: 'Product created successfully',
                variant: 'success'
            })
            router.push('/admin/products')
            router.refresh()
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const selectedCategory = categories.find(c => c.id === formData.categoryId)

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-card">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required placeholder="Product Name" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required placeholder="product-url-slug" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Product details..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required placeholder="0.00" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="inventory">Inventory</Label>
                        <Input id="inventory" name="inventory" type="number" value={formData.inventory} onChange={handleChange} required placeholder="0" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                    <p className="text-xs text-muted-foreground">Enter a direct image link (Unsplash, Cloudinary, etc.)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subcategoryId">Subcategory</Label>
                        <select
                            id="subcategoryId"
                            name="subcategoryId"
                            value={formData.subcategoryId}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!selectedCategory}
                        >
                            <option value="">Select Subcategory</option>
                            {selectedCategory?.subcategories.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Live)</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {formData.status === 'published' ? 'Publish Product' : 'Save Draft'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
