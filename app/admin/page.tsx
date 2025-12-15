import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Package, ShoppingCart, FolderTree, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function AdminDashboard() {
    const productCount = await prisma.product.count()
    const orderCount = await prisma.order.count()
    const categoryCount = await prisma.category.count()

    // Calculate total revenue from orders
    const orders = await prisma.order.findMany({
        where: { status: 'paid' }
    })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    // Get low inventory products
    const lowInventoryProducts = await prisma.product.findMany({
        where: { inventory: { lt: 10 } },
        take: 5,
        orderBy: { inventory: 'asc' }
    })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <TrendingUp className="inline h-3 w-3 mr-1" />
                            From {orderCount} orders
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active products in store
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Lifetime orders
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <FolderTree className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categoryCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Product categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest orders from your store</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                {order.user?.email || 'Guest'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={order.status === 'paid' ? 'success' : 'secondary'}>
                                                {order.status}
                                            </Badge>
                                            <p className="text-sm font-semibold">
                                                ${(order.total / 100).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Low Inventory Alert */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            Low Inventory Alert
                        </CardTitle>
                        <CardDescription>Products running low on stock</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {lowInventoryProducts.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">All products well stocked!</p>
                        ) : (
                            <div className="space-y-4">
                                {lowInventoryProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{product.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                ${(product.price / 100).toFixed(2)}
                                            </p>
                                        </div>
                                        <Badge variant={product.inventory < 5 ? 'destructive' : 'warning'}>
                                            {product.inventory} left
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
