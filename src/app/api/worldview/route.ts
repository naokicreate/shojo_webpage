import { NextResponse } from 'next/server';
import { worldviewQueries } from '@/lib/database';

export async function GET() {
  try {
    const worldviews = worldviewQueries.getAll();
    return NextResponse.json(worldviews);
  } catch (error) {
    console.error('世界観取得エラー:', error);
    return NextResponse.json(
      { error: '世界観の取得に失敗しました' },
      { status: 500 }
    );
  }
}
