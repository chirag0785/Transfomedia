import { clerkMiddleware , createRouteMatcher} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
const isPublicRoute = createRouteMatcher([
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/'
])

const isPublicApiRoute = createRouteMatcher([
    '/api/videos',
    '/api/video-upload-notification',
    '/api/webhook',
    '/api/stripe-webhook',
    '/api/get-subscription-plans'
])
export default clerkMiddleware((auth, req) => {
    const {userId,sessionClaims}=auth();
    
    const isAdmin=sessionClaims?.metadata.role==='admin';
    
    const currentUrl=new URL(req.url);
    const isAccessingDashboard=currentUrl.pathname==='/home';
    const isApiRequest=currentUrl.pathname.startsWith('/api');
    if(userId && isPublicRoute(req) && !isAccessingDashboard){
        return NextResponse.redirect(new URL('/home',req.url))
    }
    //not logged in
    if(!userId){
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL('/sign-in',req.url))
        }

        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL('/sign-in',req.url))
        }
    }

    if(!isAdmin && currentUrl.pathname.startsWith('/admin')){
        if(!userId){
            return NextResponse.redirect(new URL('/sign-in',req.url))
        }

        if(userId){
            return NextResponse.redirect(new URL('/home',req.url))
        }
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}