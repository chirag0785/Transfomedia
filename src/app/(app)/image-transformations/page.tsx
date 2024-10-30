"use client"
import React, { useCallback, useState } from 'react'
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetResults, getCldImageUrl } from 'next-cloudinary';

const Page = () => {
    
    const [imgPublicId, setImgPublicId] = useState('');
    const [uploading, setIsUploading] = useState(false);

    const getImgUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId
        });
    }, [imgPublicId])
    return (
        <div>
            <CldUploadWidget uploadPreset='transformify-uploads' onSuccess={(results: CloudinaryUploadWidgetResults) => {
                setImgPublicId((results.info as any).public_id);
                setIsUploading(false);
            }} onQueuesStart={() => setIsUploading(true)}
                onError={((err) => {
                    console.error(err);
                    setIsUploading(false)
                })}
            >
                {({ open }) => {
                    return (
                        <button onClick={() => open()}>
                            Upload an Image
                        </button>
                    );
                }}
            </CldUploadWidget>

            {!uploading &&
                imgPublicId &&
                <img src={getImgUrl(imgPublicId)} alt="Uploaded Image" />
            }

            {!uploading &&
                imgPublicId &&

                <CldImage
                    src={imgPublicId}
                    alt='Generative Restore Image'
                    restore
                    width={400}
                    height={225}
                />
            }

        </div>
    )
}

export default Page