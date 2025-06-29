/**
 * メインアプリケーションロジック
 */
class ProjectGenesisApp {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.initializeApp();
        this.initImageModal();
        this.initHeaderSlideshow();
    }

    initElements() {
        // DOM Elements
        this.heroHeader = document.querySelector('.hero-header');
        this.newsBtn = document.getElementById('btn-news');
        this.worldviewBtn = document.getElementById('btn-worldview');
        this.charactersBtn = document.getElementById('btn-characters');
        
        this.newsContent = document.getElementById('content-news');
        this.worldviewContent = document.getElementById('content-worldview');
        this.charactersContent = document.getElementById('content-characters');
        this.aegisContent = document.getElementById('content-aegis');
        this.gehennaContent = document.getElementById('content-gehenna');

        this.allContent = [
            this.newsContent,
            this.worldviewContent, 
            this.charactersContent, 
            this.aegisContent, 
            this.gehennaContent
        ];
    }

    initEventListeners() {
        // Event Listeners for main tabs
        this.newsBtn.addEventListener('click', () => {
            this.showContent(this.newsContent);
            this.setActiveTab(this.newsBtn);
        });

        this.worldviewBtn.addEventListener('click', () => {
            this.showContent(this.worldviewContent);
            this.setActiveTab(this.worldviewBtn);
        });

        this.charactersBtn.addEventListener('click', () => {
            this.showContent(this.charactersContent);
            this.setActiveTab(this.charactersBtn);
        });

        // Event Listeners for details buttons (delegated event handling)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-aegis-btn')) {
                this.showContent(this.aegisContent);
            } else if (e.target.classList.contains('view-gehenna-btn')) {
                this.showContent(this.gehennaContent);
            } else if (e.target.classList.contains('back-to-worldview-btn')) {
                this.showContent(this.worldviewContent);
                this.setActiveTab(this.worldviewBtn);
            }
        });
    }

    showContent(contentToShow) {
        // Hide all content
        this.allContent.forEach(content => content.classList.add('hidden'));
        
        // Show selected content
        if (contentToShow) {
            contentToShow.classList.remove('hidden');
        }
        
        // Show/hide hero header
        if (contentToShow === this.newsContent || contentToShow === this.worldviewContent || contentToShow === this.charactersContent) {
            this.heroHeader.classList.remove('hidden');
        } else {
            this.heroHeader.classList.add('hidden');
        }
    }

    setActiveTab(activeBtn) {
        // Remove active class from all buttons
        this.newsBtn.classList.remove('active');
        this.worldviewBtn.classList.remove('active');
        this.charactersBtn.classList.remove('active');
        
        // Add active class to clicked button
        activeBtn.classList.add('active');
    }

    initializeApp() {
        // Initial state - show news content
        this.showContent(this.newsContent);
        this.setActiveTab(this.newsBtn);
        
        // Load news data
        this.loadNews();
    }

    initImageModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="image-modal" class="image-modal">
                <div class="image-modal-content">
                    <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
                    <img id="modal-image" src="" alt="拡大画像">
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add click event listeners to gallery images
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-image')) {
                this.openImageModal(e.target.src, e.target.alt);
            }
        });

        // Close modal when clicking outside image
        document.getElementById('image-modal').addEventListener('click', (e) => {
            if (e.target.id === 'image-modal') {
                this.closeImageModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageModal();
            }
        });

        // ページの可視性変更を監視（パフォーマンス最適化）
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    openImageModal(src, alt) {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        
        modalImage.src = src;
        modalImage.alt = alt;
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeImageModal() {
        const modal = document.getElementById('image-modal');
        modal.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }

    // ニュース読み込み機能
    async loadNews() {
        const loadingElement = document.getElementById('news-loading');
        const listElement = document.getElementById('news-list');
        const errorElement = document.getElementById('news-error');

        try {
            // JSONファイルからニュースデータを読み込み
            const response = await fetch('data/news.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // ニュースアイテムを生成
            this.renderNews(data.news);
            
            // ローディングを隠してニュースリストを表示
            loadingElement.classList.add('hidden');
            listElement.classList.remove('hidden');
            
        } catch (error) {
            console.error('ニュースの読み込みに失敗しました:', error);
            
            // エラー表示
            loadingElement.classList.add('hidden');
            errorElement.classList.remove('hidden');
        }
    }

    renderNews(newsItems) {
        const listElement = document.getElementById('news-list');
        listElement.innerHTML = '';

        newsItems.forEach(item => {
            const hasLink = item.link && item.link.url;
            const linkClass = hasLink ? 'clickable' : 'no-link';
            const linkIndicator = hasLink ? this.createLinkIndicator(item.link) : '';

            const newsItemHTML = `
                <article class="news-item ${linkClass}" data-news-id="${item.id}" ${hasLink ? `data-link='${JSON.stringify(item.link)}'` : ''}>
                    ${linkIndicator}
                    <img src="${item.image}" alt="${item.title}" class="news-image" 
                         onerror="this.onerror=null;this.src='https://placehold.co/120x120/1f2937/9ca3af?text=NO+IMAGE';">
                    <div class="news-content">
                        <div class="news-header">
                            <h3 class="news-title">${item.title}</h3>
                            <time class="news-date">${item.date}</time>
                        </div>
                        <p class="news-description">${item.description}</p>
                    </div>
                </article>
            `;
            listElement.insertAdjacentHTML('beforeend', newsItemHTML);
        });

        // ニュースアイテムのクリックイベントを追加
        this.initNewsClickEvents();
    }

    createLinkIndicator(link) {
        const isExternal = link.type === 'external';
        const iconSvg = isExternal 
            ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>';
        
        const indicatorClass = isExternal ? 'external' : 'internal';
        
        return `<div class="news-link-indicator ${indicatorClass}">${iconSvg}</div>`;
    }

    initNewsClickEvents() {
        document.querySelectorAll('.news-item.clickable').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const linkData = JSON.parse(item.dataset.link);
                this.handleNewsClick(linkData);
            });
        });
    }

    handleNewsClick(linkData) {
        if (!linkData || !linkData.url) {
            return;
        }

        switch (linkData.type) {
            case 'internal':
                this.handleInternalLink(linkData);
                break;
            case 'external':
                this.handleExternalLink(linkData);
                break;
            default:
                console.warn('未知のリンクタイプ:', linkData.type);
        }
    }

    handleInternalLink(linkData) {
        const target = linkData.target;
        
        switch (target) {
            case 'worldview':
                this.showContent(this.worldviewContent);
                this.setActiveTab(this.worldviewBtn);
                break;
            case 'characters':
                this.showContent(this.charactersContent);
                this.setActiveTab(this.charactersBtn);
                break;
            case 'aegis':
                this.showContent(this.aegisContent);
                break;
            case 'gehenna':
                this.showContent(this.gehennaContent);
                break;
            default:
                console.warn('未知の内部リンクターゲット:', target);
        }
    }

    handleExternalLink(linkData) {
        const target = linkData.target || '_blank';
        window.open(linkData.url, target);
    }

    // ヘッダー背景画像スライドショー機能
    async initHeaderSlideshow() {
        this.headerImages = [];
        this.currentImageIndex = 0;
        this.slideInterval = null;
        this.isTransitioning = false;

        try {
            const response = await fetch('data/header_images.json');
            if (!response.ok) {
                console.warn('ヘッダー画像設定ファイルが見つかりません。デフォルト背景を使用します。');
                return;
            }

            const data = await response.json();
            this.headerImagesData = data.headerImages;
            this.slideSettings = data.settings;

            if (this.headerImagesData && this.headerImagesData.length > 0) {
                await this.preloadHeaderImages();
                this.startSlideshow();
            }
        } catch (error) {
            console.error('ヘッダー画像の読み込みに失敗しました:', error);
        }
    }

    async preloadHeaderImages() {
        const headerBackground = document.getElementById('header-background');
        
        // 画像要素を作成して挿入
        this.headerImagesData.forEach((imageData, index) => {
            const img = document.createElement('img');
            img.src = imageData.path;
            img.alt = `Header Background ${index + 1}`;
            img.className = 'header-bg-image';
            img.dataset.index = index;
            img.dataset.duration = imageData.duration;
            img.dataset.type = imageData.type;
            
            // 最初の画像をアクティブに
            if (index === 0) {
                img.classList.add('active');
            }

            headerBackground.appendChild(img);
        });

        // 画像の読み込み完了を待つ
        const imagePromises = this.headerImagesData.map((imageData, index) => {
            return new Promise((resolve, reject) => {
                const img = headerBackground.children[index];
                
                if (img.complete) {
                    img.classList.add('loaded');
                    resolve();
                } else {
                    img.onload = () => {
                        img.classList.add('loaded');
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`ヘッダー画像の読み込みに失敗: ${imageData.path}`);
                        resolve(); // エラーでも続行
                    };
                }
            });
        });

        await Promise.all(imagePromises);
        console.log('ヘッダー背景画像の読み込み完了');
    }

    startSlideshow() {
        if (!this.headerImagesData || this.headerImagesData.length <= 1) {
            return;
        }

        const showNextImage = () => {
            if (this.isTransitioning) return;

            this.isTransitioning = true;
            const headerBackground = document.getElementById('header-background');
            const currentImg = headerBackground.children[this.currentImageIndex];
            
            // 次の画像インデックス
            this.currentImageIndex = (this.currentImageIndex + 1) % this.headerImagesData.length;
            const nextImg = headerBackground.children[this.currentImageIndex];

            // フェードアウト現在の画像
            currentImg.classList.remove('active');

            // フェードイン次の画像
            setTimeout(() => {
                nextImg.classList.add('active');
                this.isTransitioning = false;
            }, this.slideSettings.fadeTransitionDuration / 2);

            // 次の切り替えをスケジュール
            const currentImageData = this.headerImagesData[this.currentImageIndex];
            this.slideInterval = setTimeout(showNextImage, currentImageData.duration);
        };

        // 最初の画像の表示時間後に切り替え開始
        const firstImageData = this.headerImagesData[this.currentImageIndex];
        this.slideInterval = setTimeout(showNextImage, firstImageData.duration);
    }

    stopSlideshow() {
        if (this.slideInterval) {
            clearTimeout(this.slideInterval);
            this.slideInterval = null;
        }
    }

    // ページ非表示時にスライドショーを停止（パフォーマンス最適化）
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopSlideshow();
        } else if (this.headerImagesData && this.headerImagesData.length > 1) {
            this.startSlideshow();
        }
    }
}

// Global function for modal close button
function closeImageModal() {
    const app = window.projectGenesisApp;
    if (app) {
        app.closeImageModal();
    }
}

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
    window.projectGenesisApp = new ProjectGenesisApp();
});
