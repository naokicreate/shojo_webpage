'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewsItem {
  id: number;
  title: string;
  publishedAt: string;
  body: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        }
      } catch (error) {
        console.error('ニュースの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          News
        </h1>
        
        <div className="space-y-8">
          {news.map((newsItem) => (
            <Link key={newsItem.id} href={`/news/${newsItem.id}`}>
              <Card className="bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 transition-colors backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl text-white hover:text-blue-400 transition-colors">
                      {newsItem.title}
                    </CardTitle>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {newsItem.publishedAt}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    {newsItem.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
