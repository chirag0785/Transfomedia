import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')


  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix-id, svix-timestamp or svix-signature' }, { status: 400 })
  }

  // Get the body
  const payload = await request.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 })
  }

  const { id } = evt?.data
  const eventType = evt?.type


  if(eventType === 'user.created') {
    console.log('User created:', id);
    console.log('Payload:', payload);
    console.log('Evt dATAta:', evt.data);

    try{
      let user=await prisma.user.findFirst({
        where: {
          id
        }
      })
      if(user){
        return NextResponse.json({success:false,message:"user already exists"  }, { status: 404 })
      }

      const subscription=await prisma.subscription.findFirst({
        where: {
          planName:"free"
        }
      })
      user=await prisma.user.create({
        data: {
          id,
          email:evt.data.email_addresses[0]?.email_address,
          name:(evt.data?.first_name || "Transformifyuser") + " " + (evt.data?.last_name || ""),
          profileImg:evt.data?.image_url, 
          subscription_id:(subscription?.id.toString() as string)
        }
      })
  
      console.log("User created",user);
  
      return NextResponse.json({ success: true , user})
    }catch(err){
      console.log(err)
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
    }
  }

  if(eventType === 'user.updated') {
    console.log('User updated:', id);
    console.log('Payload:', payload);
    console.log('Evt dATAta:', evt.data);
    try{
      let user=await prisma.user.findFirst({
        where: {
          id
        }
      })
      if(!user){
        return NextResponse.json({success:false,message:"user not found"  }, { status: 404 })
      }
       user=await prisma.user.update({
        where: {
          id
        },
        data: {
          email:evt.data.email_addresses[0]?.email_address,
          name:(evt.data?.first_name || "Transformifyuser") + " " + (evt.data?.last_name || ""),
          profileImg:evt.data?.image_url
        }
      })
      
      console.log("User updated",user);
  
      return NextResponse.json({ success: true , user})
    }catch(err){
      console.log(err)
      return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
    }
  }

  if(eventType === 'user.deleted') {

    console.log('User deleted:', id);
    console.log('Payload:', payload);
    console.log('Evt dATAta:', evt.data);


    try{
      let user=await prisma.user.findFirst({
        where: {
          id
        }
      })
      if(!user){
        return NextResponse.json({success:false,message:"user not found"  }, { status: 404 })
      }
      user=await prisma.user.delete({
        where: {
          id
        }
      })
      
      console.log("User deleted",user);
  
      return NextResponse.json({ success: true , user})
    }catch(err){
      console.log(err)
      return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
    }
  }

  if(eventType==='session.created'){
    const { user_id} = evt.data
    let user=await prisma.user.findFirst({
      where: {
        id:user_id
      }
    })
    if(!user){
      return NextResponse.json({success:false,message:"user not found"  }, { status: 404 })
    }

    user=await prisma.user.update({
      where: {
        id:user_id
      },
      data: {
        isActive:true
      }
    })
    return NextResponse.json({ success: true , user})
  }

  if(eventType==='session.ended'){
    const { user_id} = evt.data
    let user=await prisma.user.findFirst({
      where: {
        id:user_id
      }
    })
    if(!user){
      return NextResponse.json({success:false,message:"user not found"  }, { status: 404 })
    }

    user=await prisma.user.update({
      where: {
        id:user_id
      },
      data: {
        isActive:false
      }
    })
    return NextResponse.json({ success: true , user})
  }
  if(eventType==='session.removed'){
    const { user_id} = evt.data
    let user=await prisma.user.findFirst({
      where: {
        id:user_id
      }
    })
    if(!user){
      return NextResponse.json({success:false,message:"user not found"  }, { status: 404 })
    }

    user=await prisma.user.update({
      where: {
        id:user_id
      },
      data: {
        isActive:false
      }
    })
    return NextResponse.json({ success: true , user})
  }
  if(eventType==='session.revoked'){
    const { user_id} = evt.data
    let user=await prisma.user.findFirst({
      where: {
        id:user_id
      }
    })
    if(!user){
      return NextResponse.json({success:false,message:"user not found"  }, { status: 404 })
    }

    user=await prisma.user.update({
      where: {
        id:user_id
      },
      data: {
        isActive:false
      }
    })
    return NextResponse.json({ success: true , user})
  }

  console.log('Unhandled event type:', eventType);
  

  return NextResponse.json({ success: true })
}