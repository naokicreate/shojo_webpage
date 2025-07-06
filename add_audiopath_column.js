const Database = require('better-sqlite3');
const path = require('path');

// データベースファイルのパス
const dbPath = path.join(process.cwd(), 'database.sqlite');

// データベース接続
const db = new Database(dbPath);

try {
  console.log('music_videosテーブルにaudioPathカラムを追加中...');

  // audioPathカラムを追加
  try {
    db.exec(`ALTER TABLE music_videos ADD COLUMN audioPath TEXT`);
    console.log('audioPathカラムを追加しました');
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('audioPathカラムは既に存在します');
    } else {
      throw error;
    }
  }

  // 既存レコードにaudioPathを追加
  const updateMV = db.prepare(`UPDATE music_videos SET audioPath = ? WHERE id = ?`);
  
  const existingMVs = db.prepare('SELECT id, title FROM music_videos').all();
  existingMVs.forEach(mv => {
    if (mv.title === '終焉への序章') {
      updateMV.run('/audio/shuuen_no_josho.mp3', mv.id);
      console.log(`ID ${mv.id} の「${mv.title}」にaudioPathを設定しました`);
    }
  });

  // 結果を確認
  const mvs = db.prepare('SELECT id, title, audioPath FROM music_videos').all();
  console.log('\n=== Music Videos Table (audioPath) ===');
  mvs.forEach(mv => {
    console.log(`ID: ${mv.id}, Title: ${mv.title}, AudioPath: ${mv.audioPath || 'NULL'}`);
  });

  console.log('\nmusic_videosテーブルの更新が完了しました！');

} catch (error) {
  console.error('マイグレーション中にエラーが発生しました:', error);
} finally {
  db.close();
}
