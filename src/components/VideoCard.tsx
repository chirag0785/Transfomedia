"use client";
import { Video } from "@prisma/client";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { filesize } from "filesize";
import dayjs from "dayjs";
import {
  Clock,
  Download,
  Eye,
  FileDown,
  FileUp,
  Loader2,
  MailIcon,
  Scissors,
  Wand,
} from "lucide-react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { downloadFile } from "@/helpers/downloadFile";

interface VideosContent extends Video {
  srtFileProcessingDone: boolean;
}
dayjs.extend(relativeTime);

interface VideoCardProps {
  video: VideosContent;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const getThumbnailUrl = useCallback(() => {
    return getCldImageUrl({
      src: video.publicId,
      assetType: "video",
      format: "jpg",
    });
  }, [video.publicId]);

  const getVideoPreviewUrl = useCallback(() => {
    return getCldVideoUrl({
      src: video.publicId,
      gravity: "auto",
      assetType: "video",
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  }, [video.publicId]);

  const getFileOriginalSize = useCallback(() => {
    return filesize(video.originalSize, { round: 2 });
  }, [video.originalSize]);

  const getFileCompressedSize = useCallback(() => {
    return filesize(video.compressedSize, { round: 2 });
  }, [video.compressedSize]);

  const getRelativeDate = useCallback(() => {
    return dayjs(video.createdAt).fromNow();
  }, [video.createdAt]);

  const getCompressionPercentage = useCallback(() => {
    return (
      ((Number(video.originalSize) - Number(video.compressedSize)) /
        Number(video.originalSize)) *
      100
    );
  }, [video.originalSize, video.compressedSize]);

  const onPreviewError = () => {
    setPreviewError(true);
  };
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    setPreviewError(false);
  }, [isHover]);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  return (
    <div
      className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <figure className="relative overflow-hidden bg-teal-500">
        {isHover ? (
          previewError ? (
            <div className="w-full h-[280px] flex items-center justify-center bg-gray-50">
              <p className="text-red-500 font-medium">Preview not available</p>
            </div>
          ) : (
            <video
              src={getVideoPreviewUrl()}
              autoPlay
              muted
              loop
              className="w-full h-[280px] object-contain"
              onError={onPreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl()}
            alt={video.title}
            className="w-full h-[280px] object-contain"
          />
        )}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm flex items-center shadow-md">
          <Clock size={16} className="mr-1.5 text-teal-500" />
          <span className="font-medium text-gray-700">
            {formatDuration(video.duration)}
          </span>
        </div>
      </figure>

      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 truncate mb-1">
            {video.title}
          </h2>
          <p className="text-sm text-gray-600 truncate">{video.description}</p>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Uploaded {dayjs(video.createdAt).fromNow()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <FileUp size={18} className="text-emerald-500 mt-1" />
            <div>
              <div className="font-medium text-gray-700">Original</div>
              <div className="text-gray-600">{getFileOriginalSize()}</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FileDown size={18} className="text-blue-500 mt-1" />
            <div>
              <div className="font-medium text-gray-700">Compressed</div>
              <div className="text-gray-600">{getFileCompressedSize()}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-800 mb-3">
            Compression:{" "}
            <span className="text-emerald-600">
              {getCompressionPercentage().toFixed(2)}%
            </span>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push(`/extract-reels/${video.id}`)}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium flex items-center transition-colors"
            >
              <Scissors size={16} className="mr-1.5" />
              Extract Reel
            </button>

            <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center transition-colors">
              <Wand size={16} className="mr-1.5" />
              Transform
            </button>

            <button
              onClick={() => {
                const srtUrl = `https://res.cloudinary.com/${
                  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                }/raw/upload/${video?.publicId || ""}.srt`;
                downloadFile({
                  url: srtUrl,
                  title: video.title,
                  fileExtension: "srt",
                });
              }}
              disabled={!video.srtFileProcessingDone}
              className={`px-4 py-2 text-sm font-medium flex items-center rounded-lg transition-colors
                ${
                  video.srtFileProcessingDone
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {video.srtFileProcessingDone ? (
                <>
                  <Download size={16} className="mr-1.5" />
                  Download SRT
                </>
              ) : (
                <>
                  <Loader2 className="mr-1.5 animate-spin"/>
                  Processing srt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
