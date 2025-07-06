import { NextResponse } from 'next/server';
import { musicVideoQueries } from '@/lib/database';

export async function GET() {
  try {
    const latestMV = musicVideoQueries.getLatest();
    return NextResponse.json(latestMV);
  } catch (error) {
    console.error('最新MV取得エラー:', error);
    return NextResponse.json(
      { error: '最新MVの取得に失敗しました' },
      { status: 500 }
    );
  }
}
