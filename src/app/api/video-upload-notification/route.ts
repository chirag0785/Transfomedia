import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client"; 
import { NextRequest, NextResponse } from "next/server";
import ably from "@/lib/ably";
interface CloudinaryNotificationResponse{
    public_id:string
    resource_type:string
    secure_url:string
    notification_type:string
    [key:string]:any
}
const prisma=new PrismaClient();
export async function POST(request: NextRequest) {
    const {userId}=auth();
    const notification:CloudinaryNotificationResponse=await request.json();
    try{
        if (notification.notification_type === 'eager') {
            const transformations = notification.eager;
        
            const promises=transformations.map(async (transformation: any) => {
                if (transformation.transformation.startsWith('e_preview:duration')) {
                    const channel = ably.channels.get(`private:${userId}`);
                    return channel.publish('webhook-notification-preview', {
                        message:"Preview done",
                        previewLength:transformation.transformation.split(':')[1]
                    });
                }
            });
            await Promise.all(promises);
        }
    
        if(notification.notification_type==='info' && notification.info_kind==='google_speech' && notification.info_status==='complete'){
            await prisma.video.updateMany({
                where:{
                    publicId:notification.public_id
                },
                data:{
                    srtFileProcessingDone:true
                }
            })
        }
        return NextResponse.json({
            message:"Notification received",
            success:true
        },{status:200})
    }catch(err){
        return NextResponse.json({
            message:"Internal server error",
            success:false
        },{status:500})
    }
}