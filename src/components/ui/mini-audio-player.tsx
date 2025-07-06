'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MiniAudioPlayerProps {
  audioPath: string;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

export default function MiniAudioPlayer({ 
  audioPath, 
  onPlay, 
  onPause, 
  className = "" 
}: MiniAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onPause?.();
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPause]);

  const togglePlayPause = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        await audio.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error('音楽の再生に失敗しました:', error);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioPath} preload="metadata" />
      <Button
        onClick={togglePlayPause}
        disabled={isLoading}
        size="lg"
        className={`bg-white/90 hover:bg-white text-black transition-all duration-300 ${className}`}
      >
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
    </>
  );
}
