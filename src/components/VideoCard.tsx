"use client"
import { Video } from '@prisma/client'
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { filesize } from 'filesize';
import dayjs from 'dayjs';
import { Clock, Download, Eye, FileDown, FileUp, Scissors, Wand } from 'lucide-react';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);
interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void
}
const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [srtFileUrl, setSrtFileUrl] = useState<string>("");
  const getFullVideoUrl = useCallback(() => {
    return getCldVideoUrl({
      src: video.publicId,
      width: 1920,
      height: 1080,
    })
  }, [])

  const getSrtFileUrl = useCallback(async () => {
    try {
      const response = await axios.get(`/api/get-url-of-asset?public_id=${video.publicId + '.srt'}&resource_type=raw&type=upload`);
      setSrtFileUrl(response.data.url);
    } catch (err) {
      console.error(err);
    }
  }, [video.publicId]);

  useEffect(() => {
    getSrtFileUrl();
  }, [video.publicId, getSrtFileUrl])
  const getThumbnailUrl = useCallback(() => {
    return getCldImageUrl({
      src: video.publicId,
      width: '300',
      height: '200',
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      assetType: 'video'
    })
  }, []);

  const getVideoPreviewUrl = useCallback(() => {
    return getCldVideoUrl({
      src: video.publicId,
      width: '300',
      height: '200',
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      assetType: 'video',
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
    });
  }, []);


  const getFileOriginalSize = useCallback(() => {
    return filesize(video.originalSize, { round: 2 });
  }, [])
  const getFileCompressedSize = useCallback(() => {
    return filesize(video.compressedSize, { round: 2 });
  }, []);

  const getRelativeDate = useCallback(() => {
    return dayjs(video.createdAt).fromNow();
  }, [])
  const getCompressionPercentage = useCallback(() => {
    return ((Number(video.originalSize) - Number(video.compressedSize)) / Number(video.originalSize)) * 100;
  }, []);


  const onPreviewError = () => {
    setPreviewError(true);
  }
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    setPreviewError(false);
  }, [isHover])

  const router = useRouter();
  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);
  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <figure className="aspect-video relative">
        {isHover ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-red-500">Preview not available</p>
            </div>
          ) : (
            <video
              src={getVideoPreviewUrl()}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={onPreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl()}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
          <Clock size={16} className="mr-1" />
          {formatDuration(video.duration)}
        </div>
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold">{video.title}</h2>
        <p className="text-sm text-base-content opacity-70 mb-4">
          {video.description}
        </p>
        <p className="text-sm text-base-content opacity-70 mb-4">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <FileUp size={18} className="mr-2 text-primary" />
            <div>
              <div className="font-semibold">Original</div>
              <div>{getFileOriginalSize()}</div>
            </div>
          </div>
          <div className="flex items-center">
            <FileDown size={18} className="mr-2 text-secondary" />
            <div>
              <div className="font-semibold">Compressed</div>
              <div>{getFileCompressedSize()}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm font-semibold">
            Compression:{" "}
            <span className="text-accent">{getCompressionPercentage().toFixed(2)}%</span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={(ev) => {
              ev.preventDefault();
              onDownload(getFullVideoUrl(), video.title);
            }}
          >
            <div className="tooltip" data-tip="Download Video">
              <Download size={16} />
            </div>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={()=> router.push(`/extract-reels/${video.id}`)}
          >
            <div className="tooltip" data-tip="Extract Reel">
              <Scissors size={16} />
            </div>
          </button>

          <button
            className="btn btn-primary btn-sm"
          >

            <div className="tooltip" data-tip="Apply Transformation">
            <Wand size={16} />
            </div>
          </button>

          <button
            className="btn btn-secondary btn-sm"
          >
            <div className="tooltip" data-tip="Download SRT File">
            <Download size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoCard