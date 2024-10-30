
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET(request:NextRequest,route:{params:{userId:string}}){
    const userId=route.params.userId;

    if(!userId){
        return NextResponse.json({
            success:false,
            message:"User id not found",
        },{status:400}); 
    }

    try{
        const user=await prisma.user.findFirst({
            where:{
                id:userId
            }
        });

        if(!user){
            return NextResponse.json({
                success:false,
                message:"User not found",
            },{status:404});
        }
        return NextResponse.json({
            success:true,
            user
        },{status:200});
    }catch(err){
        return NextResponse.json({
            success:false,
            message:"Internal server error",
        },{status:500});
    }
}