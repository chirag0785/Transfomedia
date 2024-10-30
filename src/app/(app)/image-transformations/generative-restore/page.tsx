"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { Loader2, Wand2, Upload, RefreshCw, AlertTriangle, ImageDown } from 'lucide-react';
import { getCldImageUrl } from 'next-cloudinary';
import ImageUploadWidget from '@/components/ImageUploadWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { transformationSchema } from '@/schemas/transformationSchema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import InsufficientCreditBalance from '@/components/InsufficientCreditBalance';
import { User } from '@prisma/client';
import DownloadImage from '@/components/DownloadImage';
import { Skeleton } from '@/components/ui/skeleton';
const Page = () => {
  const [imgPublicId, setImgPublicId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [transformedUrl, setTransformedUrl] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationApplied, setIsTransformationApplied] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const form = useForm<z.infer<typeof transformationSchema>>({
    resolver: zodResolver(transformationSchema),
    defaultValues: {
      title: '',
      sourceImgUrl: '',
      transformedImgUrl: ''
    },
  })

  const getTransformedUrl = useCallback((publicId: string) => {
    if(user && user?.credits<2){
      if(triggerRef){
        triggerRef.current?.click();
      }
      return;
    }
    const url = getCldImageUrl({
      src: publicId,
      restore: true,
    });

    setIsTransformationApplied(true);
    setIsTransforming(true);
    let attempts = 0;
    const maxAttempts = 60;
    const pollTransformation = async () => {
      const isReady = await checkTransformation(url);
      if (isReady) {
        setTransformedUrl(url);
        setIsTransforming(false);
        axios.post(`/api/update-credits`)
        .then((response)=> response.data)
        .then((data)=> setUser(data.user))
        .catch((err)=>{
          alert('Error updating credits');
          console.error(err);
        })
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(pollTransformation, 3000);
      } else {
        alert('Transformation failed, try again');
        setIsTransforming(false);
        setIsTransformationApplied(false);
      }
    };

    pollTransformation();
  }, [userId]);

  const getImgUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
    });
  }, [userId]);

  const checkTransformation = useCallback(async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }, [userId]);

  const onSubmit = (values: z.infer<typeof transformationSchema>) => {
    const { sourceImgUrl, title, transformedImgUrl } = values;
    axios.post('/api/save-transformation', {
      originalImgurl: sourceImgUrl,
      title: title,
      url: transformedImgUrl,
      typeOfTransformation: "generativeRestore"
    })

      .then((response) => response.data)
      .then((data) => {
        router.refresh();
        router.push(`/image-uploads/${data.image.id}`);
      })
      .catch((err) => {
        alert('Error while saving transformation');
      })
  }
  const fetchUser = () => {
    axios.get(`/api/get-user-details/${userId}`)
      .then((response) => response.data)
      .then((data) => {
        setUser(data.user);
        if (data.user.credits < 2) {
          if (triggerRef) triggerRef.current?.click();
        }
      })
      .catch((err) => {
        alert('Error fetching User details');
        console.error(err);
      })
  }

  useEffect(() => {
    if(!userId){
      router.refresh();
      router.push('/');
    }
      fetchUser();
  },[userId]);


  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>

      {!user && <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-12">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header Section with enhanced styling */}
            <div className="text-center space-y-6">
              <Skeleton className="h-10 w-3/4 mx-auto" /> {/* Title Skeleton */}
              <Skeleton className="h-6 w-1/2 mx-auto" /> {/* Subtitle Skeleton */}
              <Skeleton className="h-10 w-1/3 mx-auto" /> {/* Insufficient Credit Balance Skeleton */}
            </div>

            {/* Main Form Section */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <form className="space-y-8">
                  {/* Title Field */}
                  <Skeleton className="h-12 w-full" /> {/* Title Field Skeleton */}

                  {/* Image Upload Section */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Source Image Skeleton */}
                    <div>
                      <Skeleton className="h-72 w-full rounded-xl border-2 border-purple-400 border-dashed" />
                      <Skeleton className="h-8 w-3/4 mx-auto mt-2" /> {/* Upload Button Skeleton */}
                    </div>

                    {/* Transformed Image Skeleton */}
                    <div>
                      <Skeleton className="h-72 w-full rounded-xl bg-gray-50 border-2 border-blue-200" />
                      <Skeleton className="h-8 w-3/4 mx-auto mt-2" /> {/* Placeholder for transformed image */}
                    </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="space-y-6 pt-6">
                    <Skeleton className="h-14 w-full" /> {/* Restore Image Button Skeleton */}
                    <Skeleton className="h-14 w-full" /> {/* Save Transformation Button Skeleton */}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>}
      {user && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-12">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header Section with enhanced styling */}
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Generative Restore
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Transform and restore your images using advanced AI technology. Upload an image to get started.
              </p>
              <InsufficientCreditBalance triggerRef={triggerRef} />
            </div>

            {/* Main Form Section */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-700">Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Title"
                              {...field}
                              className="h-12 text-lg border-2 focus:border-purple-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Source Image */}
                      <FormField
                        control={form.control}
                        name="sourceImgUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-gray-700">Source Image</FormLabel>
                            <FormControl>
                              <div className="h-72 relative rounded-xl overflow-hidden border-2 border-purple-400 border-dashed hover:border-purple-600 transition-colors">
                                {!imgPublicId && isUploading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                                    <Loader2 className="animate-spin text-purple-500" size={32} />
                                  </div>
                                )}
                                {!imgPublicId && !isUploading && (
                                  <div className="h-full">
                                    <ImageUploadWidget
                                      setImgPublicId={setImgPublicId}
                                      setIsUploading={setIsUploading}
                                      text="Upload Source Image"
                                    />
                                  </div>
                                )}
                                {imgPublicId && (
                                  <img
                                    src={getImgUrl(imgPublicId)}
                                    alt="Main"
                                    className="w-full h-full object-contain rounded-xl transition-transform hover:scale-105"
                                    onLoad={() => field.onChange(getImgUrl(imgPublicId))}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Transformed Image */}
                      <FormField
                        control={form.control}
                        name="transformedImgUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-gray-700">Transformed Image</FormLabel>
                            <FormControl>
                              <div className="h-72 relative rounded-xl overflow-hidden bg-gray-50 border-2 border-blue-200 shadow-lg">
                                {transformationApplied && !isTransforming && (
                                  <div className="relative w-full h-full">
                                  <img
                                    src={transformedUrl}
                                    className="w-full h-full object-contain rounded-lg shadow-md"
                                    alt="Transformed"
                                    onLoad={() => {
                                      field.onChange(transformedUrl);
                                    }}
                                  />
          
                                  <DownloadImage title={form.getValues().title} url={transformedUrl} typeOfTransformation={'generativeRestore'} />
                                </div>
                                )}
                                {isTransforming && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                                    <div className="text-center space-y-4">
                                      <RefreshCw className="animate-spin mx-auto text-purple-500" size={40} />
                                      <p className="text-lg font-medium text-gray-700">Creating your masterpiece...</p>
                                    </div>
                                  </div>
                                )}
                                {!isTransforming && !transformationApplied && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                      <ImageDown className="mx-auto text-gray-400" size={64} />
                                      <p className="text-lg text-gray-500 font-medium">Your transformed image will appear here</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-6 pt-6">
                      <Button
                        onClick={() => getTransformedUrl(imgPublicId)}
                        disabled={!imgPublicId || isTransforming}
                        type="button"
                        className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                      >
                        {isTransforming ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-6 h-6 mr-3" />
                            Restore Image
                          </>
                        )}
                      </Button>

                      <Button
                        type="submit"
                        disabled={isTransforming || !imgPublicId || !transformationApplied || !transformedUrl}
                        className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Save Transformation
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>

  );
};

export default Page;