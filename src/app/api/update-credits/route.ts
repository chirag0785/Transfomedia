import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma=new PrismaClient();
export async function POST(request:NextRequest){
    const {userId}=auth();

    if(!userId){
        return NextResponse.json({
            success:false,
            message:'Unauthorized'
        },{status:401})
    }

    try{
        let user=await prisma.user.findFirst({
            where:{
                id:userId
            }
        })

        if(!user){
            return NextResponse.json({
                success:false,
                message:'User not found'
            },{status:404})
        }

        user=await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                credits:(user.credits-2),    //2 credits for each transformation
                tranformationsDone:(user.tranformationsDone+1)
            }
        })

        return NextResponse.json({
            success:true,
            message:'Credits updated successfully',
            user
        },{status:200})
        
    }catch(err){
        return NextResponse.json({
            success:false,
            message:'Internal server error'
        },{status:500})
    }   
}