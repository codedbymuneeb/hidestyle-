# Hidestyle Store

Full-stack Next.js E-commerce repository.

## Getting Started

1. **Install Dependencies**
   ```bash
   cd hidestyle-store
   npm install
   # or
   pnpm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your values (Postgres Connection, Stripe Keys, etc).

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   # or
   npx prisma migrate dev
   
   # Seed data
   npx ts-node prisma/seed.ts
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Features

- **Next.js 14 App Router**
- **Admin Dashboard**: `/admin` (Manage Categories, Products)
- **Stripe Checkout**: Integrated payment flow.
- **Authentication**: NextAuth.js (Email/Google).
- **Manual Product Entry**: Admin form with image URL support.
- **Responsive Design**: Tailwind CSS + Shadcn UI.
