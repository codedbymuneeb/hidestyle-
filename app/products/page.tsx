import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'

export default async function AllProductsPage() {
    const products = await prisma.product.findMany({
        where: {
            status: 'published'
        },
        orderBy: { createdAt: 'desc' },
        include: { category: true, subcategory: true }
    })

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[30vh] min-h-[250px] w-full overflow-hidden flex items-center justify-center">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="relative z-20 text-center text-white space-y-2">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight animate-fade-in-up">All Products</h1>
                    <p className="text-lg text-gray-200 animate-fade-in-up delay-100">
                        Browse our complete collection
                    </p>
                </div>
            </div>

            <div className="container py-12 space-y-8">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
                    <span className="text-muted-foreground text-sm">{products.length} Products</span>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, i) => (
                            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-lg">
                        <p className="text-lg">No products available yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
