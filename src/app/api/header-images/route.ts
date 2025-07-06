import { NextResponse } from 'next/server';
import { headerImageQueries } from '@/lib/database';

export async function GET() {
  try {
    const headerImages = headerImageQueries.getActive();
    return NextResponse.json(headerImages);
  } catch (error) {
    console.error('ヘッダー画像の取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'ヘッダー画像の取得に失敗しました' },
      { status: 500 }
    );
  }
}
