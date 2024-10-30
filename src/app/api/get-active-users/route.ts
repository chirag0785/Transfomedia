import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    
    return NextResponse.json({
        count:count
    },{status:200})
}