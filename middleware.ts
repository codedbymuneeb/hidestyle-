import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // Return unauthorized if no token or role is not admin for admin routes
        // if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
        //    return NextResponse.rewrite(new URL("/auth/login?message=Unauthorized", req.url))
        // }
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // !!token,
        },
    }
)

export const config = {
    matcher: ["/admin/:path*"],
}
