import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma=new PrismaClient();
export async function GET(request: NextRequest) {
    const {userId,sessionClaims}=auth();

    if(!userId || sessionClaims.metadata.role!=="admin"){
        return NextResponse.json({
            success:false,
            message:"Unauthorized"
        },{status:401})
    }

    try{
        const activeUsers=await prisma.user.count({
            where:{
                isActive:true
            }
        })

        const totalUsers=await prisma.user.count()

        const testimonials=await prisma.testimonial.count()
        const ratingAggregation=await prisma.testimonial.aggregate({
            _avg:{
                rating:true
            }
        })
        const avgRating=ratingAggregation._avg.rating || 0;

        return NextResponse.json({
            success:true,
            stats:{
                activeUsers:activeUsers.toString(),
                totalUsers:totalUsers.toString(),
                testimonials:testimonials.toString(),
                avgRating:avgRating.toFixed(2).toString()
            }
        })
    }catch(err){
        console.error(err);
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        })
    }
}