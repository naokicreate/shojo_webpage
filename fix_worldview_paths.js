const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

console.log('=== Worldviewサムネイルパスを修正中 ===');

// 現在のデータを確認
const currentData = db.prepare('SELECT id, name, mainImage FROM worldview').all();
console.log('修正前:');
currentData.forEach(row => {
  console.log(`ID: ${row.id}, Name: ${row.name}, MainImage: ${row.mainImage}`);
});

// mainImage フィールドを修正（完全パスからファイル名のみに変更）
const updateStmt = db.prepare('UPDATE worldview SET mainImage = ? WHERE id = ?');

currentData.forEach(row => {
  if (row.mainImage && row.mainImage.startsWith('/images/worldview/')) {
    // パスからファイル名部分のみを抽出
    const filename = row.mainImage.replace('/images/worldview/', '');
    updateStmt.run(filename, row.id);
    console.log(`ID ${row.id}: ${row.mainImage} → ${filename}`);
  }
});

// 修正後のデータを確認
const updatedData = db.prepare('SELECT id, name, mainImage FROM worldview').all();
console.log('\n修正後:');
updatedData.forEach(row => {
  console.log(`ID: ${row.id}, Name: ${row.name}, MainImage: ${row.mainImage}`);
});

db.close();
console.log('Worldviewサムネイルパスの修正が完了しました。');
