'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HeaderImageSlider from '@/components/ui/header-image-slider';
import { ArrowRight, Play, Users, Globe } from 'lucide-react';

// 型定義
interface NewsItem {
  id: number;
  title: string;
  publishedAt: string;
  body: string;
}

interface MusicVideo {
  id: number;
  title: string;
  publishedAt: string;
  youtubeId: string;
  thumbnail: string | null;
  description: string;
  lyrics: string;
  tags: string[];
}

interface Character {
  id: number;
  characterId: string;
  name: string;
  unitName: string;
  image: string;
  profile: string;
  profileTable: Array<{
    label: string;
    value: string;
  }>;
  correlationDiagram: string;
}

export default function Home() {
  const [latestMV, setLatestMV] = useState<MusicVideo | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [featuredCharacters, setFeaturedCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 最新MVを取得
        const mvResponse = await fetch('/api/music-videos/latest');
        if (mvResponse.ok) {
          const mvData = await mvResponse.json();
          setLatestMV(mvData);
        }

        // 最新ニュースを取得
        const newsResponse = await fetch('/api/news/latest');
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          setLatestNews(newsData);
        }

        // 注目キャラクターを取得
        const charactersResponse = await fetch('/api/characters/featured');
        if (charactersResponse.ok) {
          const charactersData = await charactersResponse.json();
          setFeaturedCharacters(charactersData);
        }
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* ヘッダー画像スライダー（背景として最下層） */}
        <HeaderImageSlider />
        
        {/* 元のグラデーション背景（フォールバック）ヘッダー画像より下 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 -z-10" />
        
        {/* 画像の上に重ねるグラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-black/40 to-gray-900/60 z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            終焉リリック
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            終焉に向かう近未来の世界で紡がれる、少女たちの記録。
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Play className="mr-2 h-5 w-5" />
              Latest MV
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Latest MV Section */}
        {latestMV && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Latest Music Video</h2>
            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto">
                    <Image
                      src={
                        latestMV.thumbnail 
                          ? `/images/music-videos/${latestMV.thumbnail}`
                          : latestMV.youtubeId 
                            ? `https://img.youtube.com/vi/${latestMV.youtubeId}/maxresdefault.jpg`
                            : `/images/music-videos/placeholder.png`
                      }
                      alt={latestMV.title}
                      fill
                      className="object-cover rounded-l-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                        <Play className="mr-2 h-6 w-6" />
                        Watch Now
                      </Button>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <CardTitle className="text-2xl mb-4 text-white">{latestMV.title}</CardTitle>
                    <CardDescription className="text-gray-300 mb-6 text-base">
                      {latestMV.description}
                    </CardDescription>
                    <Link href={`/music-videos/${latestMV.id}`}>
                      <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* News Section */}
        {latestNews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">Latest News</h2>
              <Link href="/news">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  View More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {latestNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/news/${news.id}`}>
                    <Card className="bg-gray-900/30 border-gray-700 hover:bg-gray-800/50 transition-colors backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg text-white">{news.title}</CardTitle>
                        <span className="text-sm text-gray-400">{news.publishedAt}</span>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Characters Section */}
        {featuredCharacters.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">Characters</h2>
              <Link href="/characters">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  <Users className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredCharacters.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Link href={`/characters/${character.id}`}>
                    <Card className="bg-gray-900/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] bg-gray-700 rounded-t-lg overflow-hidden relative">
                          {character.image ? (
                            <Image
                              src={`/images/characters/${character.image}`}
                              alt={character.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="w-16 h-16 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <CardTitle className="text-xl mb-2 text-white">{character.name}</CardTitle>
                          <CardDescription className="text-gray-400">{character.unitName}</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Worldview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Explore the World</h2>
          <Link href="/worldview">
            <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-gray-700 hover:from-blue-800/40 hover:to-purple-800/40 transition-all duration-300 backdrop-blur-sm">
              <CardContent className="p-12">
                <Globe className="mx-auto h-16 w-16 mb-6 text-blue-400" />
                <CardTitle className="text-2xl mb-4 text-white">
                  世界観を詳しく見る
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  ロジック派と感情派が対立する近未来世界の秘密を探る
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
