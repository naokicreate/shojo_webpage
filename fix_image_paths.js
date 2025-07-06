const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

console.log('=== 画像パスを修正中 ===');

// キャラクター画像パスの修正
const updateCharacterImage = db.prepare('UPDATE characters SET image = ? WHERE id = ?');
updateCharacterImage.run('chara_yuka_001.png', 1);

console.log('キャラクター画像パスを修正しました');

// 確認
const characters = db.prepare('SELECT id, characterId, name, image FROM characters').all();
characters.forEach(char => {
  console.log(`ID: ${char.id}, CharacterID: ${char.characterId}, Name: ${char.name}, Image: ${char.image}`);
});

db.close();
console.log('修正完了！');
