"use client"
import React from 'react'
type TransformationUpdateFormProps = {
  imgDetails: Image,
  transformationApplied: boolean,
  isTransforming: boolean,
  transformedUrl: string,
  setAspectRatio: (aspectRatio: string) => void,
  setTitle: (title: string) => void
  applyTransformation: () => void
}
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { transformationSchema } from '@/schemas/transformationSchema'
import { Image } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageDown, RefreshCw } from 'lucide-react'
import { aspectFormats } from '@/utils/imageUtils'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import DownloadImage from './DownloadImage'

const TransformationUpdateForm = ({ imgDetails, transformationApplied, isTransforming, transformedUrl, setAspectRatio, setTitle, applyTransformation }: TransformationUpdateFormProps) => {
  const [savedChanges, setSavedChanges] = React.useState(true);
  const form = useForm<z.infer<typeof transformationSchema>>({
    resolver: zodResolver(transformationSchema),
    defaultValues: {
      sourceImgUrl: imgDetails.originalImgurl,
      backgroundImgUrl: imgDetails.backgroundImgurl || "",
      title: imgDetails.title,
      transformedImgUrl: imgDetails.url,
      aspectRatio: imgDetails.aspectRatio || ""
    },
  })
  const { toast } = useToast();
  const router = useRouter();
  function onSubmit(values: z.infer<typeof transformationSchema>) {
    console.log(values);

    if (!savedChanges) {
      alert('Please apply transformation first before updating');
      return;
    }
    const data: any = {
      originalImgurl: values.sourceImgUrl,
      url: values.transformedImgUrl,
      title: values.title,
    };
    if (imgDetails.typeOfTransformation === 'generativeFill') {
      data.aspectRatio = values?.aspectRatio
    }
    if (imgDetails.typeOfTransformation === 'replaceBackground') {
      data.backgroundImgurl = values?.backgroundImgUrl
    }
    axios.post(`/api/update-transformation/${imgDetails.id}`, {
      ...data
    })
      .then((response) => {
        toast({
          title: "Success",
          description: "Update Image success",
        })
        router.refresh();
        router.push('/home');
      })
      .catch((err) => {
        console.error(err);
        alert('Error saving the image try again');
      })
  }
  return (
    <div>
      <Form {...form}>
        <form onError={(e) => console.log(e)} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title" {...field} onChange={(ev) => {
                    field.onChange(ev.target.value)
                    setTitle(ev.target.value)
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {imgDetails.typeOfTransformation === 'generativeFill'

            &&

            <FormField
              control={form.control}
              name="aspectRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aspect Ratio</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => {
                      field.onChange(val)
                      setAspectRatio(val)
                      setSavedChanges(false);
                    }} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Aspect Ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(aspectFormats).map((key) => (
                          <SelectItem key={key} value={key}>{key}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }

          <FormField
            control={form.control}
            name="sourceImgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image</FormLabel>
                <FormControl>
                  <img
                    src={field.value}
                    alt="source image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {imgDetails.typeOfTransformation === 'replaceBackground' &&
            <FormField
              control={form.control}
              name="backgroundImgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <img
                      src={field.value}
                      alt="background image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }


          <FormField
            control={form.control}
            name="transformedImgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transformed Image</FormLabel>
                <FormControl>
                  <div className="w-full max-w-sm">
                    {transformationApplied && !isTransforming && (
                      <div className="relative w-full h-full">
                        <img
                          src={transformedUrl}
                          className="w-full h-full object-contain rounded-lg shadow-md"
                          alt="Transformed"
                          onLoad={() => {
                            field.onChange(transformedUrl);
                            setSavedChanges(true);
                          }}
                        />

                        {savedChanges && <DownloadImage title={form.getValues().title} url={transformedUrl} typeOfTransformation={imgDetails?.typeOfTransformation} aspectRatio={form.getValues().aspectRatio} />}
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
          <Button type="button" onClick={applyTransformation} disabled={isTransforming || savedChanges}>Apply Transformation</Button>
          <Button type="submit">Update Image</Button>
          <Button type='button'>Delete Image</Button>
        </form>
      </Form>
    </div>
  )
}

export default TransformationUpdateForm