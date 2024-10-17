"use client";
import { Video } from '@prisma/client';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { getCldVideoUrl } from 'next-cloudinary';
import React, { useCallback, useEffect, useState } from 'react';
import ably from '@/lib/ably';
import { useAuth } from '@clerk/nextjs';

const Page = ({ params }: { params: { videoId: string } }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [reelLength, setReelLength] = useState(0);
  const [reelUrl, setReelUrl] = useState('');
  const [isTransformationReady, setIsTransformationReady] = useState(false);
  const { userId } = useAuth();
  const getVideo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/video/${params.videoId}`);
      const fetchedVideo = response.data.video;
      setVideo(fetchedVideo);
    } catch (err) {
      console.error(err);
      alert('Error while fetching video');
    }
  }, [params.videoId]);

  useEffect(() => {
    getVideo();
  }, [getVideo]);

  const getReels = useCallback(() => {
    if (video) {
      const url = getCldVideoUrl({
        src: video.publicId,
        crop: 'fill',
        width: 300,
        height: 200,
        quality: 'auto',
        gravity: 'auto',
        assetType: 'video',
        rawTransformations: [`e_preview:duration_${reelLength}:max_seg_9:min_seg_dur_1`],
      });
      setReelUrl(url);
    }
  }, [reelLength, video]);

  useEffect(() => {
    const channel = ably.channels.get(`private:${userId}`);
    const subscription = channel.subscribe('webhook-notification-preview', (message) => {
      setIsTransformationReady(true);
    });
    const handleConnectionEvents = () => {
      // Handle disconnections
      ably.connection.on('disconnected', () => {
        console.warn('Ably connection disconnected. Retrying...');
      });

      // Handle reconnection attempts
      ably.connection.on('connecting', () => {
        console.log('Attempting to reconnect to Ably...');
      });

      // Handle successful reconnections
      ably.connection.on('connected', () => {
        console.log('Reconnected to Ably successfully!');
      });

      // Handle permanent failures
      ably.connection.on('failed', (error) => {
        console.error('Ably connection failed:', error);
        alert('Connection failed. Please check your network or try again later.');
      });
    };

    handleConnectionEvents(); // Attach event listeners

    // Keep the connection alive by sending periodic pings
    const pingInterval = setInterval(() => {
      if (ably.connection.state === 'connected') {
        console.log('Sending ping to keep connection alive');
        ably.connection.ping()
        .then(() => {
          console.log("Ping successfully sent");
        })
        .catch((err)=>{
          console.error(err);
        })
      }
    }, 30000); // Ping every 30 seconds

    return () => {
      channel.unsubscribe(); // Clean up subscription
      clearInterval(pingInterval); // Clean up interval
    };
  }, [userId])

  const extractReelsHandler = (ev: React.FormEvent<HTMLFormElement>) => {
    console.log("submit");
    
    ev.preventDefault();
    getReels();
  }
  return (
    <div>
      Heelo
      <form onSubmit={extractReelsHandler} className="flex flex-col gap-2">
        <label>
          Set Reel Length
          <input
            type="range"
            min={10}
            max={60}
            value={reelLength}
            onChange={(e) => setReelLength(Number(e.target.value))}
            className="range"
          />
        </label>
        <button>Extract Reel</button>
      </form>
      {video && isTransformationReady ? (
        <video
          src={reelUrl}
          width={300}
          height={200}
          controls
          onError={() => setIsTransformationReady(false)}
        />
      ) : (
        video && <Loader2 className='animate-spin' />
      )}
    </div>
  );
};

export default Page;
