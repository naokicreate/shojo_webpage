import { NextResponse } from 'next/server';
import { characterQueries } from '@/lib/database';

export async function GET() {
  try {
    const featuredCharacters = characterQueries.getFeatured(2);
    return NextResponse.json(featuredCharacters);
  } catch (error) {
    console.error('注目キャラクター取得エラー:', error);
    return NextResponse.json(
      { error: '注目キャラクターの取得に失敗しました' },
      { status: 500 }
    );
  }
}
