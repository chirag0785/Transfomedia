import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
export async function GET(request:NextRequest){
    try{

        const {searchParams}=new URL(request.url);
        const public_id=searchParams.get('public_id') || "";
        const resource_type=searchParams.get('resource_type');
        const type=searchParams.get('type');
        const response=await cloudinary.api.resource(public_id,{
            resource_type:resource_type,
            type:type
        })

        return NextResponse.json({
            url:response.secure_url,
            success:true,
            message:"Success"
        },{status:200})
    }catch(err){
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}