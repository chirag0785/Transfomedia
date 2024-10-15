"use client"
import { Video } from '@prisma/client';
import axios from 'axios'
import { getCldVideoUrl } from 'next-cloudinary';
import React, { useCallback, useEffect, useState } from 'react'
const Page = ({params}:{params:{videoId:string}}) => {
  const [video,setVideo]=useState<Video>();
  const [reelLength,setReelLength]=useState(10);
  const [previewError,setPreviewError]=useState(false);
  const [isHover, setIsHover] = useState(false);
  const getVideo=useCallback(async()=>{
      try{
        const response=await axios.get(`/api/video/${params.videoId}`);
        setVideo(response.data.video);
      }catch(err){
        console.log(err);
        alert('Error while fetching video');
      }
  },[params.videoId])
  useEffect(() => {
    getVideo();
    getReels();
  },[params.videoId])

  const getReels=useCallback(()=>{
    if(video){
      return getCldVideoUrl({
        src: video.publicId,
        crop: 'fill',
        width: 300,
        height: 200,
        quality: 'auto',
        gravity:'auto_content_aware',
        assetType:'video',
        rawTransformations:[`e_preview:duration_${reelLength}`],
      })
    }
    return null;
  },[reelLength,video]);
  return (
    <>

    </>
  )
}

export default Page