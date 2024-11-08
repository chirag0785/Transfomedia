import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
interface CloudinaryNotificationResponse{
    public_id:string
    resource_type:string
    secure_url:string
    notification_type:string
    [key:string]:any
}
export async function POST(request: NextRequest) {
    const notification:CloudinaryNotificationResponse=await request.json();
    try{
        if(notification.notification_type==='info' && notification.info_kind==='google_speech' && notification.info_status==='complete'){
            const {data,error}=await supabase.from('video').update({srt_file_processing_done:true}).eq('public_id',notification.public_id.replace('.srt',''));

            if(error){
                throw new Error(error.message);
            }
        }
        console.log(notification);
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