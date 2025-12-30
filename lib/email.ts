/**
 * Transactional Email Service (Senior Implementation)
 * This handles sending notifications to admins and confirmation emails to customers.
 * In production, you would use a service like Resend, SendGrid, or Postmark.
 */

interface OrderNotificationData {
    id: string
    customerName: string
    customerEmail: string
    totalAmount: number
    items: string // JSON string
    paymentStatus: string
}

export async function sendAdminOrderNotification(order: OrderNotificationData) {
    const items = JSON.parse(order.items)
    const total = (order.totalAmount / 100).toLocaleString()

    console.log(`
        📧 [EMAIL SENT TO ADMIN]
        Subject: New Order Received – Hidestyle
        
        Order ID: #${order.id.slice(-6).toUpperCase()}
        Customer: ${order.customerName} (${order.customerEmail})
        Total: Rs ${total}
        Payment Status: ${order.paymentStatus.toUpperCase()}
        Items: ${items.length}
        
        View details in your new Admin Dashboard.
    `)

    // Implementation with actual provider would go here:
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `New Order Received – Hidestyle #${order.id.slice(-6).toUpperCase()}`,
    //   html: `...`
    // })
}
