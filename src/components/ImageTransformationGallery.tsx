"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface TransformationType {
  id: string;
  title: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  category: string;
}

const ImageGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);

  
  const transformations: TransformationType[] = [
    {
      id: '1',
      title: 'Background Removal',
      description: 'Professional product shot with background removed',
      beforeImg: '/before1.jpg',
      afterImg: '/after1.jpg',
      category: 'Background'
    },
    {
      id: '2',
      title: 'Generative Restore',
      description: 'Restore images with AI-generative results',
      beforeImg: '/images/before-generative-restore.png',
      afterImg: '/images/after-generative-restore.png',
      category: 'Restore'
    },
    {
      id: '3',
      title: 'Generative Fill',
      description: 'Fill missing areas with AI-generated content',
      beforeImg: '/before3.jpg',
      afterImg: '/after3.jpg',
      category: 'Resize'
    },
    
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isComparing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setComparePosition(Math.min(Math.max(percentage, 0), 100));
  };

  const nextImage = () => {
    setActiveIndex((prev) => 
      prev === transformations.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveIndex((prev) => 
      prev === 0 ? transformations.length - 1 : prev - 1
    );
  };

  const activeTransformation = transformations[activeIndex];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeTransformation.id}
            className="text-3xl font-bold"
          >
            {activeTransformation.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-200"
          >
            {activeTransformation.description}
          </motion.p>
          <div className="flex gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer bg-white/10 p-2 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer bg-white/10 p-2 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className="relative aspect-video cursor-pointer"
              onMouseDown={() => setIsComparing(true)}
              onMouseUp={() => setIsComparing(false)}
              onMouseLeave={() => setIsComparing(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="absolute inset-0">
                <img 
                  src={activeTransformation.beforeImg} 
                  alt="Before" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
              >
                <img 
                  src={activeTransformation.afterImg} 
                  alt="After" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute inset-y-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${comparePosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Maximize2 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  Before
                </span>
                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  After
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4">
        {transformations.map((transform, index) => (
          <motion.div
            key={transform.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer overflow-hidden rounded-lg ${
              index === activeIndex ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <img 
              src={transform.afterImg} 
              alt={transform.title}
              className="w-full h-24 object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;