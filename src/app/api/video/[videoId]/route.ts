import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma=new PrismaClient();
export async function GET(request:NextRequest,route:{params:{videoId:string}}) {
    const {videoId}=route.params;
    try{
        const video=await prisma.video.findFirst({
            where:{
                id:videoId
            }
        })
        if(!video){
            return NextResponse.json({message:"Video not found"},{status:500});
        }
        return NextResponse.json({video},{status:200});
    }catch{
        return NextResponse.json({message:"Internal server error"},{status:500});
    }
}