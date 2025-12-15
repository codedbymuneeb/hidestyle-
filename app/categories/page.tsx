import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

const CATEGORY_IMAGES: Record<string, string> = {
    'sneakers': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800',
    'formal': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=800',
    'boots': 'https://images.unsplash.com/photo-1608256246200-53e635b5b69f?q=80&w=800',
    'running': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800'

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany()

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero with Background Image */}
            <div className="relative h-64 overflow-hidden border-b">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 z-10" />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-white">
                    <h1 className="text-5xl font-bold tracking-tight animate-fade-in-up">Collections</h1>
                    <p className="text-lg mt-3 animate-fade-in-up delay-100">Explore our curated footwear categories</p>
                </div>
            </div>

            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, index) => {
                        const bgImage = CATEGORY_IMAGES[cat.slug] || DEFAULT_IMAGE
                        return (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className={`group relative h-80 overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-xl animate-fade-in-up`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
                                    style={{
                                        backgroundImage: `url('${bgImage}')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/50 transition-colors" />

                                {/* Content */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white">
                                    <h2 className="text-3xl font-bold tracking-tight">{cat.name}</h2>
                                    <span className="mt-4 px-6 py-2 border border-white/50 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors backdrop-blur-sm">
                                        View Collection
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
