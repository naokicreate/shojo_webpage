/**
 * ページコンテンツローダー
 */
class PageLoader {
    constructor() {
        this.cache = new Map();
    }

    /**
     * ページコンテンツを非同期で読み込む
     * @param {string} pageName - ページ名
     * @returns {Promise<string>} - HTMLコンテンツ
     */
    async loadPage(pageName) {
        // キャッシュされている場合はそれを返す
        if (this.cache.has(pageName)) {
            return this.cache.get(pageName);
        }

        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load page: ${pageName}`);
            }
            
            const content = await response.text();
            this.cache.set(pageName, content);
            return content;
        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error);
            return `<div class="text-center text-red-400 p-8">
                        <h3>ページの読み込みに失敗しました</h3>
                        <p>ページ: ${pageName}</p>
                    </div>`;
        }
    }

    /**
     * コンテナにページコンテンツを挿入
     * @param {HTMLElement} container - コンテンツを挿入するコンテナ
     * @param {string} pageName - ページ名
     */
    async insertPageContent(container, pageName) {
        const content = await this.loadPage(pageName);
        container.innerHTML = content;
    }
}

// エクスポート（ES6モジュール）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageLoader;
}
