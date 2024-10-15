import { PrismaClient } from "@prisma/client"; 
import { NextRequest, NextResponse } from "next/server";
interface CloudinaryNotificationResponse{
    public_id:string
    resource_type:string
    secure_url:string
    notification_type:string
}
const prisma=new PrismaClient();
export async function POST(request: NextRequest) {
    const notification:CloudinaryNotificationResponse=await request.json();
    console.log(notification);
    return NextResponse.json({
        message:"Notification received",
        success:true
    },{status:200})
}