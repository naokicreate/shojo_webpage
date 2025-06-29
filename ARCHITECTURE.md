# プロジェクト構造ドキュメント

## 📱 **アーキテクチャ: SPA (Single Page Application)**

このプロジェクトはSPAスタイルで構築されており、すべてのコンテンツが単一のHTMLファイル内で管理されています。

## 📁 **ファイル構造**

```text
shojo_webpage/
├── index.html              # メインHTMLファイル（全コンテンツ含む）
├── css/
│   └── styles.css          # スタイルシート
├── js/
│   └── script.js           # アプリケーションロジック
├── data/
│   ├── news.json           # ニュースデータ
│   ├── aegis_gallery.json  # AEGISギャラリーデータ
│   ├── gehenna_gallery.json # GEHENNAギャラリーデータ
│   └── header_images.json  # ヘッダー画像データ
├── img/                    # 画像ファイル
└── main_header/           # ヘッダー関連ファイル
```

## 🎯 **SPAの動作原理**

### **コンテンツ管理**

- すべてのページコンテンツは `index.html` 内の `<div>` セクションとして存在
- JavaScript の `showContent()` 関数でコンテンツの表示/非表示を制御

### **ページセクション**

```html
<!-- メインページ -->
<div id="content-news">        <!-- ニュースページ -->
<div id="content-worldview">   <!-- 世界観ページ -->
<div id="content-characters">  <!-- キャラクターページ -->
<div id="content-aegis">       <!-- AEGISページ -->
<div id="content-gehenna">     <!-- GEHENNAページ -->
```

### **ナビゲーション**

- タブボタン: ニュース、世界観、キャラクター
- 詳細ボタン: AEGIS詳細、GEHENNA詳細、戻るボタン

## 🔧 **JavaScript クラス構造**

### **ProjectGenesisApp クラス**

- `initElements()`: DOM要素の初期化
- `initEventListeners()`: イベントリスナーの設定
- `showContent()`: コンテンツ表示制御
- `setActiveTab()`: アクティブタブの設定
- `initGallerySystem()`: ギャラリーシステムの初期化

### **主要機能**

1. **ニュースシステム**: JSON読み込み、動的レンダリング
2. **ギャラリーシステム**: モーダル表示、JSON管理
3. **ヘッダースライドショー**: 背景画像の自動切り替え
4. **レスポンシブデザイン**: モバイル対応

## 🎨 **デザインシステム**

### **カラーテーマ**

- **AEGIS**: Cyan/Blue (ロジック派)
- **GEHENNA**: Pink/Magenta (感情派)
- **ベース**: Dark theme (グレー系)

### **CSS特徴**

- Tailwind CSS ベース
- Glassmorphism エフェクト
- カスタムアニメーション
- レスポンシブグリッド

## ⚡ **パフォーマンス最適化**

### **画像最適化**

- 遅延読み込み (lazy loading)
- フォールバック画像
- WebP対応

### **JavaScript最適化**

- イベント委譲 (Event Delegation)
- ページ非表示時の処理停止
- モーダル最適化

## 🚀 **デプロイメント**

### **GitHub Pages対応**

- 相対パス使用
- 静的ファイル最適化
- SEO対応メタタグ

### **開発ワークフロー**

1. ローカル開発
2. ブランチプッシュ
3. GitHub Pages自動デプロイ

## 📝 **更新ガイド**

### **コンテンツ追加**

1. `index.html` に新しい `<div id="content-xxx">` セクション追加
2. `js/script.js` でナビゲーション処理追加
3. 必要に応じて `css/styles.css` でスタイル追加

### **ギャラリー追加**

1. `data/` フォルダにJSONファイル作成
2. `js/script.js` でギャラリー初期化関数追加
3. HTMLにギャラリーコンテナ追加

## 🔍 **トラブルシューティング**

### **よくある問題**

- **画像が表示されない**: パスを相対パスに変更
- **モーダルが閉じない**: イベントリスナーの重複確認
- **レスポンシブが効かない**: Tailwind CSS クラス確認

### **デバッグ方法**

- ブラウザ開発者ツール使用
- コンソールログ確認
- ネットワークタブでリソース読み込み確認
