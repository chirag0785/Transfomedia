import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function GET(request:NextRequest,route:{params:{checkoutSessionId:string}}) {
    const {checkoutSessionId}=route.params;

    try {
        const session=await stripe.checkout.sessions.retrieve(checkoutSessionId);
        const paymentIntent=await stripe.paymentIntents.retrieve(session?.payment_intent as string);
        console.log(paymentIntent);
        console.log(session);
        
        return NextResponse.json({
            session,
            paymentIntent,
            success:true
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            message:"Internal server error while fetching subscription plans",
            success:false
        },{status:500})
    }
}