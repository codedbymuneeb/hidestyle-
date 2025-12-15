import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const CATEGORY_IMAGES: Record<string, string> = {
    'sneakers': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1600',
    'formal': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1600',
    'boots': 'https://images.unsplash.com/photo-1608256246200-53e635b5b69f?q=80&w=1600',
    'running': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1600',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600'

export default async function ProductListingPage({ params }: { params: { category: string, subcategory: string } }) {
    const category = await prisma.category.findUnique({
        where: { slug: params.category },
        include: { subcategories: true }
    })

    if (!category) return notFound()

    const subcategory = category.subcategories.find(s => s.slug === params.subcategory)
    if (!subcategory) return notFound()

    const products = await prisma.product.findMany({
        where: { subcategoryId: subcategory.id },
        include: { category: true, subcategory: true }
    })

    const heroImage = CATEGORY_IMAGES[category.slug] || DEFAULT_IMAGE

    return (
        <div className="min-h-screen flex flex-col">
            {/* Subcategory Hero */}
            <div className="relative h-[30vh] min-h-[250px] w-full overflow-hidden flex items-center justify-center">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url('${heroImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="relative z-20 text-center text-white space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-2">
                        <Link href="/categories" className="hover:text-white transition-colors">Collections</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href={`/categories/${category.slug}`} className="hover:text-white transition-colors">{category.name}</Link>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in-up">{subcategory.name}</h1>
                </div>
            </div>

            <div className="container py-8 space-y-8">
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Showing {products.length} results</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p, i) => (
                        <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground bg-muted/30 rounded-lg">
                        <p className="text-lg">No products found in this collection.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
