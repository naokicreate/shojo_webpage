const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

console.log('=== Worldview Table ===');
const rows = db.prepare('SELECT * FROM worldview').all();
rows.forEach(row => {
  console.log(`ID: ${row.id}, Name: ${row.name}, MainImage: ${row.mainImage}`);
});

db.close();
