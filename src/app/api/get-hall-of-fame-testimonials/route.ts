import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma=new PrismaClient();
export async function GET(request:NextRequest) {
    try{
        const testimonials = await prisma.testimonial.findMany({
            where:{
                hallOfFame:true,
                canBePubliclyShown:true
            }
        });
        
        return NextResponse.json({ reviews: testimonials },{status:200})
    }catch(err){
        console.error(err);
        return NextResponse.json({ testimonials: [] },{status:500})
    }
}