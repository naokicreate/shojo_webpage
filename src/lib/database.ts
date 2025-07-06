import Database from 'better-sqlite3';
import path from 'path';

// データベースの型定義
interface NewsRow {
  id: number;
  title: string;
  publishedAt: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface MusicVideoRow {
  id: number;
  title: string;
  publishedAt: string;
  youtubeId: string;
  thumbnail: string;
  description: string;
  lyrics: string;
  tags: string; // JSON文字列
  createdAt: string;
  updatedAt: string;
}

interface CharacterRow {
  id: number;
  characterId: string;
  name: string;
  unitName: string;
  image: string;
  profile: string;
  profileTable: string; // JSON文字列
  correlationDiagram: string;
  createdAt: string;
  updatedAt: string;
}

interface WorldviewRow {
  id: number;
  name: string;
  description: string;
  mainImage: string;
  keywords: string; // JSON文字列
  createdAt: string;
  updatedAt: string;
}

interface HeaderImageRow {
  id: number;
  imagePath: string;
  imageType: 'png' | 'jpg' | 'webp'; // 画像フォーマット
  displayDuration: number; // 表示時間（秒）
  isActive: boolean; // アクティブフラグ
  sortOrder: number; // 表示順序
  createdAt: string;
  updatedAt: string;
}

// データベースファイルのパス
const dbPath = path.join(process.cwd(), 'database.sqlite');

// データベース接続
export const db = new Database(dbPath);

// テーブル作成とデータ挿入を行う初期化関数
export function initializeDatabase() {
  // ニューステーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      publishedAt TEXT NOT NULL,
      body TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // MVテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS music_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      publishedAt TEXT NOT NULL,
      youtubeId TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      description TEXT NOT NULL,
      lyrics TEXT NOT NULL,
      tags TEXT NOT NULL, -- JSON文字列として保存
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // キャラクターテーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      characterId TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      unitName TEXT NOT NULL,
      image TEXT NOT NULL,
      profile TEXT NOT NULL,
      profileTable TEXT NOT NULL, -- JSON文字列として保存
      correlationDiagram TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 世界観テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS worldview (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      mainImage TEXT NOT NULL,
      keywords TEXT NOT NULL, -- JSON文字列として保存
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ヘッダー画像テーブル
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

  // サンプルデータの挿入（テーブルが空の場合のみ）
  const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
  if (newsCount.count === 0) {
    insertSampleData();
  }
}

function insertSampleData() {
  // ニュースのサンプルデータ
  const insertNews = db.prepare(`
    INSERT INTO news (title, publishedAt, body) VALUES (?, ?, ?)
  `);

  const newsData = [
    {
      title: '終焉リリック プロジェクト始動！',
      publishedAt: '2024-01-15',
      body: `
        <p>皆様、お待たせいたしました。新プロジェクト「終焉リリック (Shuuen Lyric)」がついに始動いたします！</p>
        
        <h2>プロジェクトについて</h2>
        <p>終焉リリックは、終焉に向かう近未来の世界で紡がれる少女たちの記録を描くプロジェクトです。ダークでクール、そして儚さと力強さが共存する独特な世界観をお楽しみください。</p>
        
        <h2>今後の展開</h2>
        <ul>
          <li>第一弾MV「終焉への序章」近日公開予定</li>
          <li>キャラクター詳細情報の順次公開</li>
          <li>世界観設定資料の公開</li>
        </ul>
        
        <p>どうぞ、終焉リリックの世界をお楽しみください。</p>
      `
    },
    {
      title: '第一弾MV「終焉への序章」公開',
      publishedAt: '2024-01-20',
      body: `
        <p>プロジェクト第一弾となるMV「終焉への序章」を公開いたしました！</p>
        
        <h2>MV概要</h2>
        <p>本作品では、ロジック派のユノと感情派のアリサの運命的な出会いを描いています。対立する二つの派閥に属する少女たちが、どのような絆を紡いでいくのか、ぜひご覧ください。</p>
        
        <h2>制作について</h2>
        <p>このMVは、プロジェクトの世界観を最大限に表現するため、細部にまでこだわって制作されました。近未来的な都市の描写や、キャラクターの心情を表現するカメラワークにも注目してください。</p>
      `
    },
    {
      title: 'キャラクター詳細情報を更新',
      publishedAt: '2024-01-25',
      body: `
        <p>各キャラクターの詳細なプロフィールと背景設定を公開いたしました。</p>
        
        <h2>公開キャラクター</h2>
        <ul>
          <li><strong>ユノ</strong> - ロジック派の戦闘員</li>
          <li><strong>アリサ</strong> - 感情派の戦闘員</li>
        </ul>
        
        <p>それぞれのキャラクターページでは、詳細なプロフィール情報と相関図をご確認いただけます。</p>
      `
    },
    {
      title: '世界観設定資料公開',
      publishedAt: '2024-02-01',
      body: `
        <p>ロジック派と感情派が対立する近未来世界の詳細設定を公開いたしました。</p>
        
        <h2>世界観の特徴</h2>
        <p>終焉リリックの世界は、理性を重視する「ロジック派」と感情を大切にする「感情派」、そして両派閥から見放された「廃墟」の三つのエリアに分かれています。</p>
        
        <p>世界観ページでは、各エリアの詳細な設定やキーワード集をご覧いただけます。</p>
      `
    }
  ];

  newsData.forEach(news => {
    insertNews.run(news.title, news.publishedAt, news.body);
  });

  // MVのサンプルデータ
  const insertMV = db.prepare(`
    INSERT INTO music_videos (title, publishedAt, youtubeId, thumbnail, description, lyrics, tags) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const mvData = [
    {
      title: '終焉への序章',
      publishedAt: '2024-01-20',
      youtubeId: 'dQw4w9WgXcQ', // サンプルYouTube ID
      thumbnail: '/api/placeholder/800/450',
      description: 'プロジェクト第一弾となるMV。ユノとアリサの出会いを描いた感動的な作品。',
      lyrics: `
        verse 1:
        終焉の街角で
        君と出会った
        
        chorus:
        運命が交差する
        この瞬間を
      `,
      tags: JSON.stringify(['ユノ', 'アリサ', '出会い', '序章'])
    }
  ];

  mvData.forEach(mv => {
    insertMV.run(mv.title, mv.publishedAt, mv.youtubeId, mv.thumbnail, mv.description, mv.lyrics, mv.tags);
  });

  // キャラクターのサンプルデータ
  const insertCharacter = db.prepare(`
    INSERT INTO characters (characterId, name, unitName, image, profile, profileTable, correlationDiagram) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const characterData = [
    {
      characterId: 'yuno',
      name: 'ユノ',
      unitName: 'ロジック派',
      image: '/api/placeholder/300/400',
      profile: `
        <p>ロジック派の若き戦闘員。論理的思考を重視し、感情を抑制することで戦闘力を高めている。</p>
        <p>幼い頃から厳格な訓練を受けており、任務に対する責任感が強い。しかし、アリサとの出会いにより、内に秘めた感情が揺れ動き始める。</p>
      `,
      profileTable: JSON.stringify([
        { label: '名前', value: 'ユノ' },
        { label: '年齢', value: '17歳' },
        { label: '所属', value: 'ロジック派 第3戦闘部隊' },
        { label: '居住区', value: 'セクター7' },
        { label: '特技', value: '戦術分析、剣術' }
      ]),
      correlationDiagram: '/api/placeholder/600/400'
    },
    {
      characterId: 'arisa',
      name: 'アリサ',
      unitName: '感情派',
      image: '/api/placeholder/300/400',
      profile: `
        <p>感情派の戦闘員。豊かな感情表現と直感を武器に戦う。明るく人懐っこい性格で、仲間からの信頼も厚い。</p>
        <p>感情派の理念を深く信じているが、ユノとの交流を通じて、対立する派閥への理解を深めていく。</p>
      `,
      profileTable: JSON.stringify([
        { label: '名前', value: 'アリサ' },
        { label: '年齢', value: '16歳' },
        { label: '所属', value: '感情派 第1戦闘部隊' },
        { label: '居住区', value: 'セクター12' },
        { label: '特技', value: '感情増幅、銃撃戦' }
      ]),
      correlationDiagram: '/api/placeholder/600/400'
    }
  ];

  characterData.forEach(character => {
    insertCharacter.run(
      character.characterId,
      character.name,
      character.unitName,
      character.image,
      character.profile,
      character.profileTable,
      character.correlationDiagram
    );
  });

  // 世界観のサンプルデータ
  const insertWorldview = db.prepare(`
    INSERT INTO worldview (name, description, mainImage, keywords) VALUES (?, ?, ?, ?)
  `);

  const worldviewData = [
    {
      name: 'ロジック派',
      description: `
        <p>理性と論理を最重要視する派閥。効率性と合理性を追求し、感情を制御することで最適解を導き出すことを信条としている。</p>
        <p>高度な技術力を持ち、都市部の中枢を支配している。建築様式は機能美を重視したミニマルなデザインが特徴。</p>
      `,
      mainImage: '/api/placeholder/800/600',
      keywords: JSON.stringify([
        { term: 'ロジカル・シンキング', definition: 'すべての判断を論理的思考に基づいて行う思想' },
        { term: 'エモーション・サプレッサー', definition: '感情を抑制するための装置' },
        { term: 'セクター1-10', definition: 'ロジック派が統治する居住区域' }
      ])
    },
    {
      name: '感情派',
      description: `
        <p>感情の力を信じ、人間らしさを大切にする派閥。直感と感情に基づく判断を重視し、創造性と自由を追求している。</p>
        <p>芸術的センスに長け、色彩豊かで有機的なデザインの建築物を好む。コミュニティの絆を大切にしている。</p>
      `,
      mainImage: '/api/placeholder/800/600',
      keywords: JSON.stringify([
        { term: 'エモーショナル・パワー', definition: '感情から生まれる力を活用する能力' },
        { term: 'フィーリング・アンプ', definition: '感情を増幅させるための装置' },
        { term: 'セクター11-20', definition: '感情派が統治する居住区域' }
      ])
    },
    {
      name: '廃墟',
      description: `
        <p>両派閥から見放された中立地帯。荒廃した建物が立ち並び、法の支配が及ばない危険な場所。</p>
        <p>しかし、ここには両派閥の理念にとらわれない自由な人々が住んでおり、独自の文化が形成されている。</p>
      `,
      mainImage: '/api/placeholder/800/600',
      keywords: JSON.stringify([
        { term: 'ニュートラル・ゾーン', definition: '両派閥の影響を受けない中立地帯' },
        { term: 'スカベンジャー', definition: '廃墟で物資を回収する人々' },
        { term: 'セクター外', definition: '正式な区域番号が割り当てられていない地域' }
      ])
    }
  ];

  worldviewData.forEach(worldview => {
    insertWorldview.run(worldview.name, worldview.description, worldview.mainImage, worldview.keywords);
  });

  // ヘッダー画像のサンプルデータ
  const insertHeaderImage = db.prepare(`
    INSERT INTO header_images (imagePath, imageType, displayDuration, isActive, sortOrder) VALUES (?, ?, ?, ?, ?)
  `);

  const headerImageData = [
    {
      imagePath: '/images/headers/header_01.png',
      imageType: 'png',
      displayDuration: 8,
      isActive: true,
      sortOrder: 1
    },
    {
      imagePath: '/images/headers/header_02.jpg',
      imageType: 'jpg',
      displayDuration: 6,
      isActive: true,
      sortOrder: 2
    },
    {
      imagePath: '/images/headers/header_animation.webp',
      imageType: 'webp',
      displayDuration: 0, // WEBPアニメーションはアニメーション再生時間に依存
      isActive: true,
      sortOrder: 3
    }
  ];

  headerImageData.forEach(headerImage => {
    insertHeaderImage.run(
      headerImage.imagePath,
      headerImage.imageType,
      headerImage.displayDuration,
      headerImage.isActive,
      headerImage.sortOrder
    );
  });

  console.log('サンプルデータを挿入しました');
}

// データベースアクセス関数
export const newsQueries = {
  getAll: () => {
    return db.prepare('SELECT * FROM news ORDER BY publishedAt DESC').all() as NewsRow[];
  },
  getById: (id: string) => {
    return db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsRow | undefined;
  },
  getLatest: (limit: number = 3) => {
    return db.prepare('SELECT * FROM news ORDER BY publishedAt DESC LIMIT ?').all(limit) as NewsRow[];
  }
};

export const musicVideoQueries = {
  getAll: () => {
    const rows = db.prepare('SELECT * FROM music_videos ORDER BY publishedAt DESC').all() as MusicVideoRow[];
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags)
    }));
  },
  getById: (id: string) => {
    const row = db.prepare('SELECT * FROM music_videos WHERE id = ?').get(id) as MusicVideoRow | undefined;
    if (row) {
      return {
        ...row,
        tags: JSON.parse(row.tags)
      };
    }
    return null;
  },
  getLatest: () => {
    const row = db.prepare('SELECT * FROM music_videos ORDER BY publishedAt DESC LIMIT 1').get() as MusicVideoRow | undefined;
    if (row) {
      return {
        ...row,
        tags: JSON.parse(row.tags)
      };
    }
    return null;
  }
};

