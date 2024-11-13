"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { Loader2, Wand2, RefreshCw, ImageDown } from 'lucide-react';
import { getCldImageUrl } from 'next-cloudinary';
import ImageUploadWidget from '@/components/ImageUploadWidget';
import { Card, CardContent } from '@/components/ui/card';
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
import { transformationSchema } from '@/schemas/transformationSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import InsufficientCreditBalance from '@/components/InsufficientCreditBalance';
import { User } from '@prisma/client';
import DownloadImage from '@/components/DownloadImage';
import { Skeleton } from '@/components/ui/skeleton';
import TestimonialInput from '@/components/TestimonialInput';
import { assignScreenSizes } from '@/utils/screenSizes';
const aspectFormats:Record<string, { width: number; height: number; aspectRatio: string }> = {
  "Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Widescreen (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Banner (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Profile Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" }
};
const Page = () => {
  const [imgPublicId, setImgPublicId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [transformedUrl, setTransformedUrl] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationApplied, setIsTransformationApplied] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('');
  const { userId,isLoaded } = useAuth();
  const [user,setUser]=useState<User>();
  const router = useRouter();

  const testimonialRef=useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof transformationSchema>>({
    resolver: zodResolver(transformationSchema),
    defaultValues: {
      title: '',
      aspectRatio: '',
      sourceImgUrl: '',
      transformedImgUrl: '',
    },
  })

  const onSubmit = (values: z.infer<typeof transformationSchema>) => {
    const { sourceImgUrl, title,transformedImgUrl,aspectRatio } = values;
        axios.post('/api/save-transformation',{
            originalImgurl:sourceImgUrl,
            title:title,
            url:transformedImgUrl,
            aspectRatio:aspectRatio,
            typeOfTransformation: "generativeFill",
        })
        .then((response)=> response.data)
        .then((data)=>{
            router.push(`/image-uploads/${data.image.id}`);
        })
        .catch((err)=>{
            alert('Error while saving transformation');
        })
  }

  const getTransformedUrl = useCallback((publicId: string,aspectRatio:string) => {
    if(user && user?.credits<2){
      if(triggerRef){
        triggerRef.current?.click();
      }
      return;
    }
    console.log(aspectRatio);
    
    
    const url = getCldImageUrl({
      src: publicId,
      fillBackground: true,
      crop: 'fill',
      aspectRatio: aspectFormats[aspectRatio].aspectRatio,
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
        .then((data)=>{
          setUser(data.user);
          const tranformationsDone=data.user.tranformationsDone;
          if(tranformationsDone==1 || (tranformationsDone!=0 && tranformationsDone%5==0)){
            setTimeout(()=>{
              if(testimonialRef){
                testimonialRef.current?.click();
              }
            },3000)
          }
        })
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
  const fetchUser = () => {
    axios.get(`/api/get-user-details/${userId}`)
      .then((response) => response.data)
      .then((data)=>{
        setUser(data.user);
        if(data.user.credits<2){
          if(triggerRef) triggerRef.current?.click();
        }
      })
      .catch((err)=>{
        alert('Error fetching User details');
        console.error(err);
      })
  }

  useEffect(() => {
    if(userId){
      fetchUser();
    }
    if(!userId && isLoaded){
      router.refresh();
      router.push('/');
      return;
    }
  },[userId]);


  const triggerRef=useRef<HTMLButtonElement>(null);
  return (
    <>
      {!user && <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12 flex items-center justify-center">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-6">
              <Skeleton className="h-10 w-3/4 mx-auto" /> 
              <Skeleton className="h-6 w-1/2 mx-auto" /> 
            </div>

            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-8 md:p-12">
                <Skeleton className="h-12 w-full mb-4" /> 
                <Skeleton className="h-12 w-full mb-4" /> 
                <Skeleton className="h-80 w-full mb-4" /> 
                <Skeleton className="h-80 w-full mb-4" /> 
                <Skeleton className="h-14 w-full mb-4" /> 
                <Skeleton className="h-14 w-full" /> 
              </CardContent>
            </Card>
          </div>
        </div>}
      {user && (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12 w-full overflow-x-hidden">
        <div className={`w-full mx-auto space-y-2 ${assignScreenSizes({ width: window.innerWidth })}`}>
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Generative Fill
              </h1>
              <div className="absolute -top-8 right-1/4 w-24 h-24 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -top-4 left-1/4 w-32 h-32 bg-indigo-200 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Transform and expand your images using advanced AI technology. Simply upload an image and watch the magic happen.
            </p>
  
            <InsufficientCreditBalance triggerRef={triggerRef}/>
            <TestimonialInput triggerRef={testimonialRef} name={user.name} profileImg={user.profileImg}/>
          </div>
  
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-8 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-700">Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a title for your transformation"
                              {...field}
                              className="h-12 text-lg border-2 focus:border-purple-500 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="aspectRatio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-700">Aspect Ratio</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={(val) => {
                                field.onChange(val)
                                setAspectRatio(val)
                              }} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="h-12 text-lg border-2 focus:border-purple-500 rounded-xl">
                                <SelectValue placeholder="Choose ratio" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(aspectFormats).map((key) => (
                                  <SelectItem key={key} value={key} className="text-base">
                                    {key}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
  
                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="sourceImgUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-700">Source Image</FormLabel>
                          <FormControl>
                            <div className="h-80 relative rounded-2xl overflow-hidden border-2 border-purple-400 border-dashed hover:border-purple-600 transition-colors group">
                              {!imgPublicId && isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                                  <Loader2 className="animate-spin text-purple-500" size={32} />
                                </div>
                              )}
                              {!imgPublicId && !isUploading && (
                                <div className="h-full group-hover:bg-purple-50/50 transition-colors">
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
                                  alt="Source"
                                  className="w-full h-full object-contain rounded-xl transition-all duration-300 group-hover:scale-105"
                                  onLoad={() => field.onChange(getImgUrl(imgPublicId))}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="transformedImgUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-700">Generated Result</FormLabel>
                          <FormControl>
                            <div className="h-80 relative rounded-2xl overflow-hidden bg-gray-50 border-2 border-indigo-200 shadow-lg group">
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
        
                                <DownloadImage title={form.getValues().title} url={transformedUrl} typeOfTransformation={'generativeFill'} aspectRatio={form.getValues().aspectRatio} />
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
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                  <div className="text-center space-y-4">
                                    <ImageDown className="mx-auto text-gray-400" size={64} />
                                    <p className="text-lg text-gray-500 font-medium">Your generated image will appear here</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
  
                  <div className="space-y-6 pt-6">
                    <Button
                      onClick={() => getTransformedUrl(imgPublicId,form.getValues().aspectRatio || "")}
                      disabled={!imgPublicId || isTransforming || !aspectRatio}
                      type="button"
                      className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    >
                      {isTransforming ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-6 h-6 mr-3" />
                          Generate Fill
                        </>
                      )}
                    </Button>
  
                    <Button
                      type="submit"
                      disabled={isTransforming || !imgPublicId || !transformationApplied || !transformedUrl}
                      className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
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