import {NextRequest,NextResponse} from "next/server"
import { PrismaClient } from '@prisma/client'
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();
const MAX_ENTRIES=10;
export async function GET(request: NextRequest) {
    const {userId} =auth();
    const searchParams= new URL(request.url).searchParams
    const page=searchParams.get('page') || "1";

    try{
        const videos=await prisma.video.findMany({
            where:{
                userId:userId?.toString()
            },
            orderBy:{
                createdAt:'desc'
            },
            take:MAX_ENTRIES,
            skip:(Number(page)-1)*MAX_ENTRIES
        });
        const contentLeft=await prisma.video.count({
            where:{
                userId:userId?.toString()
            },
            orderBy:{
                createdAt:'desc'
            },
            take:MAX_ENTRIES,
            skip:(Number(page))*MAX_ENTRIES
        })

        return NextResponse.json({
            videos,
            message:"Videos fetched successfully",
            success:true,
            moreVideoContentLeft:contentLeft>0
        },{status:200})
    }catch(err){
        console.log(err)
        return NextResponse.json({
            message:"Internal server error while fetching videos",
            success:false
        },{status:500})
    }finally{
        await prisma.$disconnect()
    }
}