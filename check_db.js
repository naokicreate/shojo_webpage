const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

console.log('=== Characters Table ===');
const characters = db.prepare('SELECT id, characterId, name, image FROM characters').all();
characters.forEach(char => {
  console.log(`ID: ${char.id}, CharacterID: ${char.characterId}, Name: ${char.name}, Image: ${char.image}`);
});

console.log('\n=== Music Videos Table ===');
const musicVideos = db.prepare('SELECT id, title, thumbnail FROM music_videos').all();
musicVideos.forEach(mv => {
  console.log(`ID: ${mv.id}, Title: ${mv.title}, Thumbnail: ${mv.thumbnail}`);
});

db.close();
