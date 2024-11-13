import React from 'react';
import { Calendar, Image as ImageIcon, Wand2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@prisma/client';
type ImageCardProps = {
    image:Image
}
const ImageCard = ({ image }:ImageCardProps) => {
  const formatDate = (dateString:Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
            {image.aspectRatio || 'Original'}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4 bg-gradient-to-b from-gray-50 to-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {image.title}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Wand2 className="h-4 w-4 mr-2 text-purple-500" />
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
              {image.typeOfTransformation}
            </span>
          </div>
          
          {image.backgroundImgurl && (
            <div className="flex items-center text-sm text-gray-600">
              <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-blue-600">Background Added</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(image.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;