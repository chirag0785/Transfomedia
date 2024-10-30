import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma=new PrismaClient();
export async function POST(request: NextRequest) {
    const {userId}=auth();

    if(!userId){
        return NextResponse.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }
    const {subscriptionId}=await request.json();
    try{

        const subscriptionPlan=await prisma.subscription.findFirst({
            where:{
                id:subscriptionId
            }
        })

        if(!subscriptionPlan){
            return NextResponse.json({
                success:false,
                message:"Subscription plan not found"
            },{status:404})
        }
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${subscriptionPlan.planName.toUpperCase()} Subscription`,
                            description: subscriptionPlan.features?.toString().replaceAll(',', ', '),
                        },
                        unit_amount: subscriptionPlan.price * 100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                        maximum: 100,
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/payment-success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/home`,
            payment_method_types: ['card', 'cashapp'],
            metadata: {
                userId: String(userId), // Convert to string
                unitPrice: String(subscriptionPlan.price), // Convert to string
                subscriptionId: String(subscriptionId), // Convert to string
                creditsIssued: String(subscriptionPlan.creditsIssued), // Convert to string
                planName:String(subscriptionPlan.planName)
            },
            payment_intent_data:{
                metadata: {
                    userId: String(userId), // Convert to string
                    unitPrice: String(subscriptionPlan.price), // Convert to string
                    subscriptionId: String(subscriptionId), // Convert to string
                    creditsIssued: String(subscriptionPlan.creditsIssued), // Convert to string
                    planName:String(subscriptionPlan.planName)
                }
            }
        });
        
        
        console.log(session);
        

        return NextResponse.json({
            sessionId:session.id,
        },{status:200})
    }catch(err){
        console.error(err)
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}