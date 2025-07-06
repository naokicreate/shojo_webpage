import { NextResponse } from 'next/server';
import { newsQueries } from '@/lib/database';

export async function GET() {
  try {
    const news = newsQueries.getLatest(3);
    return NextResponse.json(news);
  } catch (error) {
    console.error('最新ニュース取得エラー:', error);
    return NextResponse.json(
      { error: '最新ニュースの取得に失敗しました' },
      { status: 500 }
    );
  }
}
