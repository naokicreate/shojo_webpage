import { NextResponse } from 'next/server';
import { newsQueries } from '@/lib/database';

export async function GET() {
  try {
    const news = newsQueries.getAll();
    return NextResponse.json(news);
  } catch (error) {
    console.error('ニュース取得エラー:', error);
    return NextResponse.json(
      { error: 'ニュースの取得に失敗しました' },
      { status: 500 }
    );
  }
}
