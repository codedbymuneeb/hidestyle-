'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface Product {
    id: string
    title: string
    price: number
    inventory: number
    category: {
        name: string
    }
    subcategory: {
        name: string
    } | null
    status: string
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/products')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setProducts(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load products',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    async function handleDelete(productId: string, productTitle: string) {
        if (!confirm(`Are you sure you want to delete "${productTitle}"?`)) {
            return
        }

        setDeleting(productId)
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete')

            toast({
                title: 'Success',
                description: 'Product deleted successfully',
                variant: 'success'
            })

            fetchProducts()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete product',
                variant: 'destructive'
            })
        } finally {
            setDeleting(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <Link href="/admin/products/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Subcategory</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Inventory</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No products found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell>{product.category.name}</TableCell>
                                    <TableCell>
                                        {product.subcategory ? (
                                            <span className="text-sm text-muted-foreground">
                                                {product.subcategory.name}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                                    <TableCell>{product.inventory}</TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${product.status === 'published'
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                            }`}>
                                            {product.status || 'draft'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.push(`/admin/products/${product.id}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(product.id, product.title)}
                                                disabled={deleting === product.id}
                                            >
                                                {deleting === product.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
