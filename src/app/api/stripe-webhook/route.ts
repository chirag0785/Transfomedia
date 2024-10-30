import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    
  const payload = await req.text();
  const res = JSON.parse(payload);

  const sig = req.headers.get("Stripe-Signature");

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(res);
    
    if(event?.type==='payment_intent.succeeded'){

        const user=await prisma.user.findFirst({
            where:{
                id:res?.data?.object?.metadata?.userId.toString()
            }
        })

        console.log(user);
        

        if(!user){
            return NextResponse.json({ status: "Failed", error: "User not found" });
        }
        const totalAmount=(Number(res?.data?.object?.amount))/100;
        const unitPrice=Number(res?.data?.object?.metadata?.unitPrice);
        const creditsIssued=Number(res?.data?.object?.metadata?.creditsIssued);

        console.log(totalAmount,unitPrice,creditsIssued);
        console.log(res?.data?.object?.metadata?.subscriptionId);
        
        await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                subscription_id:res?.data?.object?.metadata?.subscriptionId,
                credits:(user.credits + (creditsIssued*(totalAmount/unitPrice)))
            }
        })

        return NextResponse.json({ status: "sucess", event: event.type, response: res });
    }

    return NextResponse.json({ status: "sucess", event: event.type, response: res });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}