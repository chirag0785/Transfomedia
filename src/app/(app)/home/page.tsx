"use client"
import VideoCard from '@/components/VideoCard';
import { Video } from '@prisma/client';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [videos,setVideos]=useState<Video[]>([]);
  const fetchVideos = async () => {
    try{
      const response=await axios.get('/api/videos');
      setVideos(response.data.videos);
    }catch(err){
      alert('Error while fetching videos');
    }
  }
  useEffect(()=>{
    fetchVideos();
  },[])

  const onDownload=async (url:string,title:string)=>{
    fetch(url) //fetches buffer response
      .then((response) => response.blob())  //conversion to blob
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = title.toLowerCase().replace(/\s+/g, "_") + ".mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        alert('Error while downloading video');
      })
  }
  return (
    <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Videos</h1>
          {videos.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              No videos available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                videos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        onDownload={onDownload}
                    />
                ))
              }
            </div>
          )}
        </div>
  )
}

export default Home