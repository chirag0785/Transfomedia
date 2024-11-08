"use client"
import { Download } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
type DownloadImageProps = {
    url: string,
    title: string,
    typeOfTransformation: string,
    aspectRatio?: string,
    fileExtension?:string
}
const DownloadImage = ({ url, title, typeOfTransformation, aspectRatio,fileExtension='png' }: DownloadImageProps) => {
    const downloadImage = () => {
        fetch(url) //fetches buffer response
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${title.replace(/\s+/g, '-').toLowerCase()}_${typeOfTransformation}${aspectRatio ? `_${aspectRatio}` : ''}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
    }
    return (
        <div className="absolute bottom-4 right-4">
            <Button
                onClick={downloadImage}
                type="button"
                className="flex items-center justify-center bg-opacity-60 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
                aria-label="Download Image"
            >
                <Download className="h-6 w-6" />
            </Button>

        </div>

    )
}

export default DownloadImage