# 終焉リリック (Shuuen Lyric) - 公式ウェブサイト

終焉に向かう近未来の世界で紡がれる、少女たちの記録を描くプロジェクトの公式ウェブサイトです。

## 🚀 技術スタック

- **フロントエンド**: Next.js 15 (React) with TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **UI コンポーネント**: Radix UI + shadcn/ui
- **データベース**: SQLite (better-sqlite3)
- **音楽再生**: HTML5 Audio API
- **ホスティング**: Vercel (推奨) / GitHub Pages

## 🖼️ 画像ファイルの配置

すべての画像は `public/images/` 以下に配置してください：

```text
public/
├── images/
│   ├── characters/          # キャラクター画像
│   │   └── chara_yuka_001.png
│   ├── music-videos/        # 楽曲・MV関連画像
│   │   └── god.png
│   ├── worldview/          # 世界観関連画像
│   │   └── AEGIS/          # AEGISエリア画像
│   │       ├── worldview_001.png
│   │       └── worldview_002.png
│   ├── headers/            # ヘッダー背景画像
│   └── common/             # 共通画像（ロゴなど）
├── audio/                  # 音楽ファイル
│   └── shuuen_no_josho.mp3
```

### 画像命名規則

- **キャラクター画像**: `chara_[name]_[number].png` (例: `chara_yuka_001.png`)
- **楽曲画像**: ファイル名のみ (例: `god.png`)
- **世界観画像**: `[area]/[name].png` (例: `AEGIS/worldview_001.png`)
- **ヘッダー画像**: フェード表示用背景画像

### データベース内での画像パス設定

データベースにはファイル名のみを保存し、コードで適切なパスを構築します：

```typescript
// データベース: thumbnail = "god.png"
// 表示時: src="/images/music-videos/god.png"
<Image src={`/images/music-videos/${mv.thumbnail}`} alt={mv.title} />
```

### 使用方法

```jsx
import Image from 'next/image'

// キャラクター画像の例
<Image 
  src="/images/characters/chara_yuka_001.png" 
  alt="ユカ" 
  width={400} 
  height={400} 
/>
```

## 📁 プロジェクト構造

```text
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ（ヘッダー画像スライダー付き）
│   ├── globals.css        # グローバルスタイル
│   ├── api/               # API Routes
│   │   ├── characters/    # キャラクター関連API
│   │   ├── music-videos/  # 楽曲関連API
│   │   ├── news/          # ニュース関連API
│   │   ├── worldview/     # 世界観関連API
│   │   └── header-images/ # ヘッダー画像API
│   ├── news/              # ニュースページ
│   │   ├── page.tsx       # ニュース一覧
│   │   └── [id]/          # ニュース詳細
│   ├── music-videos/      # 楽曲・MVページ
│   │   ├── page.tsx       # 楽曲一覧（音楽再生機能付き）
│   │   └── [id]/          # 楽曲詳細（フル音楽プレイヤー付き）
│   ├── characters/        # キャラクターページ
│   │   ├── page.tsx       # キャラクター一覧
│   │   └── [id]/          # キャラクター詳細
│   └── worldview/         # 世界観ページ
│       └── page.tsx       # タブ式エリア紹介・用語集
├── components/
│   ├── ui/                # 共通UIコンポーネント
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── accordion.tsx
│   │   ├── tabs.tsx
│   │   ├── audio-player.tsx      # フル音楽プレイヤー
│   │   └── mini-audio-player.tsx # 簡易音楽プレイヤー
│   └── layout/            # レイアウトコンポーネント
│       ├── header.tsx
│       ├── footer.tsx
│       └── header-image-slider.tsx # ヘッダー背景画像スライダー
└── lib/
    ├── database.ts        # SQLiteデータベース設定・クエリ
    └── utils.ts           # ユーティリティ関数
```

## 🛠️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. データベースの初期化

SQLiteデータベースを初期化します：

