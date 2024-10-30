import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Testimonial } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma=new PrismaClient();
const MAX_ENTRIES=10
export async function GET(request:NextRequest){
    const {searchParams}=new URL(request.url);
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
    const page=searchParams.get('page') || "1";
    const sortBy=searchParams.get('sort') || "newest";
    const whereClause:Testimonial={} as Testimonial;
    if(sortBy==='hallOfFame'){
        whereClause.hallOfFame=true;
    }

    try{
        const testimonials=await prisma.testimonial.findMany({
            where:whereClause,
            orderBy:{
                createdAt:sortBy==='newest'?'desc':'asc'
            },
            skip:(Number(page)-1)*MAX_ENTRIES,
            take:MAX_ENTRIES
        })

        const contentLeft=await prisma.testimonial.count({
            where:whereClause,
            orderBy:{
                createdAt:sortBy==='newest'?'desc':'asc'
            },
            skip:(Number(page))*MAX_ENTRIES,
            take:MAX_ENTRIES,
        })
        return NextResponse.json({
            testimonials,
            message:"Testimonials fetched successfully",
            success:true,
            moreContentLeft:contentLeft>0
        },{status:200})
    }catch(err){
        console.log(err);
        
        return NextResponse.json({
            message:"Internal server error",
            success:false
        },{status:500})
    }
}