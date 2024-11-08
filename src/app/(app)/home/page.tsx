"use client"
import VideoCard from '@/components/VideoCard';
import { useAuth } from '@clerk/nextjs';
import { Image, Video } from '@prisma/client';
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';
import ImageCard from '@/components/ImageCard';
import DownloadImage from '@/components/DownloadImage';
import { getCldVideoUrl } from 'next-cloudinary';
import { supabase } from '@/lib/supabase';
interface VideosContent extends Video{
  srtFileProcessingDone:boolean
}
const Home = () => {
  const [videos, setVideos] = useState<VideosContent[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const searchParams = useSearchParams();
  const imagePageNumber = searchParams.get('image') || "1";
  const videoPageNumber = searchParams.get('video') || "1";
  const [moreVideoContentLeft, setMoreVideoContentLeft] = useState(false);
  const [moreImageContentLeft, setMoreImageContentLeft] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId ,isLoaded } = useAuth();
  const router=useRouter();
  const { toast } = useToast();
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/videos?page=${videoPageNumber}`);
      setVideos(response.data.videos);
      setLoading(false);
      console.log(response.data.videos);
      
      setMoreVideoContentLeft(response.data.moreVideoContentLeft);
    } catch (err) {
      console.log(err);

      toast({
        title: 'Error',
        description: 'Error while fetching videos',
      })
    }
  }

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/images?page=${imagePageNumber}`);
      setImages(response.data.images);
      setMoreImageContentLeft(response.data.moreImageContentLeft);
      setLoading(false);
    } catch (err) {
      console.log(err);

      toast({
        title: 'Error',
        description: 'Error while fetching images',
      })
    }
  }

  const getVideoUrl = useCallback((publicId: string) => {
    console.log(publicId);
    
    return getCldVideoUrl({
      src: publicId,
    })
  }, [userId])
  useEffect(() => {
    fetchVideos();
  }, [videoPageNumber,userId])
  useEffect(() => {
    fetchImages();
  }, [imagePageNumber,userId])
  
  useEffect(()=>{
    if(!userId && isLoaded){
      router.refresh();
      router.push('/');
      return;
    }

    const channel=supabase.channel('video-updates')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'video' }, (payload) => {
      console.log(payload);

      if(payload.new.user_id===userId){
        setVideos((prev)=>prev.map((video)=>{
          if(video.publicId===payload.new.public_id){ 
            const updatedVideo={...video};
            updatedVideo.srtFileProcessingDone=payload.new.srt_file_processing_done;
            toast({
              title: 'Srt File Ready',
              description: `Srt file for ${video.title} is ready`,
            });
            return updatedVideo
          }
          return video;
        }))
      }
    })
    .subscribe()


    return ()=>{
      channel.unsubscribe();
    }
  },[userId])
  return (
    <Tabs defaultValue="images" className="w-full max-w-7xl mx-auto">
  <TabsList className="flex gap-2 p-1 mb-8 bg-gray-100/40 backdrop-blur-sm rounded-lg w-fit">
    <TabsTrigger value="images" className="px-6 py-2 rounded-md text-sm font-medium transition-colors">
      Images
    </TabsTrigger>
    <TabsTrigger value="videos" className="px-6 py-2 rounded-md text-sm font-medium transition-colors">
      Videos
    </TabsTrigger>
  </TabsList>

  <TabsContent value="images">
    {loading ? (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    ) : (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images?.length > 0 ? (
            images.map((image) => (
              <div key={image.id} className="group relative">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <ImageCard image={image} />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <DownloadImage 
                      typeOfTransformation={image.typeOfTransformation}
                      title={image.title}
                      url={image.url}
                      aspectRatio={image?.aspectRatio || ''}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg mt-4">No images available</p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 
              ${imagePageNumber === "1" 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-gray-800"}`}
            disabled={imagePageNumber === "1"}
            onClick={() => {
              router.refresh();
              router.push(`/home?image=${Number(imagePageNumber) - 1}&video=${videoPageNumber}`);
            }}
          >
            Previous
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 
              ${!moreImageContentLeft 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-gray-800"}`}
            disabled={!moreImageContentLeft}
            onClick={() => {
              router.refresh();
              router.push(`/home?image=${Number(imagePageNumber) + 1}&video=${videoPageNumber}`);
            }}
          >
            Next
          </button>
        </div>
      </div>
    )}
  </TabsContent>

  <TabsContent value="videos">
    {loading ? (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    ) : (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="group relative">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <VideoCard video={video}/>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <DownloadImage 
                      typeOfTransformation=""
                      title={video.title}
                      url={getVideoUrl(video?.publicId || "")}
                      fileExtension='mp4'
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg mt-4">No videos available</p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 
              ${videoPageNumber === "1" 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-gray-800"}`}
            disabled={videoPageNumber === "1"}
            onClick={() => {
              router.refresh();
              router.push(`/home?image=${imagePageNumber}&video=${Number(videoPageNumber) - 1}`);
            }}
          >
            Previous
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 
              ${!moreVideoContentLeft 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-gray-800"}`}
            disabled={!moreVideoContentLeft}
            onClick={() => {
              router.refresh();
              router.push(`/home?image=${imagePageNumber}&video=${Number(videoPageNumber) + 1}`);
            }}
          >
            Next
          </button>
        </div>
      </div>
    )}
  </TabsContent>
</Tabs>

  )
}

export default Home