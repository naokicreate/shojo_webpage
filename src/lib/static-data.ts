// GitHub Pages用の静的データフェッチユーティリティ
export const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export async function fetchStaticData(endpoint: string) {
  if (isGitHubPages) {
    // GitHub Pages環境では静的JSONファイルを使用
    const dataMap: Record<string, string> = {
      '/api/news': '/data/news.json',
      '/api/music-videos': '/data/music-videos.json',
      '/api/characters': '/data/characters.json',
      '/api/worldview': '/data/worldview.json',
      '/api/header-images': '/data/header-images.json',
    };
    
    const staticPath = dataMap[endpoint];
    if (staticPath) {
      const response = await fetch(staticPath);
      return response.json();
    }
    throw new Error(`No static data for endpoint: ${endpoint}`);
  } else {
    // 通常環境ではAPIエンドポイントを使用
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return response.json();
  }
}
