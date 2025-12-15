'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, User as UserIcon } from 'lucide-react'
import { Button } from './ui/button'
import { useCart } from './providers/CartProvider'

export function Header() {
    const { cartCount } = useCart()
    return (
        <header className="glass-header">
            <div className="container flex h-16 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">HIDESTYLE</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">Categories</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here */}
                    </div>
                    <nav className="flex items-center gap-2">
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                        {cartCount}
                                    </span>
                                )}
                                <span className="sr-only">Cart</span>
                            </Button>
                        </Link>
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <UserIcon className="h-5 w-5" />
                                <span className="sr-only">Account</span>
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
