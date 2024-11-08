"use client"
import { Video } from '@prisma/client';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { getCldVideoUrl } from 'next-cloudinary';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const Page = ({ params }: { params: { videoId: string } }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [reelLength, setReelLength] = useState<number>(0);
  const [reelUrl, setReelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId ,isLoaded} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userId && isLoaded) {
      router.refresh();
      router.push('/');
    }
  }, [userId]);

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
      gravity: 'auto',
      assetType: 'video',
      rawTransformations: [`e_preview:duration_${reelLength}:max_seg_9:min_seg_dur_1`],
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
    <Card className="p-4 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className='text-2xl text-red-900'>Video Reel Extractor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleExtractReels} className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Reel Length: {reelLength} seconds
              <Slider
                min={10}
                max={60}
                defaultValue={[reelLength]}
                onValueChange={(value) => setReelLength(value[0])}
                className="mt-2"
              />
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !video}
            className="w-full"
          >
            Extract Reel
          </Button>
        </form>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg" onClick={() => generateReels()}>
            {error}
          </div>
        )}

        <div className="relative rounded-lg overflow-hidden bg-teal-300" style={{ paddingBottom: '56.25%' }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : reelUrl ? (
            <video
              src={reelUrl}
              className="absolute inset-0 w-full h-full object-contain"
              controls
            />
          ) : <div className='text-xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>Your extracted reel will appear here</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;