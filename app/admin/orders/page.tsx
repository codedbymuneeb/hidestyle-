'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ShoppingCart, Loader2, Eye, Package, User, Mail, Calendar, DollarSign } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Order {
    id: string
    userId: string | null
    user: {
        email: string
        name: string | null
    } | null
    items: string
    total: number
    status: string
    createdAt: string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [showOrderDetails, setShowOrderDetails] = useState(false)
    const { toast } = useToast()

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/orders')
            if (!res.ok) throw new Error('Failed to fetch orders')
            const data = await res.json()
            setOrders(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load orders',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    async function updateOrderStatus(orderId: string, newStatus: string) {
        setUpdatingStatus(orderId)
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            })

            if (!res.ok) throw new Error('Failed to update status')

            toast({
                title: 'Success',
                description: 'Order status updated successfully',
                variant: 'success'
            })

            fetchOrders()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update order status',
                variant: 'destructive'
            })
        } finally {
            setUpdatingStatus(null)
        }
    }

    function getStatusBadgeVariant(status: string) {
        switch (status) {
            case 'paid':
                return 'success'
            case 'shipped':
                return 'info'
            case 'delivered':
                return 'success'
            case 'cancelled':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    function parseOrderItems(itemsJson: string) {
        try {
            const items = JSON.parse(itemsJson)
            return Array.isArray(items) ? items : []
        } catch {
            return []
        }
    }

    function handleViewDetails(order: Order) {
        setSelectedOrder(order)
        setShowOrderDetails(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ShoppingCart className="h-8 w-8 text-primary" />
                        Orders Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage all customer orders
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                </div>
            </div>

            {/* Order Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter(o => o.status === 'pending').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {orders.filter(o => o.status === 'paid').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Shipped</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {orders.filter(o => o.status === 'shipped').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {orders.filter(o => o.status === 'delivered').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>Complete list of customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No orders yet. Orders will appear here once customers make purchases.</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => {
                                        const items = parseOrderItems(order.items)
                                        return (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-mono text-xs">
                                                    {order.id.substring(0, 8)}...
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">
                                                            {order.user?.name || 'Guest'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {order.user?.email || 'No email'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {items.length} item{items.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    ${(order.total / 100).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        disabled={updatingStatus === order.id}
                                                        className="text-xs border rounded px-2 py-1 bg-background"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="View Details"
                                                        onClick={() => handleViewDetails(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information for order #{selectedOrder?.id.substring(0, 8)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Customer
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-medium">{selectedOrder.user?.name || 'Guest'}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            <Mail className="h-3 w-3" />
                                            {selectedOrder.user?.email || 'No email'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold">
                                            ${(selectedOrder.total / 100).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Status */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="text-sm">
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </Badge>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Order Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {parseOrderItems(selectedOrder.items).map((item: any, index: number) => (
                                            <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.title || item.name || 'Product'}</p>
                                                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                                                        <span>Quantity: {item.quantity || 1}</span>
                                                        {item.price && (
                                                            <span>Price: ${(item.price / 100).toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                    {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                                                    {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                                                </div>
                                                {item.price && item.quantity && (
                                                    <div className="text-right">
                                                        <p className="font-semibold">
                                                            ${((item.price * item.quantity) / 100).toFixed(2)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-xl font-bold">
                                            ${(selectedOrder.total / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order ID */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Order ID</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                        {selectedOrder.id}
                                    </code>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
