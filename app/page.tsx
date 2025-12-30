import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
    const featuredProducts = await prisma.product.findMany({
        where: { status: 'published' },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div
                        className="w-full h-full bg-[url('https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center animate-scale-in"
                        style={{ animationDuration: '10s' }}
                    />
                </div>

                <div className="container relative z-20 text-center space-y-8 max-w-4xl px-4">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase animate-fade-in-up">
                        HIDESTYLE
                    </h1>
                    <div className="h-px w-24 bg-white/50 mx-auto" />
                    <h2 className="text-xl md:text-2xl font-light tracking-wide text-zinc-200 text-balance animate-fade-in-up delay-100">
                        Premium footwear. Comfort, durability, and modern design.
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-fade-in-up delay-200">
                        <Link href="/products?sort=best-selling">
                            <Button size="lg" className="min-w-[200px] h-14 text-base font-semibold bg-white text-black hover:bg-zinc-200 rounded-none border-0">
                                SHOP BESTSELLERS
                            </Button>
                        </Link>
                        <Link href="/products">
                            <Button variant="outline" size="lg" className="min-w-[200px] h-14 text-base font-semibold text-white border-white hover:bg-white/10 rounded-none bg-transparent">
                                EXPLORE COLLECTION
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="py-24 bg-white text-black">
                <div className="container space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-100 pb-6">
                        <div className="space-y-2">
                            <span className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">This Season</span>
                            <h3 className="text-4xl font-bold tracking-tight">New Arrivals</h3>
                        </div>
                        <Link href="/products?sort=newest" className="group flex items-center text-sm font-medium hover:text-zinc-600 transition-colors">
                            View all products
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-zinc-400">
                                <p>Loading premium selection...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Trust Signals */}
            <section className="bg-zinc-50 border-t border-zinc-100 py-20">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-black text-white rounded-full mb-6">
                                <Truck className="h-5 w-5" />
                            </div>
                            <h4 className="text-lg font-bold">Fast Global Shipping</h4>
                            <p className="text-sm text-zinc-500 max-w-xs mx-auto">Express delivery to 180+ countries with transparent tracking.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-black text-white rounded-full mb-6">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h4 className="text-lg font-bold">Secure Checkout</h4>
                            <p className="text-sm text-zinc-500 max-w-xs mx-auto">Protected by industry-leading encryption and Stripe payments.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 flex items-center justify-center bg-black text-white rounded-full mb-6">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <h4 className="text-lg font-bold">Premium Quality</h4>
                            <p className="text-sm text-zinc-500 max-w-xs mx-auto">Expertly crafted with hand-picked materials for lasting comfort.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
