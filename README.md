# PROJECT: GENESIS - ウェブサイト

このプロジェクトは、PROJECT: GENESISの世界観とキャラクター設定を紹介するSPA（Single Page Application）ウェブサイトです。

## 📁 **ファイル構造**

```text
shojo_webpage/
├── index.html              # メインHTMLファイル（全コンテンツ統合）
├── ARCHITECTURE.md         # プロジェクト構造詳細ドキュメント
├── css/
│   └── styles.css          # メインスタイルシート
├── js/
│   ├── script.js           # メインアプリケーションロジック
│   └── pageLoader.js       # ページローダー（未使用・旧機能）
├── data/
│   ├── news.json           # ニュースデータ
│   ├── characters.json     # キャラクターデータ（動的生成対応）
│   ├── aegis_gallery.json  # AEGISギャラリーデータ
│   ├── gehenna_gallery.json # GEHENNAギャラリーデータ
│   └── header_images.json  # ヘッダー背景画像データ
├── img/
│   ├── AEGIS/              # AEGIS関連画像
│   ├── GEHENNA/            # GEHENNA関連画像
│   └── characters/         # キャラクター画像
├── main_header/            # ヘッダー関連ファイル
└── README.md               # このファイル
```

## 🏗️ **アーキテクチャ概要**

```mermaid
graph TB
    A[index.html] --> B[ProjectGenesisApp Class]
    B --> C[DOM管理]
    B --> D[イベント管理]
    B --> E[コンテンツ切り替え]
    B --> F[ギャラリーシステム]
    B --> P[キャラクターシステム]
    
    C --> G[5つのコンテンツセクション]
    G --> H[content-news]
    G --> I[content-worldview]
    G --> J[content-characters]
    G --> K[content-aegis]
    G --> L[content-gehenna]
    
    F --> M[JSON読み込み]
    M --> N[data/aegis_gallery.json]
    M --> O[data/gehenna_gallery.json]
    
    P --> Q[動的キャラクター生成]
    Q --> R[data/characters.json]
    
    E --> S[ヘッダースライドショー]
    S --> T[data/header_images.json]
    
    D --> U[ニュースシステム]
    U --> V[data/news.json]
```

## 🔧 **データフロー図**

```mermaid
sequenceDiagram
    participant U as User
    participant A as ProjectGenesisApp
    participant D as JSON Data
    participant M as Modal System
    
    U->>A: ページクリック
    A->>A: showContent()
    A->>A: setActiveTab()
    
    U->>A: ギャラリー画像クリック
    A->>D: データ読み込み
    D-->>A: 画像・説明データ
    A->>M: openGalleryModal()
    M-->>U: モーダル表示
    
    U->>M: ✖ボタンクリック
    M->>A: closeGalleryModal()
    A-->>U: モーダル非表示
```

## 💾 **データ構造と設定項目詳細**

### **JSONファイル形式**

#### **characters.json - キャラクターデータ**

```json
{
  "characters": [
    {
      "id": "character_unique_id",           // 必須: ユニークID
      "name": "キャラクター名",                // 必須: 表示名
      "nameEn": "Character Name (Unit)",     // 必須: 英語名・サブタイトル
      "image": "img/characters/image.png",   // 必須: キャラクター画像パス
      "fallbackImage": "fallback_url",       // 必須: エラー時の代替画像
      "faction": "AEGIS|GEHENNA",            // 必須: 所属陣営
      "layout": "normal|reverse",            // 必須: レイアウト（normal=画像左/reverse=画像右）
      "description": "説明文（HTMLタグ対応）", // 必須: キャラクター説明
      "details": {                           // 必須: 詳細情報オブジェクト
        "age": "年齢",                       // 任意のキー名で情報追加可能
        "affiliation": "所属",
        "characteristic": "特徴",
        "ability": "能力",
        "relationship": "関係性"             // 追加したいキーは自由に設定
      },
      "themeColor": "cyan|pink|blue|red"     // 必須: テーマカラー（CSS適用）
    }
  ]
}
```

**設定可能項目：**

- **layout**: `normal`（画像左・情報右）、`reverse`（情報左・画像右）
- **themeColor**: CSSで定義されたカラーテーマ（cyan, pink, blue, red等）
- **details**: 任意のキー名で詳細情報を追加可能。自動的に日本語ラベルが適用される

#### **news.json - ニュースデータ**

