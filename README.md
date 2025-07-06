# 終焉リリック (Shuuen Lyric) - 公式ウェブサイト

終焉に向かう近未来の世界で紡がれる、少女たちの記録を描くプロジェクトの公式ウェブサイトです。

## 🚀 技術スタック

- **フロントエンド**: Next.js 15 (React) with TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **UI コンポーネント**: Radix UI
- **データベース**: SQLite (better-sqlite3)
- **ホスティング**: Vercel (推奨)

## 🖼️ 画像ファイルの配置

すべての画像は `public/images/` 以下に配置してください：

```
public/
├── images/
│   ├── characters/          # キャラクター画像
│   │   ├── [character_id].jpg/png
│   │   └── profiles/        # プロフィール用画像
│   ├── music-videos/        # 楽曲・MV関連画像
│   │   ├── [mv_id].jpg/png
│   │   └── thumbnails/      # サムネイル画像
│   ├── worldview/          # 世界観関連画像
│   │   ├── areas/          # エリア画像
│   │   └── concepts/       # コンセプト画像
│   └── common/             # 共通画像（ロゴなど）
```

### 画像命名規則
- **キャラクター画像**: `[character_id].jpg` (例: `aria.jpg`, `luna.jpg`)
- **楽曲画像**: `[music_video_id].jpg` (例: `last-song.jpg`)
- **世界観画像**: `[area_name].jpg` (例: `tokyo-ruins.jpg`)

### 使用方法
```jsx
import Image from 'next/image'

// キャラクター画像の例
<Image 
  src="/images/characters/aria.jpg" 
  alt="アリア" 
  width={400} 
  height={400} 
/>
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   ├── news/              # ニュースページ
│   │   ├── page.tsx       # ニュース一覧
│   │   └── [id]/          # ニュース詳細
│   ├── music-video/       # MVページ (TODO)
│   ├── character/         # キャラクターページ (TODO)
│   └── worldview/         # 世界観ページ (TODO)
├── components/
│   ├── ui/                # 共通UIコンポーネント
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── accordion.tsx
│   │   └── tabs.tsx
│   └── layout/            # レイアウトコンポーネント
│       ├── header.tsx
│       └── footer.tsx
└── lib/
    ├── microcms.ts        # microCMS API設定
    └── utils.ts           # ユーティリティ関数
```

## 🛠️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の値を設定してください：

```env
# microCMS API settings
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# App settings
NEXT_PUBLIC_SITE_NAME="終焉リリック (Shuuen Lyric)"
NEXT_PUBLIC_SITE_URL=https://shuuen-lyric.vercel.app
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてサイトを確認できます。

## 📋 microCMS スキーマ設定

以下のAPIエンドポイントをmicroCMSで作成してください：

### 1. news (ニュース)
- `title`: テキストフィールド
- `publishedAt`: 日時
- `body`: リッチエディタ

### 2. music-videos (MV)
- `title`: テキストフィールド
- `publishedAt`: 日時
- `youtubeId`: テキストフィールド
- `thumbnail`: 画像
- `description`: リッチエディタ
- `lyrics`: リッチエディタ
- `tags`: 繰り返しフィールド > テキストフィールド

### 3. characters (キャラクター)
- `characterId`: テキストフィールド
- `name`: テキストフィールド
- `unitName`: テキストフィールド
- `image`: 画像
- `profile`: リッチエディタ
- `table`: 繰り返しフィールド
  - `label`: テキスト
  - `value`: テキスト
- `correlationDiagram`: 画像

### 4. worldview (世界観)
- `name`: テキストフィールド
- `description`: リッチエディタ
- `mainImage`: 画像
- `keywords`: 繰り返しフィールド
  - `term`: テキスト
  - `definition`: テキスト

## 🚀 デプロイ

### Vercelへのデプロイ

1. Vercelアカウントを作成
2. GitHubリポジトリを連携
3. 環境変数を設定
4. 自動デプロイが開始されます

### 環境変数設定（Vercel）

Vercelダッシュボードで以下の環境変数を設定：

- `MICROCMS_SERVICE_DOMAIN`
- `MICROCMS_API_KEY`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_URL`

## 🎨 デザインテーマ

- **色彩**: ダーク基調（黒、グレー、青、紫）
- **コンセプト**: 近未来的、クール、儚さと力強さの共存
- **レスポンシブ**: モバイルファーストデザイン
- **アニメーション**: スムーズなフェードイン・スライドアニメーション

## 📱 ページ構成

- `/` - トップページ
- `/news` - ニュース一覧
- `/news/[id]` - ニュース詳細
- `/music-video` - MV一覧 (TODO)
- `/music-video/[id]` - MV詳細 (TODO)
- `/character` - キャラクター一覧 (TODO)
- `/character/[id]` - キャラクター詳細 (TODO)
- `/worldview` - 世界観紹介 (TODO)

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# リント実行
npm run lint
```

## 📝 実装状況

### ✅ 完了済み
- ホームページ (`/`) - 最新情報とプロジェクト概要
- ニュースページ (`/news`, `/news/[id]`) - 一覧・詳細
- 楽曲・MVページ (`/music-videos`, `/music-videos/[id]`) - 一覧・詳細
- キャラクターページ (`/characters`, `/characters/[id]`) - 一覧・詳細  
- 世界観ページ (`/worldview`) - タブ式エリア紹介・用語集
- SQLiteデータベース統合
- APIエンドポイント実装
- レスポンシブデザイン
- ダークテーマ

### 🔄 改善予定
- SEO最適化（メタタグ、構造化データ）
- OGP画像設定
- 画像最適化
- パフォーマンス向上
- アクセシビリティ対応
- エラーハンドリング強化

## 📄 ライセンス

© 2024 終焉リリック (Shuuen Lyric). All rights reserved.
