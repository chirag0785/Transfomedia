import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest,NextResponse } from "next/server";

const prisma=new PrismaClient();
export async function POST(request: NextRequest,route:{params:{id:string}}) {
    const {userId}=auth();
    const {id}=route.params;

    if(!userId){
        return NextResponse.json({
            success:false,
            message:'Unauthorized'
        },{status:401})
    }
    if(!id){
        return NextResponse.json({
            success:false,
            message:'Image id not found'
        },{status:400})
    }
    try {
        const data = await request.json();
        const image=await prisma.image.update({
            where: {
                id: id
            },
            data:{
                ...data
            }
        })
        return NextResponse.json({
            success: true,
            message: "Image updated successfully",
            image
        },{status:200});
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success:false,
            message:'Internal server error'
        },{status:500})
    }
}
        