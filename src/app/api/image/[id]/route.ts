import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET(request:NextRequest,route:{params:{id:string}}) {

    const {id}=route.params;

    try{
        const image=await prisma.image.findUnique({
            where:{
                id:id
            }
        });
        if(!image){
            return NextResponse.json({
                message:"Image not found",
                success:false
            },{status:404})
        }
        return NextResponse.json({
            image,
            success:true,
            message:"Image fetched successfully"
        },{status:200})
    }catch(err){

        return NextResponse.json({
            message:"Internal server error",
            success:false
        },{status:500})
    }
}