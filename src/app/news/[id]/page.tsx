'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewsItem {
  id: number;
  title: string;
  publishedAt: string;
  body: string;
}

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else if (response.status === 404) {
          notFound();
        }
      } catch (error) {
        console.error('ニュース詳細の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!news) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <div className="mb-4">
              <span className="text-sm text-gray-400">{news.publishedAt}</span>
            </div>
            <CardTitle className="text-3xl md:text-4xl text-white mb-8">
              {news.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-invert prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: news.body }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
