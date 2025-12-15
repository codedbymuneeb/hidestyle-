import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'

const CATEGORY_IMAGES: Record<string, string> = {
    'sneakers': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1600',
    'formal': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1600',
    'boots': 'https://images.unsplash.com/photo-1608256246200-53e635b5b69f?q=80&w=1600',
    'running': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1600',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600'

export default async function CategoryPage({ params }: { params: { category: string } }) {
    const category = await prisma.category.findUnique({
        where: { slug: params.category },
        include: {
            subcategories: true,
            products: {
                include: { category: true }
            }
        }
    })

    if (!category) return notFound()

    const heroImage = CATEGORY_IMAGES[category.slug] || DEFAULT_IMAGE

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden flex items-center justify-center">
                <div
                    className="absolute inset-0 z-0 animate-scale-in"
                    style={{
                        backgroundImage: `url('${heroImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative z-20 text-center text-white space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter animate-fade-in-up">{category.name}</h1>
                    <p className="text-lg text-gray-200 capitalize animate-fade-in-up delay-100">Premium Collection</p>
                </div>
            </div>

            <div className="container py-12 space-y-12">
                {/* Subcategories Pills */}
                {category.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-200">
                        {category.subcategories.map(sub => (
                            <Link key={sub.id} href={`/categories/${category.slug}/${sub.slug}`}>
                                <Button variant="outline" className="rounded-full px-6 border-2 hover:bg-foreground hover:text-background transition-colors">
                                    {sub.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}

                {/* All Products Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-2xl font-bold tracking-tight">All {category.name}</h2>
                        <span className="text-muted-foreground text-sm">{category.products.length} Products</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {category.products.length > 0 ? (
                            category.products.map((product, i) => (
                                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-lg">
                                <p>No products found in this category yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
