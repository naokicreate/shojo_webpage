import { NextResponse } from 'next/server';
import { characterQueries } from '@/lib/database';

export async function GET() {
  try {
    const characters = characterQueries.getAll();
    return NextResponse.json(characters);
  } catch (error) {
    console.error('キャラクター取得エラー:', error);
    return NextResponse.json(
      { error: 'キャラクターの取得に失敗しました' },
      { status: 500 }
    );
  }
}
