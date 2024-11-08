import {NextRequest,NextResponse} from "next/server"
import { PrismaClient } from '@prisma/client'
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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

        const videosContent = await Promise.all(        //resolves the promise
            videos.map(async (video) => {
              const { data, error } = await supabase
                .from('video')
                .select('srt_file_processing_done')
                .eq('public_id', video.publicId)
                .single();
              
              if (error) {
                console.error('Error fetching srt_file_processing_done:', error);
              }
              
              return {
                ...video,
                srtFileProcessingDone: data?.srt_file_processing_done || false,
              };
            })
          );

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
        
        console.log(videosContent);
        
        return NextResponse.json({
            videos:videosContent,
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