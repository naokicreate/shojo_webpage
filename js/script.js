/**
 * メインアプリケーションロジック
 */
class ProjectGenesisApp {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.initializeApp();
        this.initImageModal();
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
            const newsItemHTML = `
                <article class="news-item" data-news-id="${item.id}">
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
