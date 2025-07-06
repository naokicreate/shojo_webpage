'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';

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

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/characters');
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
        const data = await response.json();
        setCharacters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

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

  // ユニットごとにキャラクターをグループ化
  const charactersByUnit = characters.reduce((acc, character) => {
    const unit = character.unitName || 'その他';
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(character);
    return acc;
  }, {} as Record<string, Character[]>);

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
            Characters
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            終焉の世界を駆け抜ける少女たち
          </p>
        </motion.div>

        {/* ユニット別キャラクター表示 */}
        {Object.entries(charactersByUnit).map(([unitName, unitCharacters], unitIndex) => (
          <motion.div
            key={unitName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: unitIndex * 0.2 }}
            className="mb-12"
          >
            {/* ユニット名 */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              {unitName}
            </h2>

            {/* キャラクターグリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {unitCharacters.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (unitIndex * 0.2) + (index * 0.1) }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group h-full">
                    {/* キャラクター画像 */}
                    <div className="relative aspect-[3/4] bg-slate-700">
                      {character.image ? (
                        <Image
                          src={`/images/characters/${character.image}`}
                          alt={character.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Image load error:', `/images/characters/${character.image}`);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon className="w-16 h-16 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg mb-1">{character.name}</h3>
                        {character.unitName && (
                          <p className="text-blue-400 text-sm">{character.unitName}</p>
                        )}
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-base line-clamp-1">
                        {character.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm">
                        {character.unitName || 'ソロ'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div 
                        className="text-gray-300 text-sm line-clamp-3 mb-4"
                        dangerouslySetInnerHTML={{ 
                          __html: character.profile.substring(0, 100) + (character.profile.length > 100 ? '...' : '')
                        }}
                      />
                      
                      <Link href={`/characters/${character.id}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          プロフィール
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* キャラクターがない場合 */}
        {characters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <UserIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">キャラクターが見つかりませんでした</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
