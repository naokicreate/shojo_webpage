'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GlobeIcon, BookOpenIcon } from 'lucide-react';

interface WorldviewArea {
  id: string;
  name: string;
  description: string;
  mainImage: string | null;
  keywords: { term: string; definition: string }[];
}

export default function WorldviewPage() {
  const [worldviewAreas, setWorldviewAreas] = useState<WorldviewArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorldview = async () => {
      try {
        const response = await fetch('/api/worldview');
        if (!response.ok) {
          throw new Error('Failed to fetch worldview');
        }
        const data = await response.json();
        setWorldviewAreas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWorldview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">世界観を読み込み中...</p>
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
            World View
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            終焉に向かう世界の全貌
          </p>
        </motion.div>

        {worldviewAreas.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue={worldviewAreas[0]?.id} className="w-full">
              {/* タブナビゲーション */}
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-slate-800/50 border border-slate-700 mb-8">
                {worldviewAreas.map((area) => (
                  <TabsTrigger
                    key={area.id}
                    value={area.id}
                    className="text-gray-400 data-[state=active]:text-blue-400 data-[state=active]:bg-blue-500/20"
                  >
                    {area.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* エリア詳細コンテンツ */}
              {worldviewAreas.map((area, index) => (
                <TabsContent key={area.id} value={area.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  >
                    {/* エリア画像 */}
                    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                      <div className="relative aspect-video bg-slate-700">
                        {area.mainImage ? (
                          <Image
                            src={`/images/worldview/${area.mainImage}`}
                            alt={area.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <GlobeIcon className="w-16 h-16 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-white text-2xl">{area.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="text-gray-300 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: area.description }}
                        />
                      </CardContent>
                    </Card>

                    {/* キーワード用語集 */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <BookOpenIcon className="w-5 h-5 mr-2" />
                          用語集
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {area.keywords && area.keywords.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {area.keywords.map((keyword, keywordIndex) => (
                              <AccordionItem
                                key={keywordIndex}
                                value={`keyword-${keywordIndex}`}
                                className="border-slate-600"
                              >
                                <AccordionTrigger className="text-blue-400 hover:text-blue-300 text-left">
                                  {keyword.term}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-300">
                                  {keyword.definition}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <p className="text-gray-500 italic">用語集は準備中です</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GlobeIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">世界観情報が見つかりませんでした</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
