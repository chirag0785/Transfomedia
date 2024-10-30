import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma=new PrismaClient();
export async function POST(request:NextRequest,route:{params:{id:string}}) {
    const {id}=route.params;
    const {value}=await request.json();
    const {userId,sessionClaims}=auth();
    if(!userId){
        return NextResponse.json({
            message:"Unauthorized",
            success:false
        },{status:401})
    }

    if(sessionClaims.metadata.role!=="admin"){
        return NextResponse.json({
            message:"Unauthorized",
            success:false
        },{status:401})
    }
    try{
        let testimonial=await prisma.testimonial.findFirst({
            where:{
                id:id
            }
        })

        if(!testimonial){
            return NextResponse.json({
                success:false,
                message:"Testimonial not found"
            },{status:404})
        }

        testimonial=await prisma.testimonial.update({
            where:{
                id:id
            },
            data:{
                hallOfFame:value
            }
        })

        return NextResponse.json({
            success:true,
            testimonial,
            message:"Testimonial updated successfully"
        },{status:200})
    }catch(err){
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}