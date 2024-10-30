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
        const images=await prisma.image.findMany({
            where:{
                userId:userId?.toString()
            },
            orderBy:{
                createdAt:'desc'
            },
            take:MAX_ENTRIES,
            skip:(Number(page)-1)*MAX_ENTRIES
        });
        const contentLeft=await prisma.image.count({
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
            images,
            message:"Images fetched successfully",
            moreImageContentLeft:contentLeft>0,
            success:true
        },{status:200})
    }catch(err){
        console.log(err)
        return NextResponse.json({
            message:"Internal server error while fetching Images",
            success:false
        },{status:500})
    }finally{
        await prisma.$disconnect()
    }
}