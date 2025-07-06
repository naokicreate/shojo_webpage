import { NextResponse } from 'next/server';
import { newsQueries } from '@/lib/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const news = newsQueries.getById(id);
    
    if (!news) {
      return NextResponse.json(
        { error: 'ニュースが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('ニュース詳細取得エラー:', error);
    return NextResponse.json(
      { error: 'ニュース詳細の取得に失敗しました' },
      { status: 500 }
    );
  }
}
