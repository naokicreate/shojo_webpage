'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, PlayIcon } from 'lucide-react';

interface MusicVideo {
  id: string;
  title: string;
  publishedAt: string;
  youtubeId: string;
  thumbnail: string | null;
  description: string;
  lyrics: string;
  tags: string[];
}

export default function MusicVideosPage() {
  const [musicVideos, setMusicVideos] = useState<MusicVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusicVideos = async () => {
      try {
        const response = await fetch('/api/music-videos');
        if (!response.ok) {
          throw new Error('Failed to fetch music videos');
        }
        const data = await response.json();
        setMusicVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMusicVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">楽曲を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Music Videos
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            終焉に向かう世界で響く、少女たちの歌声
          </p>
        </motion.div>

        {/* 楽曲グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicVideos.map((mv, index) => (
            <motion.div
              key={mv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group">
                {/* サムネイル */}
                <div className="relative aspect-video bg-slate-700">
                  {mv.thumbnail ? (
                    <Image
                      src={`/images/music-videos/${mv.thumbnail}`}
                      alt={mv.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : mv.youtubeId ? (
                    <Image
                      src={`https://img.youtube.com/vi/${mv.youtubeId}/maxresdefault.jpg`}
                      alt={mv.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayIcon className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayIcon className="w-12 h-12 text-white" />
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                    {mv.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {new Date(mv.publishedAt).toLocaleDateString('ja-JP')}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {mv.description}
                  </p>
                  
                  {/* タグ */}
                  {mv.tags && mv.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mv.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {mv.tags.length > 3 && (
                        <Badge variant="outline" className="text-gray-400">
                          +{mv.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Link href={`/music-videos/${mv.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      詳細を見る
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 楽曲がない場合 */}
        {musicVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <PlayIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">楽曲が見つかりませんでした</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
