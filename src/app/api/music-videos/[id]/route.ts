import { NextResponse } from 'next/server';
import { musicVideoQueries } from '@/lib/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const musicVideo = musicVideoQueries.getById(id);
    
    if (!musicVideo) {
      return NextResponse.json(
        { error: 'MVが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(musicVideo);
  } catch (error) {
    console.error('MV詳細取得エラー:', error);
    return NextResponse.json(
      { error: 'MV詳細の取得に失敗しました' },
      { status: 500 }
    );
  }
}
