import { NextResponse } from 'next/server';
import { characterQueries } from '@/lib/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const character = characterQueries.getById(id);
    
    if (!character) {
      return NextResponse.json(
        { error: 'キャラクターが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(character);
  } catch (error) {
    console.error('キャラクター詳細取得エラー:', error);
    return NextResponse.json(
      { error: 'キャラクター詳細の取得に失敗しました' },
      { status: 500 }
    );
  }
}
