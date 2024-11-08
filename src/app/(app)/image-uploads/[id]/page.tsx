"use client"
import TransformationUpdateForm from '@/components/TransformationUpdateForm'
import { Image, User } from '@prisma/client'
import axios from 'axios'
import { getCldImageUrl } from 'next-cloudinary'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { aspectFormats } from '@/utils/imageUtils'
import { useAuth } from '@clerk/nextjs'
import InsufficientCreditBalance from '@/components/InsufficientCreditBalance'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
const Page = ({ params }: { params: { id: string } }) => {
    const [imgDetails, setImgDetails] = useState<Image>();
    const [transformationApplied, setIsTransformationApplied] = useState(true);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformedUrl, setTransformedUrl] = useState('');
    const [aspectRatio, setAspectRatio] = useState('');
    const [title, setTitle] = useState('');
    const { userId ,isLoaded} = useAuth();
    const [user, setUser] = useState<User>();
    const router=useRouter();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const applyTransformation = () => {

        if (user && user?.credits < 2) {
            if (triggerRef) {
                triggerRef.current?.click();
                return;
            }
        }
        setIsTransformationApplied(true);
        setIsTransforming(true);
        getTransformedImageUrl();
    }

    const getTransformedImageUrl = () => {
        const src: string = imgDetails?.originalImgurl as string;
        const options: any = {};

        if (imgDetails?.typeOfTransformation === "replaceBackground") {
            options.crop = "scale";
            options.removeBackground = true;
            options.underlay = imgDetails?.backgroundImgurl;
            options.width = "960";
            options.height = "600";
        }

        if (imgDetails?.typeOfTransformation === "generativeRestore") {
            options.restore = true;
        }

        if (imgDetails?.typeOfTransformation === "generativeFill") {
            options.aspectRatio =
                aspectFormats[aspectRatio as keyof typeof aspectFormats].aspectRatio;
            options.crop = 'fill';
            options.fillBackground = true;
            options.width = aspectFormats[aspectRatio as keyof typeof aspectFormats].width;
            options.height = aspectFormats[aspectRatio as keyof typeof aspectFormats].height;
        }

        const url = getCldImageUrl({ ...options, src });
        let attempts = 0;
        const maxAttempts = 60;

        const pollTransformation = async () => {
            const isReady = await checkTransformation(url);
            if (isReady) {
                setTransformedUrl(url);
                setIsTransforming(false);
                axios.post(`/api/update-credits`)
                    .then((response) => response.data)
                    .then((data) => {
                        setUser(data.user);
                    })
                    .catch((err) => {
                        alert('Error updating credits');
                        console.error(err);
                    })
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(pollTransformation, 3000);
            } else {
                alert("Transformation failed try again");
                setIsTransforming(false);
                setIsTransformationApplied(false);
            }
        };

        pollTransformation();
    }
    const checkTransformation = useCallback(
        async (url: string): Promise<boolean> => {
            try {
                const response = await fetch(url, { method: "HEAD" });
                return response.ok;
            } catch {
                return false;
            }
        },
        [userId]
    );
    useEffect(() => {
        const fetchImageDetails = async () => {
            axios.get(`/api/image/${params.id}`)
                .then((response) => {
                    setImgDetails(response.data.image);
                    setAspectRatio(response.data.image?.aspectRatio || "");
                    setTransformedUrl(response.data.image?.url);
                    setTitle(response.data.image?.title);
                })
                .catch((err) => {
                    console.log(err)
                    alert('Error fetching image details')
                })
        }
        fetchImageDetails()
    }, [params.id,userId])
    const fetchUser = () => {
        axios.get(`/api/get-user-details/${userId}`)
            .then((response) => response.data)
            .then((data) => {
                setUser(data.user);
            })
            .catch((err) => {
                alert('Error fetching User details');
                console.error(err);
            })
    }

    useEffect(() => {
        if(!userId && isLoaded){
          router.refresh();
          router.push('/');
          return;
        }
        if(userId){
            fetchUser();
        }
      },[userId]);
    return (
        <div>

            {
                !imgDetails || !user
                    ?
                    <div className="space-y-8">
                        {/* Title Skeleton */}
                        <div>
                            <div className="mb-2">
                                <Skeleton className="h-5 w-1/4" />
                            </div>
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>

                        {/* Aspect Ratio Skeleton */}

                        <div>
                            <div className="mb-2">
                                <Skeleton className="h-5 w-1/4" />
                            </div>
                            <Skeleton className="h-10 w-40 rounded-md" />
                        </div>

                        {/* Main Image Skeleton */}
                        <div>
                            <div className="mb-2">
                                <Skeleton className="h-5 w-1/4" />
                            </div>
                            <Skeleton className="h-[200px] w-full rounded-lg" />
                        </div>

                        {/* Background Image Skeleton */}
                        <div>
                            <div className="mb-2">
                                <Skeleton className="h-5 w-1/4" />
                            </div>
                            <Skeleton className="h-[200px] w-full rounded-lg" />
                        </div>

                        {/* Transformed Image Skeleton */}
                        <div>
                            <div className="mb-2">
                                <Skeleton className="h-5 w-1/4" />
                            </div>
                            <Skeleton className="h-[300px] w-full rounded-lg" />
                        </div>

                        {/* Button Skeletons */}
                        <div className="flex space-x-4">
                            <Skeleton className="h-10 w-1/4 rounded-md" />
                            <Skeleton className="h-10 w-1/4 rounded-md" />
                            <Skeleton className="h-10 w-1/4 rounded-md" />
                        </div>
                    </div>
                    :

                    <div>

                        <InsufficientCreditBalance triggerRef={triggerRef} />
                        <TransformationUpdateForm
                            imgDetails={imgDetails}
                            transformationApplied={transformationApplied}
                            isTransforming={isTransforming}
                            transformedUrl={transformedUrl}
                            setAspectRatio={setAspectRatio}
                            setTitle={setTitle}
                            applyTransformation={applyTransformation}
                        />

                    </div>
            }
        </div>
    )
}

export default Page