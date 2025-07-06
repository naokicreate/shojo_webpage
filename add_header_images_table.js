const Database = require('better-sqlite3');
const path = require('path');

// データベースファイルのパス
const dbPath = path.join(process.cwd(), 'database.sqlite');

// データベース接続
const db = new Database(dbPath);

try {
  console.log('ヘッダー画像テーブルを追加中...');

  // ヘッダー画像テーブルを作成
  db.exec(`
    CREATE TABLE IF NOT EXISTS header_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagePath TEXT NOT NULL,
      imageType TEXT NOT NULL CHECK(imageType IN ('png', 'jpg', 'webp')),
      displayDuration INTEGER NOT NULL DEFAULT 5,
      isActive BOOLEAN NOT NULL DEFAULT 1,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // サンプルデータを挿入
  const insertHeaderImage = db.prepare(`
    INSERT INTO header_images (imagePath, imageType, displayDuration, isActive, sortOrder) VALUES (?, ?, ?, ?, ?)
  `);

  const headerImageData = [
    {
      imagePath: '/images/headers/header_01.png',
      imageType: 'png',
      displayDuration: 8,
      isActive: 1,
      sortOrder: 1
    },
    {
      imagePath: '/images/headers/header_02.jpg',
      imageType: 'jpg',
      displayDuration: 6,
      isActive: 1,
      sortOrder: 2
    },
    {
      imagePath: '/images/headers/header_animation.webp',
      imageType: 'webp',
      displayDuration: 0, // WEBPアニメーションはアニメーション再生時間に依存
      isActive: 1,
      sortOrder: 3
    }
  ];

  // 既存のデータを確認
  const existingCount = db.prepare('SELECT COUNT(*) as count FROM header_images').get().count;
  
  if (existingCount === 0) {
    headerImageData.forEach(headerImage => {
      insertHeaderImage.run(
        headerImage.imagePath,
        headerImage.imageType,
        headerImage.displayDuration,
        headerImage.isActive,
        headerImage.sortOrder
      );
    });
    console.log('ヘッダー画像のサンプルデータを挿入しました');
  } else {
    console.log('ヘッダー画像データは既に存在します');
  }

  // 結果を確認
  const headerImages = db.prepare('SELECT * FROM header_images ORDER BY sortOrder').all();
  console.log('\n=== Header Images Table ===');
  headerImages.forEach(image => {
    console.log(`ID: ${image.id}, Path: ${image.imagePath}, Type: ${image.imageType}, Duration: ${image.displayDuration}s, Active: ${image.isActive}, Order: ${image.sortOrder}`);
  });

  console.log('\nヘッダー画像テーブルの追加が完了しました！');

} catch (error) {
  console.error('マイグレーション中にエラーが発生しました:', error);
} finally {
  db.close();
}
