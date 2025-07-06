'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, ImageIcon, Clock } from 'lucide-react';

interface HeaderImage {
  id: number;
  imagePath: string;
  imageType: 'png' | 'jpg' | 'webp';
  displayDuration: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function HeaderImagesAdmin() {
  const [images, setImages] = useState<HeaderImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'png':
        return 'bg-blue-100 text-blue-800';
      case 'jpg':
        return 'bg-green-100 text-green-800';
      case 'webp':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (duration: number, type: string) => {
    if (type === 'webp' && duration === 0) {
      return 'アニメーション時間';
    }
    return `${duration}秒`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            ヘッダー画像管理
          </h1>
          <p className="text-gray-300">
            ホームページのヘッダー部分に表示される画像を管理します。PNG、JPG、WEBPアニメーションをサポートしています。
          </p>
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="images">画像一覧</TabsTrigger>
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-6">
            {images.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                  <p className="text-gray-400">ヘッダー画像が登録されていません</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {images.map((image) => (
                  <Card key={image.id} className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <ImageIcon className="h-5 w-5" />
                          {image.imagePath.split('/').pop()}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(image.imageType)}>
                            {image.imageType.toUpperCase()}
                          </Badge>
                          <Badge variant={image.isActive ? "default" : "secondary"}>
                            {image.isActive ? "アクティブ" : "非アクティブ"}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-gray-400">
                        表示順: {image.sortOrder} | 作成日: {new Date(image.createdAt).toLocaleDateString('ja-JP')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* 画像プレビュー */}
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                          {image.imageType === 'webp' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image.imagePath}
                              alt="Header preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={image.imagePath}
                              alt="Header preview"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        {/* 画像情報 */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">画像パス</h4>
                            <code className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-300">
                              {image.imagePath}
                            </code>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              表示時間
                            </h4>
                            <p className="text-gray-300">
                              {formatDuration(image.displayDuration, image.imageType)}
                            </p>
                          </div>
                        </div>

                        {/* アクション */}
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-white border-white hover:bg-white hover:text-black"
                            disabled
                          >
                            {image.isActive ? (
                              <ToggleRight className="mr-2 h-4 w-4" />
                            ) : (
                              <ToggleLeft className="mr-2 h-4 w-4" />
                            )}
                            {image.isActive ? "無効化" : "有効化"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-white border-white hover:bg-white hover:text-black"
                            disabled
                          >
                            <ArrowUp className="mr-2 h-4 w-4" />
                            順序を上げる
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-white border-white hover:bg-white hover:text-black"
                            disabled
                          >
                            <ArrowDown className="mr-2 h-4 w-4" />
                            順序を下げる
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            disabled
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            削除
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">ヘッダー画像プレビュー</CardTitle>
                <CardDescription className="text-gray-400">
                  実際のホームページでの表示をシミュレーションします
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                  <p className="absolute inset-0 flex items-center justify-center text-gray-400">
                    プレビュー機能は開発中です
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
