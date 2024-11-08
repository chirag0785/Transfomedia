import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/lib/supabase";
const prisma = new PrismaClient();
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: any
}


export async function POST(request: NextRequest) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({
            message: "Unauthorized",
            success: false
        }, { status: 401 })
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json({
            message: "Cloudinary credentials not found",
            success: false
        }, { status: 500 })
    }
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const file = formData.get('file') as File || null;
        const originalSize = formData.get('originalSize') as string;
        if (!file) {
            return NextResponse.json({
                message: "File not found",
                success: false
            }, { status: 400 })
        }

        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'video_uploads',
                    resource_type: 'video',
                    transformation: {
                        quality: 'auto',
                        fetch_format: 'mp4',
                    },
                    raw_convert:'google_speech:srt',
                    notification_url:process.env.BASE_URL+'/api/video-upload-notification',
                },
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result as CloudinaryUploadResult)
                    }
                }
            )
            uploadStream.end(buffer);
        })
        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
                userId,
            }
        })



        const { data, error } = await supabase
            .from('video')
            .insert([
                { 
                    public_id:video.publicId,
                    user_id:video.userId,
                    srt_file_processing_done:false
                },
            ])
            .select()

        if(error){
            console.error(error);
            throw new Error(error.message);
        }

        const user=await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                credits: {
                    decrement: 3
                }
            }
        })
        return NextResponse.json({
            message: "Video uploaded successfully",
            success: true,
            video
        }, { status: 200 })

    } catch (err) {
        console.log("Upload Video failed", err);
        return NextResponse.json({
            message: "Internal server error while uploading video to cloudinary",
            success: false
        }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}