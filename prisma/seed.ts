import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clean up order matters due to foreign keys
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.subcategory.deleteMany() // Delete subcategories before categories
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // Categories
    // Create Admin User
    await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin@hidestyle.com',
            password: 'password123',
            role: 'admin',
        }
    })

    const sneakers = await prisma.category.create({
        data: {
            name: 'Sneakers',
            slug: 'sneakers',
            subcategories: {
                create: [
                    { name: 'Low Top', slug: 'low-top' },
                    { name: 'High Top', slug: 'high-top' },
                    { name: 'Running', slug: 'running' },
                ],
            },
        },
    })

    const formals = await prisma.category.create({
        data: {
            name: 'Formal',
            slug: 'formal',
            subcategories: {
                create: [
                    { name: 'Oxfords', slug: 'oxfords' },
                    { name: 'Loafers', slug: 'loafers' },
                ],
            },
        },
    })

    // PRODUCTS
    // 1. Running Shoe
    await prisma.product.create({
        data: {
            title: 'Air Stride Max',
            description: 'Experience ultimate comfort with our flagship running shoe. Breathable mesh and responsive cushioning for long distances.',
            price: 12999, // $129.99
            inventory: 50,
            slug: 'air-stride-max',
            categoryId: sneakers.id,
            subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: 'running' } }))?.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070']),
            sizes: JSON.stringify(['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']),
            colors: JSON.stringify(['Black', 'White', 'Blue']),
        }
    })

    // 2. High Top Sneaker
    await prisma.product.create({
        data: {
            title: 'Court Legend High',
            description: 'Dominate the court or the streets. Premium leather construction with iconic high-top silhouette.',
            price: 15999,
            inventory: 30,
            slug: 'court-legend-high',
            categoryId: sneakers.id,
            subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: 'high-top' } }))?.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012']),
            sizes: JSON.stringify(['UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']),
            colors: JSON.stringify(['Black', 'Red', 'White']),
        }
    })

    // 3. Loafer
    await prisma.product.create({
        data: {
            title: 'Classic Penny Loafer',
            description: 'Timeless elegance for the modern gentleman. Hand-stitched leather sole ideal for office or formal events.',
            price: 18999,
            inventory: 20,
            slug: 'classic-penny-loafer',
            categoryId: formals.id,
            subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: 'loafers' } }))?.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=2000']),
            sizes: JSON.stringify(['UK 7', 'UK 8', 'UK 9', 'UK 10']),
            colors: JSON.stringify(['Brown', 'Black']),
        }
    })

    // 4. Low Top
    await prisma.product.create({
        data: {
            title: 'Street Lows',
            description: 'Everyday casual comfort. Minimalist design fits any outfit, from jeans to shorts.',
            price: 8999,
            inventory: 100,
            slug: 'street-lows',
            categoryId: sneakers.id,
            subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: 'low-top' } }))?.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1521774971864-62e842046145?q=80&w=1969']),
            sizes: JSON.stringify(['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']),
            colors: JSON.stringify(['White', 'Black', 'Grey']),
        }
    })

    console.log('Shoe Store Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
