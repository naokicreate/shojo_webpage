# PROJECT: GENESIS - ウェブサイト

このプロジェクトは、PROJECT: GENESISの世界観とキャラクター設定を紹介するウェブサイトです。

## ファイル構造

```
shojo_webpage/
├── index.html              # メインHTMLファイル
├── chara_yuka_001.png      # キャラクター画像
├── css/
│   └── styles.css          # スタイルシート
├── js/
│   ├── script.js           # メインアプリケーションロジック
│   └── pageLoader.js       # ページコンテンツローダー
├── pages/
│   ├── worldview.html      # 世界観ページのコンテンツ
│   ├── characters.html     # キャラクターページのコンテンツ
│   ├── aegis.html          # AEGIS詳細ページのコンテンツ
│   └── gehenna.html        # GEHENNA詳細ページのコンテンツ
└── README.md               # このファイル
```

## ファイルの役割

### HTML ファイル
- **index.html**: メインのHTMLページ。基本構造とナビゲーションを含む
- **pages/*.html**: 各ページの個別コンテンツ。動的に読み込まれる

### CSS ファイル
- **css/styles.css**: 全体のスタイリング、フォント、カラーテーマ、アニメーション

### JavaScript ファイル
- **js/script.js**: メインアプリケーションロジック。ページ切り替え、イベント処理
- **js/pageLoader.js**: ページコンテンツの動的読み込み機能

## 技術仕様

- **フレームワーク**: Tailwind CSS
- **フォント**: Google Fonts (Noto Sans JP, Orbitron)
- **アーキテクチャ**: SPA (Single Page Application)
- **ページローディング**: 動的コンテンツ読み込み (Fetch API)

## 使用方法

1. Webサーバー上にファイルを配置
2. `index.html`をブラウザで開く
3. ナビゲーションでページを切り替える

## 開発者向け情報

### 新しいページの追加方法
1. `pages/` ディレクトリに新しいHTMLファイルを作成
2. `js/script.js` の `initEventListeners()` にイベントリスナーを追加
3. 必要に応じて `index.html` にナビゲーションボタンを追加

### スタイルの変更
- `css/styles.css` でグローバルスタイルを管理
- Tailwind CSSクラスでインラインスタイリング

## ブラウザサポート
- Chrome (推奨)
- Firefox
- Safari
- Edge

## ライセンス
© PROJECT: GENESIS Committee
