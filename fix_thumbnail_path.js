const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

console.log('=== サムネイルパスを修正中 ===');

// 現在のデータを確認
const currentData = db.prepare('SELECT id, title, thumbnail FROM music_videos').all();
console.log('修正前:');
currentData.forEach(row => {
  console.log(`ID: ${row.id}, Title: ${row.title}, Thumbnail: ${row.thumbnail}`);
});

// thumbnail フィールドを修正（完全パスからファイル名のみに変更）
const updateStmt = db.prepare('UPDATE music_videos SET thumbnail = ? WHERE id = ?');

currentData.forEach(row => {
  if (row.thumbnail && row.thumbnail.startsWith('/images/music-videos/')) {
    // パスからファイル名部分のみを抽出
    const filename = row.thumbnail.replace('/images/music-videos/', '');
    updateStmt.run(filename, row.id);
    console.log(`ID ${row.id}: ${row.thumbnail} → ${filename}`);
  }
});

// 修正後のデータを確認
const updatedData = db.prepare('SELECT id, title, thumbnail FROM music_videos').all();
console.log('\n修正後:');
updatedData.forEach(row => {
  console.log(`ID: ${row.id}, Title: ${row.title}, Thumbnail: ${row.thumbnail}`);
});

db.close();
console.log('サムネイルパスの修正が完了しました。');
