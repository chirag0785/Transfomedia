"use client"
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const {userId,isLoaded}=useAuth();
  const MAX_FILE_SIZE = 70 * 1024 * 1024
  const uploadVideoHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!video) {
      alert('No video file attached');
      return;
    }
    if(video.size > MAX_FILE_SIZE){
      alert('File size must be less than 70MB');
      return;
    }
    if (title.length == 0) {
      alert('No title specified');
      return;
    }
    setIsUploading(true);
    const originalSize=video.size.toString();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', video);
    formData.append('originalSize', originalSize);
    try {
      const response = await axios.post('/api/video-upload', formData);
      router.push('/home');
    } catch (err) {
      console.log(err);
      alert('Video upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(()=>{
    if(!userId && isLoaded){
      router.refresh();
      router.push('/')
      return;
    }
  },[userId])
  return (
    <div className="flex items-center justify-center min-h-screen">
      
      <form
        onSubmit={uploadVideoHandler}
        className="bg-slate-400 shadow-lg rounded-lg p-6 max-w-md w-full space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Upload Video</h2>

        <label className="block">
          <div className="label">
            <span className="label-text font-medium text-gray-700">Title</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full mt-1"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Enter video title"
          />
        </label>

        <label className="block">
          <div className="label">
            <span className="label-text font-medium text-gray-700">Description</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full mt-1"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Enter video description"
          />
        </label>

        <label className="block">
          <div className="label">
            <span className="label-text font-medium text-gray-700">Video File</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full mt-1"
            accept=".mp4"
            onChange={(e) =>
              setVideo(e.target?.files ? e.target.files[0] : null)
            }
          />
        </label>

        <div className="flex justify-center">
          {!isUploading && (
            <button
              className="btn btn-primary w-full py-2 text-lg font-medium tracking-wide"
              type="submit"
            >
              Upload Video
            </button>
          )}
          {isUploading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
        </div>
      </form>
    </div>

  )
}

export default Page