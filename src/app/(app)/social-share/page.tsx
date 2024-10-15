"use client"
import axios from 'axios';
import { CldImage } from 'next-cloudinary';
import React, { useEffect, useRef, useState } from 'react'

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};


type SocialFormat = keyof typeof socialFormats;
const Page = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage, selectedFormat])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    axios.post('/api/image-upload', formData)
      .then((response) => response.data)
      .then((data) => {
        setUploadedImage(data.publicId);
      })
      .catch((err) => {
        console.log(err);
        alert('Image upload failed');
      })
      .finally(() => {
        setIsUploading(false);
      })
  }

  const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src) //fetches buffer response
      .then((response) => response.blob())  //conversion to blob
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {

      })
  }
  return (
    <div>

      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
        onChange={handleFileUpload} />


      {isUploading && <progress className="progress w-56"></progress>}

      {uploadedImage &&
        <div>
          <h2 className="card-title mb-4">Select Social Media Format</h2>
          <select className="select select-primary w-full max-w-xs" onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)} defaultValue={selectedFormat}>
            {Object.keys(socialFormats).map((format) => (
              <option
                key={format}
                value={format}
              >
                {format}
              </option>
            ))}
          </select>

          <div className="mt-6 relative">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <div className="flex justify-center">
              {isTransforming && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}
              <CldImage
                width={socialFormats[selectedFormat].width}
                height={socialFormats[selectedFormat].height}
                src={uploadedImage}
                sizes="100vw"
                alt="transformed image"
                crop="fill"
                aspectRatio={socialFormats[selectedFormat].aspectRatio}
                gravity='auto'
                ref={imageRef}
                onLoad={() => setIsTransforming(false)}
              />
            </div>
          </div>


          <button className="btn btn-primary" onClick={handleDownload}>Download for {selectedFormat}</button>
        </div>
      }

    </div>
  )
}

export default Page