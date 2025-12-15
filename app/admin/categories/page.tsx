'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { PlusCircle, Pencil, Trash2, FolderTree, ChevronDown, ChevronRight, Loader2, Plus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

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
    _count?: {
        products: number
    }
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({ name: '', slug: '' })
    const [submitting, setSubmitting] = useState(false)

    // Subcategory states
    const [addingSubcategoryFor, setAddingSubcategoryFor] = useState<string | null>(null)
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
    const [subcategoryFormData, setSubcategoryFormData] = useState({ name: '', slug: '' })
    const [submittingSubcategory, setSubmittingSubcategory] = useState(false)

    const { toast } = useToast()

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/categories')
            const data = await res.json()
            setCategories(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load categories',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    function toggleExpand(categoryId: string) {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    function handleEdit(category: Category) {
        setEditingCategory(category)
        setFormData({ name: category.name, slug: category.slug })
        setShowCreateForm(true)
    }

    function handleCancelEdit() {
        setEditingCategory(null)
        setFormData({ name: '', slug: '' })
        setShowCreateForm(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)

        try {
            if (editingCategory) {
                const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                if (!res.ok) throw new Error('Failed to update category')

                toast({
                    title: 'Success',
                    description: 'Category updated successfully',
                    variant: 'success'
                })
            } else {
                const res = await fetch('/api/admin/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                if (!res.ok) throw new Error('Failed to create category')

                toast({
                    title: 'Success',
                    description: 'Category created successfully',
                    variant: 'success'
                })
            }

            handleCancelEdit()
            fetchCategories()
        } catch (error) {
            toast({
                title: 'Error',
                description: editingCategory ? 'Failed to update category' : 'Failed to create category',
                variant: 'destructive'
            })
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(categoryId: string, categoryName: string) {
        if (!confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all subcategories.`)) {
            return
        }

        try {
            const res = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete category')

            toast({
                title: 'Success',
                description: 'Category deleted successfully',
                variant: 'success'
            })

            fetchCategories()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete category',
                variant: 'destructive'
            })
        }
    }

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    function handleNameChange(name: string) {
        setFormData({
            name,
            slug: editingCategory ? formData.slug : generateSlug(name)
        })
    }

    // Subcategory functions
    function handleAddSubcategory(categoryId: string) {
        setAddingSubcategoryFor(categoryId)
        setSubcategoryFormData({ name: '', slug: '' })
        // Auto-expand the category
        const newExpanded = new Set(expandedCategories)
        newExpanded.add(categoryId)
        setExpandedCategories(newExpanded)
    }

    function handleSubcategoryNameChange(name: string) {
        setSubcategoryFormData({
            name,
            slug: generateSlug(name)
        })
    }

    async function handleSubmitSubcategory(e: React.FormEvent, categoryId: string) {
        e.preventDefault()
        setSubmittingSubcategory(true)

        try {
            const res = await fetch('/api/admin/subcategories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...subcategoryFormData,
                    categoryId
                })
            })

            if (!res.ok) throw new Error('Failed to create subcategory')

            toast({
                title: 'Success',
                description: 'Subcategory created successfully',
                variant: 'success'
            })

            setAddingSubcategoryFor(null)
            setSubcategoryFormData({ name: '', slug: '' })
            fetchCategories()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create subcategory',
                variant: 'destructive'
            })
        } finally {
            setSubmittingSubcategory(false)
        }
    }

    function handleEditSubcategory(subcategory: Subcategory) {
        setEditingSubcategory(subcategory)
        setSubcategoryFormData({ name: subcategory.name, slug: subcategory.slug })
        setAddingSubcategoryFor(null)
    }

    async function handleUpdateSubcategory(e: React.FormEvent) {
        e.preventDefault()
        if (!editingSubcategory) return

        setSubmittingSubcategory(true)

        try {
            const res = await fetch(`/api/admin/subcategories/${editingSubcategory.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subcategoryFormData)
            })

            if (!res.ok) throw new Error('Failed to update subcategory')

            toast({
                title: 'Success',
                description: 'Subcategory updated successfully',
                variant: 'success'
            })

            setEditingSubcategory(null)
            setSubcategoryFormData({ name: '', slug: '' })
            fetchCategories()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update subcategory',
                variant: 'destructive'
            })
        } finally {
            setSubmittingSubcategory(false)
        }
    }

    async function handleDeleteSubcategory(subcategoryId: string, subcategoryName: string) {
        if (!confirm(`Are you sure you want to delete "${subcategoryName}"?`)) {
            return
        }

        try {
            const res = await fetch(`/api/admin/subcategories/${subcategoryId}`, {
                method: 'DELETE'
            })

            if (!res.ok) throw new Error('Failed to delete subcategory')

            toast({
                title: 'Success',
                description: 'Subcategory deleted successfully',
                variant: 'success'
            })

            fetchCategories()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete subcategory',
                variant: 'destructive'
            })
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
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FolderTree className="h-8 w-8 text-primary" />
                        Categories Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Organize your products with categories and subcategories
                    </p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && (
                <Card className="border-primary/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
                        <CardDescription>
                            {editingCategory ? 'Update category details' : 'Add a new category to organize your products'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="e.g., Men's Shoes"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Slug</label>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="e.g., mens-shoes"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        URL-friendly version (auto-generated from name)
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {editingCategory ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editingCategory ? 'Update Category' : 'Create Category'
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Categories Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Categories ({categories.length})</CardTitle>
                    <CardDescription>Manage your product categories and subcategories</CardDescription>
                </CardHeader>
                <CardContent>
                    {categories.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No categories found. Create one to get started.</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Subcategories</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => {
                                        const isExpanded = expandedCategories.has(category.id)
                                        return (
                                            <>
                                                <TableRow key={category.id} className="hover:bg-muted/50">
                                                    <TableCell>
                                                        {(category.subcategories.length > 0 || addingSubcategoryFor === category.id) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6"
                                                                onClick={() => toggleExpand(category.id)}
                                                            >
                                                                {isExpanded ? (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronRight className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{category.name}</TableCell>
                                                    <TableCell>
                                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                                            {category.slug}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary">
                                                                {category.subcategories.length} subcategories
                                                            </Badge>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 text-xs"
                                                                onClick={() => handleAddSubcategory(category.id)}
                                                            >
                                                                <Plus className="h-3 w-3 mr-1" />
                                                                Add Sub
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(category)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => handleDelete(category.id, category.name)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Subcategory Add Form */}
                                                {isExpanded && addingSubcategoryFor === category.id && (
                                                    <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                                                        <TableCell></TableCell>
                                                        <TableCell colSpan={4}>
                                                            <form onSubmit={(e) => handleSubmitSubcategory(e, category.id)} className="flex items-end gap-2 py-2">
                                                                <div className="flex-1 space-y-1">
                                                                    <label className="text-xs font-medium">Subcategory Name</label>
                                                                    <Input
                                                                        value={subcategoryFormData.name}
                                                                        onChange={(e) => handleSubcategoryNameChange(e.target.value)}
                                                                        placeholder="e.g., Running Shoes"
                                                                        className="h-8"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <label className="text-xs font-medium">Slug</label>
                                                                    <Input
                                                                        value={subcategoryFormData.slug}
                                                                        onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, slug: e.target.value })}
                                                                        placeholder="e.g., running-shoes"
                                                                        className="h-8"
                                                                        required
                                                                    />
                                                                </div>
                                                                <Button type="submit" size="sm" disabled={submittingSubcategory}>
                                                                    {submittingSubcategory ? (
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        'Add'
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setAddingSubcategoryFor(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </form>
                                                        </TableCell>
                                                    </TableRow>
                                                )}

                                                {/* Subcategories List */}
                                                {isExpanded && category.subcategories.map((sub) => (
                                                    editingSubcategory?.id === sub.id ? (
                                                        <TableRow key={sub.id} className="bg-blue-50 dark:bg-blue-950/20">
                                                            <TableCell></TableCell>
                                                            <TableCell colSpan={4}>
                                                                <form onSubmit={handleUpdateSubcategory} className="flex items-end gap-2 py-2">
                                                                    <div className="flex-1 space-y-1">
                                                                        <label className="text-xs font-medium">Subcategory Name</label>
                                                                        <Input
                                                                            value={subcategoryFormData.name}
                                                                            onChange={(e) => handleSubcategoryNameChange(e.target.value)}
                                                                            placeholder="e.g., Running Shoes"
                                                                            className="h-8"
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 space-y-1">
                                                                        <label className="text-xs font-medium">Slug</label>
                                                                        <Input
                                                                            value={subcategoryFormData.slug}
                                                                            onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, slug: e.target.value })}
                                                                            placeholder="e.g., running-shoes"
                                                                            className="h-8"
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <Button type="submit" size="sm" disabled={submittingSubcategory}>
                                                                        {submittingSubcategory ? (
                                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                                        ) : (
                                                                            'Update'
                                                                        )}
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setEditingSubcategory(null)
                                                                            setSubcategoryFormData({ name: '', slug: '' })
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </form>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        <TableRow key={sub.id} className="bg-muted/30">
                                                            <TableCell></TableCell>
                                                            <TableCell className="pl-12 text-sm text-muted-foreground">
                                                                ↳ {sub.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                <code className="text-xs bg-background px-2 py-1 rounded">
                                                                    {sub.slug}
                                                                </code>
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7"
                                                                        onClick={() => handleEditSubcategory(sub)}
                                                                    >
                                                                        <Pencil className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                                                        onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                ))}
                                            </>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