```json
{
  "news": [
    {
      "id": "news_unique_id",                // 必須: ユニークID
      "title": "ニュースタイトル",             // 必須: タイトル
      "description": "説明文",                // 必須: 説明
      "image": "画像パス",                    // 必須: サムネイル画像
      "date": "YYYY.MM.DD",                  // 必須: 日付（表示形式）
      "link": {                              // 任意: リンク設定
        "type": "internal|external",         // 必須（link設定時）: リンクタイプ
        "url": "リンクURL",                  // 必須（link設定時）: URL
        "target": "ターゲット名|_blank"       // 必須（link設定時）: ターゲット
      }
    }
  ]
}
```

**設定可能項目：**

- **link.type**: `internal`（サイト内ページ）、`external`（外部サイト）
- **link.target**: internal時は`worldview`、`characters`、`aegis`、`gehenna`。external時は`_blank`
- **link**: 省略可能。設定しない場合はクリック不可のニュース項目になる

#### **ギャラリーJSON - aegis_gallery.json / gehenna_gallery.json**

```json
{
  "gallery": [
    {
      "id": "gallery_unique_id",             // 必須: ユニークID
      "imagePath": "img/folder/image.png",   // 必須: 画像パス
      "title": "画像タイトル",                // 必須: タイトル
      "description": "詳細説明文",            // 必須: 説明（モーダル表示）
      "category": "カテゴリ名"                // 必須: カテゴリ分類
    }
  ]
}
```

**設定可能項目：**

- **category**: 任意の文字列。現在使用中: `cityscape`（都市景観）、`facility`（施設）、`cultural`（文化）、`commerce`（商業）、`military`（軍事）等
- **imagePath**: 相対パスまたは絶対URL対応
- **description**: HTMLタグ使用可能

#### **header_images.json - ヘッダー画像データ**

```json
{
  "headerImages": [                          // 必須: 画像配列
    {
      "path": "img/headers/image.png",       // 必須: 画像パス
      "duration": 5000,                      // 必須: 表示時間（ミリ秒）
      "type": "png|jpg|webp"                 // 必須: ファイル形式
    }
  ],
  "settings": {                              // 必須: 設定オブジェクト
    "fadeTransitionDuration": 1000,          // 必須: フェード時間（ミリ秒）
    "enableAutoplay": true,                  // 必須: 自動再生設定
    "pauseOnHover": false                    // 必須: ホバー時一時停止
  }
}
```

**設定可能項目：**

- **duration**: 各画像の表示時間（ミリ秒単位）
- **fadeTransitionDuration**: 画像切り替え時のフェード時間
- **enableAutoplay**: `true`で自動スライドショー、`false`で停止
- **pauseOnHover**: `true`でマウスホバー時に一時停止

## 🎯 **主要機能**

### **SPA コンテンツ管理**

- `showContent()`: コンテンツセクションの表示/非表示制御
- `setActiveTab()`: ナビゲーションタブのアクティブ状態管理

### **キャラクターシステム**

- JSONベースの動的キャラクター生成
- レイアウト設定（normal/reverse）対応
- テーマカラー自動適用
- 詳細情報の自動整形

### **ギャラリーシステム**

- JSONベースの動的コンテンツ読み込み
- モーダル表示による詳細表示
- 左画像・右説明のレイアウト

### **ニュースシステム**

- 動的ニュース読み込み
- 内部/外部リンク対応
- エラーハンドリング

### **ヘッダースライドショー**

- 背景画像の自動切り替え
- フェードトランジション
- パフォーマンス最適化

## 🛠️ **保守・メンテナンス**

### **コンテンツ更新手順**

#### **1. ニュース追加**

```bash
# 1. data/news.json を編集
# 2. 新しいニュースオブジェクトを配列に追加
# 3. 画像があれば img/ フォルダに配置
```

#### **3. キャラクター追加**

```bash
# 1. キャラクター画像を img/characters/ フォルダに配置
# 2. data/characters.json を編集
# 3. 新しいキャラクターオブジェクトを配列に追加
# 4. layout（normal/reverse）とthemeColorを設定
```

#### **4. ギャラリー画像追加**

```bash
# 1. 画像を適切なフォルダに配置
#    - AEGIS: img/AEGIS/
#    - GEHENNA: img/GEHENNA/
# 2. 対応するJSONファイルを更新
#    - data/aegis_gallery.json
#    - data/gehenna_gallery.json
# 3. IDは一意になるように設定
```

