import {NextRequest,NextResponse} from "next/server"
import { PrismaClient } from '@prisma/client'
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const {userId} =auth();
    try{
        const videos=await prisma.video.findMany({
            where:{
                userId:userId?.toString()
            },
            orderBy:{
                createdAt:'desc'
            }
        });

        return NextResponse.json({
            videos,
            message:"Videos fetched successfully",
            success:true
        },{status:200})
    }catch(err){
        return NextResponse.json({
            message:"Internal server error while fetching videos",
            success:false
        },{status:500})
    }finally{
        await prisma.$disconnect()
    }
}