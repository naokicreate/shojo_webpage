import { NextResponse } from 'next/server';
import { musicVideoQueries } from '@/lib/database';

export async function GET() {
  try {
    const musicVideos = musicVideoQueries.getAll();
    return NextResponse.json(musicVideos);
  } catch (error) {
    console.error('MV取得エラー:', error);
    return NextResponse.json(
      { error: 'MVの取得に失敗しました' },
      { status: 500 }
    );
  }
}
