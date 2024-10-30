"use client"
import { CldUploadWidget, CloudinaryUploadWidgetResults, getCldImageUrl } from 'next-cloudinary';
import React, { useCallback, useState } from 'react'
interface ImageUploadWidgetProps {
    setImgPublicId: (publicId: string) => void;
    setIsUploading: (isUploading: boolean) => void;
    text: string
}
const ImageUploadWidget = ({ setImgPublicId, setIsUploading, text }: ImageUploadWidgetProps) => {
    return (
        <CldUploadWidget options={{
            clientAllowedFormats: ['png', 'jpeg', 'jpg','webp'],
            resourceType:'image',
            maxFileSize:10000000
        }} uploadPreset='transformify-uploads' onSuccess={(results: CloudinaryUploadWidgetResults) => {
            setImgPublicId((results.info as any).public_id);
            setIsUploading(false);
        }}
            onError={((err) => {
                console.error(err);
                setIsUploading(false)
            })}
        >
            {({ open }) => {
                return (
                    <button onClick={(ev: any) => {
                        ev.preventDefault()
                        open()
                    }}>

                        <div className="flex items-center justify-center h-96  rounded-lg cursor-pointer w-full">
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M3 7v4a1 1 0 001 1h3m10-5h-3m0 0h3m-3 0l4-4m0 4l-4-4M13 16v-4m0 0v4m0-4l4 4m0 0l-4 4m4-4H7" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">
                                    {text}
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>

                    </button>
                );
            }}
        </CldUploadWidget>


    )
}

export default ImageUploadWidget