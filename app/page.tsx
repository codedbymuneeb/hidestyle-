import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
    const featuredProducts = await prisma.product.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-black text-white py-20 lg:py-32 overflow-hidden">
                {/* Shoe Store Hero Image - Floating Sneakers */}
                <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974')] bg-cover bg-center" />
                <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
                        Step Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Game</span>
                    </h1>
                    <p className="max-w-2xl text-lg md:text-xl text-gray-200 font-medium animate-fade-in-up delay-100">
                        Discover the ultimate collection of performance sneakers and premium formal wear. Your journey starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
                        <Link href="/categories">
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 w-full sm:w-auto text-lg px-8 border-none hover:scale-105 transition-transform">
                                Shop All Shoes
                            </Button>
                        </Link>
                        <Link href="/categories/sneakers">
                            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/20 w-full sm:w-auto text-lg px-8 bg-transparent hover:scale-105 transition-transform">
                                View Sneakers
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-muted/30 rounded-lg">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Premium Quality</h3>
                    <p className="text-muted-foreground">Hand-picked materials ensuring comfort and durability.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-muted/30 rounded-lg">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Fast Shipping</h3>
                    <p className="text-muted-foreground">Express delivery worldwide within 3-5 business days.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4 p-6 bg-muted/30 rounded-lg">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Secure Payment</h3>
                    <p className="text-muted-foreground">100% secure checkout with Stripe protection.</p>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container py-12 space-y-8">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-3xl font-bold tracking-tight">Featured Drops</h2>
                    <Link href="/categories" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                        View all <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        // Fallback placeholders if no products
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground">
                                Product Placeholder
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