export const characterQueries = {
  getAll: () => {
    const rows = db.prepare('SELECT * FROM characters ORDER BY id').all() as CharacterRow[];
    return rows.map(row => ({
      ...row,
      profileTable: JSON.parse(row.profileTable)
    }));
  },
  getById: (characterId: string) => {
    const row = db.prepare('SELECT * FROM characters WHERE characterId = ?').get(characterId) as CharacterRow | undefined;
    if (row) {
      return {
        ...row,
        profileTable: JSON.parse(row.profileTable)
      };
    }
    return null;
  },
  getFeatured: (limit: number = 2) => {
    const rows = db.prepare('SELECT * FROM characters ORDER BY id LIMIT ?').all(limit) as CharacterRow[];
    return rows.map(row => ({
      ...row,
      profileTable: JSON.parse(row.profileTable)
    }));
  }
};

export const worldviewQueries = {
  getAll: () => {
    const rows = db.prepare('SELECT * FROM worldview ORDER BY id').all() as WorldviewRow[];
    return rows.map(row => ({
      ...row,
      keywords: JSON.parse(row.keywords)
    }));
  },
  getById: (id: string) => {
    const row = db.prepare('SELECT * FROM worldview WHERE id = ?').get(id) as WorldviewRow | undefined;
    if (row) {
      return {
        ...row,
        keywords: JSON.parse(row.keywords)
      };
    }
    return null;
  }
};

export const headerImageQueries = {
  getActive: () => {
    return db.prepare('SELECT * FROM header_images WHERE isActive = 1 ORDER BY sortOrder').all() as HeaderImageRow[];
  },
  getAll: () => {
    return db.prepare('SELECT * FROM header_images ORDER BY sortOrder').all() as HeaderImageRow[];
  },
  getById: (id: string) => {
    return db.prepare('SELECT * FROM header_images WHERE id = ?').get(id) as HeaderImageRow | undefined;
  }
};

// データベースの初期化（アプリ起動時に実行）
if (typeof window === 'undefined') {
  initializeDatabase();
}
