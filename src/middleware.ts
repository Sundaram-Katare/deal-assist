import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // We need to fetch user's org info from DB if possible, but middleware is edge so we can't use Prisma easily.
    // Instead, we will handle onboarding redirection in a layout or specific page.
    
    // For now, let's just let authenticated users access /onboarding and /dashboard
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
