'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, UserIcon } from 'lucide-react';

interface Character {
  id: string;
  characterId: string;
  name: string;
  unitName: string;
  image: string | null;
  profile: string;
  table: { label: string; value: string }[];
  correlationDiagram: string | null;
}

export default function CharacterDetailPage() {
  const params = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/characters/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch character');
        }
        const data = await response.json();
        setCharacter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCharacter();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">キャラクターを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error || 'キャラクターが見つかりませんでした'}</p>
          <Link href="/characters">
            <Button className="mt-4">キャラクター一覧に戻る</Button>
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
          <Link href="/characters">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              キャラクター一覧に戻る
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* キャラクター画像・基本情報 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                {/* キャラクター画像 */}
                <div className="relative aspect-[3/4] bg-slate-700">
                  {character.image ? (
                    <Image
                      src={`/images/characters/${character.image}`}
                      alt={character.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-20 h-20 text-gray-500" />
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-white text-2xl">{character.name}</CardTitle>
                  {character.unitName && (
                    <p className="text-blue-400">{character.unitName}</p>
                  )}
                </CardHeader>
              </Card>

              {/* プロフィール表 */}
              {character.table && character.table.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-6"
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">プロフィール</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {character.table.map((item, index) => (
                          <div key={index} className="flex border-b border-slate-600 pb-2">
                            <div className="text-gray-400 w-24 flex-shrink-0 text-sm">
                              {item.label}
                            </div>
                            <div className="text-white text-sm">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* プロフィール詳細・相関図 */}
          <div className="lg:col-span-2">
            {/* タイトル */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {character.name}
              </h1>
              {character.unitName && (
                <p className="text-blue-400 text-lg">{character.unitName}</p>
              )}
            </motion.div>

            {/* プロフィール詳細 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">プロフィール</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: character.profile }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* 相関図 */}
            {character.correlationDiagram && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">相関図</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video bg-slate-700 rounded-lg overflow-hidden">
                      <Image
                        src={`/images/characters/${character.correlationDiagram}`}
                        alt={`${character.name}の相関図`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
