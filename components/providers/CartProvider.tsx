'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'

export type CartItem = {
    id: string
    title: string
    price: number
    images: string // JSON string
    quantity: number
    size?: string
    color?: string
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: string, size?: string, color?: string) => void
    updateQuantity: (itemId: string, quantity: number, size?: string, color?: string) => void
    clearCart: () => void
    cartTotal: number
    cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const { toast } = useToast()

    // Load from local storage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('cart')
            if (stored) {
                setItems(JSON.parse(stored))
            }
        } catch (e) {
            console.error('Failed to load cart', e)
        }
    }, [])

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    function addToCart(newItem: CartItem) {
        setItems(prev => {
            const existing = prev.find(item =>
                item.id === newItem.id &&
                item.size === newItem.size &&
                item.color === newItem.color
            )

            if (existing) {
                return prev.map(item =>
                    (item.id === newItem.id && item.size === newItem.size && item.color === newItem.color)
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                )
            }
            return [...prev, newItem]
        })
        toast({
            title: "Added to cart",
            description: `${newItem.title} added to your cart`
        })
    }

    function removeFromCart(itemId: string, size?: string, color?: string) {
        setItems(prev => prev.filter(item =>
            !(item.id === itemId && item.size === size && item.color === color)
        ))
    }

    function updateQuantity(itemId: string, quantity: number, size?: string, color?: string) {
        if (quantity < 1) return
        setItems(prev => prev.map(item =>
            (item.id === itemId && item.size === size && item.color === color)
                ? { ...item, quantity }
                : item
        ))
    }

    function clearCart() {
        setItems([])
    }

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const cartCount = items.reduce((count, item) => count + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
