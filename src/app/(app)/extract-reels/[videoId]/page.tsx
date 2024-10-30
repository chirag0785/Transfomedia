"use client";
import { Video } from '@prisma/client';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { getCldVideoUrl } from 'next-cloudinary';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: { videoId: string } }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [reelLength, setReelLength] = useState(0);
  const [reelUrl, setReelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {userId}=useAuth();
  const router=useRouter();
  useEffect(()=>{
    if(!userId){
      router.refresh();
      router.push('/');
    }
  },[userId])
  // Fetch video details
  const getVideo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/video/${params.videoId}`);
      setVideo(response.data.video);
    } catch (err) {
      setError('Failed to fetch video details');
      console.error(err);
    }
  }, [params.videoId]);

  useEffect(() => {
    getVideo();
  }, [getVideo]);

  // Check if transformation is ready
  const checkTransformation = useCallback(async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }, [userId]);

  // Generate and check reels
  const generateReels = useCallback(async () => {
    if (!video) return;

    setIsLoading(true);
    setError(null);
    
    const transformedUrl = getCldVideoUrl({
      src: video.publicId,
      width: 400,
      height: 225,
      assetType: 'video',
      rawTransformations: [`e_preview:duration_${reelLength}:max_seg_9:min_seg_dur_1`],
      quality:100
    });

    let attempts = 0;
    const maxAttempts = 36; // 3 minute total (36 * 5 seconds)
    const pollTransformation = async () => {
      const isReady = await checkTransformation(transformedUrl);
      
      if (isReady) {
        setReelUrl(transformedUrl);
        setIsLoading(false);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(pollTransformation, 5000);
      } else {
        setError('Transformation timed out. Please try again.');
        setIsLoading(false);
      }
    };

    pollTransformation();
  }, [video, reelLength, checkTransformation]);

  const handleExtractReels = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    generateReels();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Video Reel Extractor</h1>
      
      <form onSubmit={handleExtractReels} className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Reel Length: {reelLength} seconds
            <input
              type="range"
              min={10}
              max={60}
              value={reelLength}
              onChange={(e) => setReelLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !video}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Extract Reel'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg" onClick={()=> generateReels()}>
          {error}
        </div>
      )}

      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : reelUrl ? (
          <video
            src={reelUrl}
            width={300}
            height={200}
            controls
            className="w-full"
            onError={() => setError('Failed to load video. Please try again.')}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Page;