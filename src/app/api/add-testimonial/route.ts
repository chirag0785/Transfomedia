import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma=new PrismaClient();
export async function POST(request:NextRequest) {
    const {userId}=auth();
    const data=await request.json();

    if(!userId){
        return NextResponse.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }
    try{
        const testimonial=await prisma.testimonial.create({
            data:{
                ...data
            }
        })
        return NextResponse.json({
            success:true,
            message:"Testimonial added successfully",
            testimonial
        },{status:200})
    }catch(err){
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}