#### **5. ヘッダー画像更新**

```bash
# 1. 新しい画像を img/ フォルダに配置
# 2. data/header_images.json を更新
# 3. durationで表示時間を調整（ミリ秒）
```

### **ファイル関係図**

```mermaid
graph LR
    A[index.html] --> B[js/script.js]
    A --> C[css/styles.css]
    
    B --> D[data/news.json]
    B --> E[data/aegis_gallery.json]
    B --> F[data/gehenna_gallery.json]
    B --> G[data/characters.json]
    B --> H[data/header_images.json]
    
    D --> I[img/news/]
    E --> J[img/AEGIS/]
    F --> K[img/GEHENNA/]
    G --> L[img/characters/]
    H --> M[img/headers/]
    C --> L[data/header_images.json]
    L --> M[img/headers/]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#fff3e0
```

### **開発・デバッグ**

#### **よくあるエラーと対処法**

| エラー | 原因 | 対処法 |
|--------|------|--------|
| 画像が表示されない | パスの不一致 | 相対パスを確認 |
| ギャラリーモーダルが開かない | JavaScript エラー | ブラウザコンソールを確認 |
| キャラクターが表示されない | characters.json エラー | JSON構文を検証 |
| JSONデータが読み込まれない | ファイル形式エラー | JSON構文を検証 |

#### **デバッグコマンド**

```javascript
// ブラウザコンソールで実行
console.log(window.projectGenesisApp); // アプリ状態確認
console.log(window.projectGenesisApp.headerImagesData); // ヘッダー画像データ確認
console.log(window.projectGenesisApp.charactersData); // キャラクターデータ確認
```

### **ブランチ運用**

```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature A"
    commit id: "Feature B"
    checkout main
    merge develop
    commit id: "Release v1.0"
```

## 🚀 **デプロイメント**

### **GitHub Pages 設定**

1. リポジトリ設定で Pages を有効化
2. Source を "Deploy from a branch" に設定
3. Branch を "main" に設定
4. フォルダーを "/ (root)" に設定

**注意事項:**

- GitHub Pagesは静的サイトホスティングのため、サーバーサイドヘッダー設定はできません
- セキュリティヘッダー（X-Content-Type-Options等）はGitHub側で自動設定されます
- 初回デプロイ後、反映に数分かかる場合があります

### **ローカル開発環境**

```bash
# ローカルサーバー起動（Python）
python -m http.server 8000

# または Node.js
npx serve .

# アクセス
http://localhost:8000
```

## 📱 **技術仕様**

- **アーキテクチャ**: SPA (Single Page Application)
- **スタイリング**: Custom CSS（Tailwindライクなユーティリティクラス含む）
- **フォント**: Google Fonts (Noto Sans JP, Orbitron)
- **JavaScript**: Vanilla ES6+ (フレームワークなし)
- **データ形式**: JSON
- **ブラウザサポート**: Chrome, Firefox, Safari, Edge
- **デプロイ**: GitHub Pages対応（静的サイト）
- **パフォーマンス**: 画像lazy loading, ハードウェア加速対応

## 📋 **チェックリスト**

### **リリース前確認**

- [ ] 全画像ファイルが正しいパスに配置されている
- [ ] JSONファイルの構文が正しい（characters.json含む）
- [ ] すべてのリンクが機能する
- [ ] ギャラリーモーダルが正常に動作する
- [ ] キャラクター動的生成が正常に動作する
- [ ] モバイル表示が正しい
- [ ] ブラウザ互換性チェック完了
- [ ] GitHub Pages環境での動作確認完了
- [ ] 画像にlazy loadingが適用されている
- [ ] パフォーマンス最適化が完了している

### **定期メンテナンス**

- [ ] 月1回：画像ファイルサイズ最適化
- [ ] 月1回：JSONデータの整合性確認（characters.json含む）
- [ ] 四半期1回：ブラウザ互換性テスト
- [ ] 半年1回：依存関係更新確認

## 📞 **サポート**

### **問題報告**

- GitHub Issues を使用
- エラーの詳細とスクリーンショットを添付

### **開発者情報**

- **プロジェクト**: PROJECT: GENESIS
- **メンテナー**: PROJECT: GENESIS Committee
- **ライセンス**: © PROJECT: GENESIS Committee

---

## 📚 **関連ドキュメント**

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 詳細な技術仕様
- [GitHub Pages ドキュメント](https://docs.github.com/pages)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
