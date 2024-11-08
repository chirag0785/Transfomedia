"use client";
import { useAuth } from "@clerk/nextjs";
import ImageUploadWidget from "@/components/ImageUploadWidget";
import {
    Loader2,
    Image as ImageIcon,
    ImageDown,
    Wand2,
    Upload,
    RefreshCw,
} from "lucide-react";
import { getCldImageUrl } from "next-cloudinary";
import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { transformationSchema } from "@/schemas/transformationSchema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import InsufficientCreditBalance from "@/components/InsufficientCreditBalance";
import DownloadImage from "@/components/DownloadImage";
import { Skeleton } from "@/components/ui/skeleton";
import TestimonialInput from "@/components/TestimonialInput";
const Page = () => {
    const [imgPublicId, setImgPublicId] = useState("");
    const [backgroundImgPublicId, setBackgroundImgPublicId] = useState("");
    const [uploading, setIsUploading] = useState(false);
    const [backgroundUploading, setBackgroundIsUploading] = useState(false);
    const [transformationApplied, setIsTransformationApplied] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformedUrl, setTransformedUrl] = useState("");
    const { userId,isLoaded } = useAuth();
    const router = useRouter();
    const testimonialRef=useRef<HTMLButtonElement>(null);
    const [user, setUser] = useState<User>()
    const form = useForm<z.infer<typeof transformationSchema>>({
        resolver: zodResolver(transformationSchema),
        defaultValues: {
            sourceImgUrl: "",
            backgroundImgUrl: "",
            title: "",
            transformedImgUrl: "",
        },
    });

    const getImgUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
        });
    }, [userId]);

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

    const getTransformedImageUrl = useCallback(
        (imgPublicId: string, backgroundPublicId: string) => {
            const url = getCldImageUrl({
                width: "960",
                height: "600",
                src: imgPublicId,
                crop: "scale",
                removeBackground: true,
                underlay: backgroundPublicId,
            });

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
                            const tranformationsDone = data.user.tranformationsDone;
                            if (tranformationsDone == 1 || (tranformationsDone != 0 && tranformationsDone % 5 == 0)) {
                                setTimeout(() => {
                                    if (testimonialRef) {
                                        testimonialRef.current?.click();
                                    }
                                }, 3000)
                            }
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
        },
        [userId]
    );

    const applyTransformation = () => {
        if (user && user?.credits < 2) {
            if (triggerRef) {
                triggerRef.current?.click();
            }
            return;
        }
        setIsTransformationApplied(true);
        setIsTransforming(true);
        getTransformedImageUrl(imgPublicId, backgroundImgPublicId);
    };

    const onSubmit = (data: z.infer<typeof transformationSchema>) => {
        const { sourceImgUrl, backgroundImgUrl, title, transformedImgUrl } = data;
        axios.post('/api/save-transformation', {
            originalImgurl: sourceImgUrl,
            backgroundImgurl: backgroundImgUrl,
            title: title,
            url: transformedImgUrl,
            typeOfTransformation: "replaceBackground"
        })

            .then((response) => response.data)
            .then((data) => {
                router.refresh();
                router.push(`/image-uploads/${data.image.id}`);
            })
            .catch((err) => {
                alert('Error while saving transformation');
            })
    };
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
        if(userId){
          fetchUser();
        }

        if(!userId && isLoaded){
            router.refresh();
            router.push('/');
        }
      },[userId]);


    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            {!user && <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <Skeleton className="mx-auto bg-gray-200 rounded-lg text-4xl md:text-5xl h-10 w-3/4" />
                        <Skeleton className="mx-auto bg-gray-200 rounded-lg text-lg h-6 w-2/3" />
                        <Skeleton className="mx-auto bg-gray-200 rounded-lg text-lg h-6 w-2/3" />
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column - Source Images */}
                        <div className="space-y-6">
                            <Skeleton className="rounded-lg shadow-md bg-gray-200 h-40 w-full" />
                            <Skeleton className="rounded-lg bg-gray-200 h-12 w-1/2" />
                            <Skeleton className="rounded-lg shadow-md bg-gray-200 h-40 w-full" />
                            <Skeleton className="rounded-lg bg-gray-200 h-12 w-1/2" />
                        </div>

                        {/* Right Column - Transformed Result */}
                        <div className="space-y-6">
                            <Skeleton className="rounded-lg shadow-md bg-gray-200 h-40 w-full" />
                            <Skeleton className="rounded-lg bg-gray-200 h-12 w-1/2" />
                        </div>
                    </div>
                </div>
            </div>}
            {user && (
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Image Transformation Studio
                            </h1>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Transform your images with AI-powered background removal and replacement
                            </p>
                            <InsufficientCreditBalance triggerRef={triggerRef} />
                            <TestimonialInput triggerRef={testimonialRef} name={user.name} profileImg={user.profileImg} />
                        </div>

                        {/* Main Content */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-8">
                                {/* Left Column - Source Images */}
                                <div className="space-y-6">
                                    <Card className="shadow-xl border border-gray-200/50 backdrop-blur-sm bg-white/50">
                                        <CardHeader className="border-b border-gray-100">
                                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                                <ImageIcon className="w-5 h-5 text-blue-500" />
                                                Source Images
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700">Title</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter Title"
                                                                {...field}
                                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="sourceImgUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700">Main Image</FormLabel>
                                                        <FormControl>
                                                            <div className="h-48 relative rounded-lg overflow-hidden border border-purple-900 border-dashed ">
                                                                {!imgPublicId && uploading && (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                                                                        <Loader2 className="animate-spin text-blue-500" size={24} />
                                                                    </div>
                                                                )}
                                                                {!imgPublicId && !uploading && (
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
                                                                        className="w-full h-full object-contain rounded-lg"
                                                                        onLoad={() => field.onChange(getImgUrl(imgPublicId))}
                                                                    />
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="backgroundImgUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700">Background Image</FormLabel>
                                                        <FormControl>
                                                            <div className="h-48 relative rounded-lg overflow-hidden border border-purple-900 border-dashed ">
                                                                {!backgroundImgPublicId && backgroundUploading && (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                                                                        <Loader2 className="animate-spin text-purple-500" size={24} />
                                                                    </div>
                                                                )}
                                                                {!backgroundImgPublicId && !backgroundUploading && (
                                                                    <div className="h-full">
                                                                        <ImageUploadWidget
                                                                            setImgPublicId={setBackgroundImgPublicId}
                                                                            setIsUploading={setBackgroundIsUploading}
                                                                            text="Upload Background Image"
                                                                        />
                                                                    </div>
                                                                )}
                                                                {backgroundImgPublicId && (
                                                                    <img
                                                                        src={getImgUrl(backgroundImgPublicId)}
                                                                        alt="Background"
                                                                        className="w-full h-full object-contain rounded-lg"
                                                                        onLoad={() => field.onChange(getImgUrl(backgroundImgPublicId))}
                                                                    />
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="button"
                                                onClick={applyTransformation}
                                                disabled={!imgPublicId || !backgroundImgPublicId || isTransforming}
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                {isTransforming ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wand2 className="w-5 h-5 mr-2" />
                                                        Transform Image
                                                    </>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Column - Transformed Result */}
                                <div className="space-y-6">
                                    <Card className="shadow-xl border border-gray-200/50 backdrop-blur-sm bg-white/50">
                                        <CardHeader className="border-b border-gray-100">
                                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                                <Wand2 className="w-5 h-5 text-purple-500" />
                                                Transformed Result
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <FormField
                                                control={form.control}
                                                name="transformedImgUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
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

                                                                        <DownloadImage title={form.getValues().title} url={transformedUrl} typeOfTransformation={'replaceBackground'} />
                                                                    </div>

                                                                )}
                                                                {isTransforming && (
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                                                                        <div className="text-center space-y-3">
                                                                            <RefreshCw className="animate-spin mx-auto text-purple-500" size={32} />
                                                                            <p className="text-sm text-gray-600">Creating your masterpiece...</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {!isTransforming && !transformationApplied && (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="text-center space-y-3">
                                                                            <ImageDown className="mx-auto text-gray-400" size={48} />
                                                                            <p className="text-gray-500">Your transformed image will appear here</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="mt-6">
                                                <Button
                                                    type="submit"
                                                    disabled={isTransforming || !backgroundImgPublicId || !imgPublicId || !transformationApplied || !transformedUrl}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                                >
                                                    Save Transformation
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;