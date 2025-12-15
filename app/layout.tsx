import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/providers/CartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Hidestyle Store",
    description: "Modern E-commerce",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, outfit.variable)}>
                <CartProvider>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Toaster />
                </CartProvider>
            </body>
        </html>
    );
}
