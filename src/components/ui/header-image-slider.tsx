'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderImage {
  id: number;
  imagePath: string;
  imageType: 'png' | 'jpg' | 'webp';
  displayDuration: number;
  isActive: boolean;
  sortOrder: number;
}

export default function HeaderImageSlider() {
  const [images, setImages] = useState<HeaderImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/header-images');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('ヘッダー画像の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const getCurrentImage = useCallback(() => {
    return images[currentIndex];
  }, [images, currentIndex]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const getDisplayDuration = useCallback((image: HeaderImage): number => {
    if (image.imageType === 'webp' && image.displayDuration === 0) {
      return 10; // WEBPアニメーションの場合のデフォルト時間
    }
    return image.displayDuration;
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const currentImage = getCurrentImage();
    if (!currentImage) return;

    const duration = getDisplayDuration(currentImage);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      nextImage();
    }, duration * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, images, getCurrentImage, nextImage, getDisplayDuration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (loading || images.length === 0) {
    return null;
  }

  const currentImage = getCurrentImage();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1,
            ease: "easeInOut"
          }}
          className="absolute inset-0 w-full h-full"
        >
          {currentImage.imageType === 'webp' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentImage.imagePath}
              alt="Header animation"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={currentImage.imagePath}
              alt="Header image"
              fill
              className="object-cover"
              priority={currentIndex === 0}
              quality={90}
            />
          )}
          
          {/* 乗算モードの黒い青めのグラデーションオーバーレイ */}
          <div className="absolute inset-0 w-full h-full mix-blend-multiply bg-gradient-to-br from-slate-900/80 via-blue-900/90 to-slate-950/95" />
        </motion.div>
      </AnimatePresence>
      
      {/* 画像インジケーター */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