```bash
# 必要に応じてデータベースファイルを作成
node -e "const db = require('better-sqlite3')('./database.sqlite'); console.log('Database created');"
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてサイトを確認できます。

## �️ データベース構造

現在のプロジェクトではSQLiteを使用しており、以下のテーブル構造になっています：

### データベーステーブル

- **news**: ニュース記事
  - id, title, publishedAt, body
- **music_videos**: 楽曲・MV情報
  - id, title, publishedAt, youtubeId, thumbnail, description, lyrics, tags, audioPath
- **characters**: キャラクター情報
  - id, characterId, name, unitName, image, profile, profileTable, correlationDiagram
- **worldview**: 世界観・エリア情報
  - id, name, description, mainImage, keywords
- **header_images**: ヘッダー背景画像
  - id, imagePath, displayDuration, fileFormat

### サンプルデータ

データベースには以下のサンプルデータが含まれています：

- **楽曲**: 「終焉への序章」（god.png、MP3付き）
- **キャラクター**: ユノ、アリサ
- **世界観**: ロジック派、感情派、廃墟エリア
- **ヘッダー画像**: フェード表示用背景画像

## 📋 データベーススキーマ（旧microCMS参考）

以下は旧microCMS時代のスキーマです（現在はSQLite使用）：

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
- `audioPath`: 音楽ファイルパス

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

### Vercelへのデプロイ（推奨）

1. Vercelアカウントを作成
2. GitHubリポジトリを連携
3. 自動デプロイが開始されます

### GitHub Pagesへのデプロイ

GitHub Pagesで静的サイトとして公開する手順：

#### 1. Next.js設定の変更

`next.config.ts`を以下のように設定：

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/shojo_webpage' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shojo_webpage/' : '',
}

module.exports = nextConfig
```

#### 2. GitHub Actionsワークフローの設定

`.github/workflows/deploy.yml`を作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ react_base ]
  pull_request:
    branches: [ react_base ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/react_base'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

#### 3. GitHubリポジトリの設定

1. GitHubリポジトリの `Settings` > `Pages` に移動
2. Source を `GitHub Actions` に設定
3. `react_base` ブランチにプッシュすると自動デプロイが開始されます

#### 4. アクセスURL

デプロイ後、以下のURLでアクセス可能：
```
https://[username].github.io/shojo_webpage/
```

### 注意事項（GitHub Pages）

- GitHub Pagesは静的サイトのみ対応（API Routesは使用不可）
- データベース機能は動作しないため、静的データに変更が必要
- 音楽再生機能などのクライアントサイド機能は動作します

## 🎵 音楽再生機能

### 対応フォーマット
- **音楽ファイル**: MP3
- **配置場所**: `public/audio/`
- **データベース設定**: `music_videos.audioPath`

### 音楽プレイヤーコンポーネント

1. **AudioPlayer**: フル機能プレイヤー（詳細ページ用）
   - 再生/停止、シークバー、音量調整
   - 再生時間表示、プログレスバー

2. **MiniAudioPlayer**: 簡易プレイヤー（カード用）
   - 再生/停止ボタンのみ
   - ホバー時に表示

### 使用例

```typescript
// Music Videoカードでの使用
<MiniAudioPlayer 
  audioPath="/audio/shuuen_no_josho.mp3" 
  className="transform scale-110"
/>

// 詳細ページでの使用
<AudioPlayer 
  audioPath="/audio/shuuen_no_josho.mp3" 
  title="終焉への序章"
/>
```

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
- ヘッダー背景画像スライダー（フェード切り替え、ダークオーバーレイ）
- ニュースページ (`/news`, `/news/[id]`) - 一覧・詳細
- 楽曲・MVページ (`/music-videos`, `/music-videos/[id]`) - 一覧・詳細
- 音楽再生機能（MP3対応、フル・簡易プレイヤー）
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
- GitHub Pages対応（静的サイト化）

## ✨ 主要機能

### 🎨 ヘッダー画像スライダー
- データベース管理による動的画像切り替え
- フェードアニメーション（Framer Motion）
- 表示時間の個別設定
- ダークグラデーションオーバーレイ

### 🎵 音楽再生システム
- HTML5 Audio API使用
- 楽曲カードホバー時の簡易プレイヤー
- 詳細ページのフル機能プレイヤー
- 再生/停止、シーク、音量調整

### 🗄️ データベース統合
- SQLiteによる高速データ管理
- APIルートによるRESTful設計
- 画像パスの一元管理
- サンプルデータ完備

### 📱 レスポンシブデザイン
- モバイルファーストアプローチ
- タブレット・デスクトップ対応
- Touch UI最適化

## � 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド（Vercel用）
npm run build

# GitHub Pages用ビルド
npm run build:github

# プロダクションサーバー起動
npm run start

# リント実行
npm run lint
```

## 📖 更新履歴

### v2.0.0 (2025年7月)
- SQLiteデータベース統合
- 音楽再生機能追加（MP3対応）
- ヘッダー画像スライダー実装
- GitHub Pages対応
- 全ページ実装完了

### v1.0.0 (2024年)
- 初期リリース
- microCMS連携
- 基本ページ構成

## �📄 ライセンス

© 2024-2025 終焉リリック (Shuuen Lyric). All rights reserved.

---

**🎵 終焉に向かう世界で響く、少女たちの最後の歌声**
