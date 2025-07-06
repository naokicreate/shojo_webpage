'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AudioPlayer from '@/components/ui/audio-player';
import { ArrowLeftIcon, CalendarIcon, PlayIcon, ExternalLinkIcon } from 'lucide-react';

interface MusicVideo {
  id: string;
  title: string;
  publishedAt: string;
  youtubeId: string;
  thumbnail: string | null;
  description: string;
  lyrics: string;
  tags: string[];
  audioPath: string | null;
}

export default function MusicVideoDetailPage() {
  const params = useParams();
  const [musicVideo, setMusicVideo] = useState<MusicVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusicVideo = async () => {
      try {
        const response = await fetch(`/api/music-videos/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch music video');
        }
        const data = await response.json();
        setMusicVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMusicVideo();
    }
  }, [params.id]);

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

  if (error || !musicVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error || '楽曲が見つかりませんでした'}</p>
          <Link href="/music-videos">
            <Button className="mt-4">楽曲一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/music-videos">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              楽曲一覧に戻る
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* タイトル・メタ情報 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {musicVideo.title}
              </h1>
              <div className="flex items-center text-gray-400 mb-4">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>{new Date(musicVideo.publishedAt).toLocaleDateString('ja-JP')}</span>
              </div>
              
              {/* タグ */}
              {musicVideo.tags && musicVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {musicVideo.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 動画プレイヤー */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-0">
                  {musicVideo.youtubeId ? (
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${musicVideo.youtubeId}`}
                        title={musicVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-700 flex items-center justify-center">
                      {musicVideo.thumbnail ? (
                        <Image
                          src={`/images/music-videos/${musicVideo.thumbnail}`}
                          alt={musicVideo.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <PlayIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">動画なし</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* YouTube リンク */}
              {musicVideo.youtubeId && (
                <div className="mt-4">
                  <a
                    href={`https://www.youtube.com/watch?v=${musicVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLinkIcon className="w-4 h-4 mr-2" />
                    YouTubeで視聴
                  </a>
                </div>
              )}
            </motion.div>

            {/* 音楽プレイヤー */}
            {musicVideo.audioPath && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <AudioPlayer 
                  audioPath={musicVideo.audioPath} 
                  title={musicVideo.title}
                />
              </motion.div>
            )}

            {/* 説明文 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">楽曲について</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: musicVideo.description }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            {/* 歌詞 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white">歌詞</CardTitle>
                </CardHeader>
                <CardContent>
                  {musicVideo.lyrics ? (
                    <div 
                      className="text-gray-300 whitespace-pre-line text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: musicVideo.lyrics }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">歌詞は準備中です</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
