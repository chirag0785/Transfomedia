import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma=new PrismaClient();
export async function GET() {
    try{
        const subscriptionPlans = await prisma.subscription.findMany();
        return NextResponse.json({ subscriptionPlans },{status:200});
    }catch(err){
        console.error(err);
        return NextResponse.json({ subscriptionPlans: [] },{status:500});
    }
}