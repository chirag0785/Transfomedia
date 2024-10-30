import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function POST(request: NextRequest) {

    const data = await request.json();
    const {userId}=auth();

    if(!userId){
        return NextResponse.json({
            success:false,
            message:'Unauthorized'
        },{status:401})
    }
    try{
        const image = await prisma.image.create({
            data:{
                ...data,
                userId
            }
        });

        return NextResponse.json({
            success:true,
            message:"Image saved successfully",
            image
        },{status:200})
    }catch(err){
        return NextResponse.json({
            success:false,
            message:'Internal server error'
        },{status:500})
    }
}