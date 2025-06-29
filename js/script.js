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
        this.initGallerySystem(); // ギャラリーシステムの初期化
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
        
        // Load characters data
        this.loadCharacters();
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

    // ギャラリー機能の初期化
    initGallerySystem() {
        this.initAegisGallery();
        this.initGehennaGallery();
        this.initGalleryModal();
    }

    // AEGISギャラリーの初期化
    async initAegisGallery() {
        try {
            const response = await fetch('data/aegis_gallery.json');
            const data = await response.json();
            this.renderGallery('aegis-gallery-container', 'aegis-gallery-loading', data.gallery, 'aegis');
        } catch (error) {
            console.error('AEGISギャラリーデータの読み込みに失敗:', error);
            this.showGalleryError('aegis-gallery-container', 'aegis-gallery-loading');
        }
    }

    // GEHENNAギャラリーの初期化
    async initGehennaGallery() {
        try {
            const response = await fetch('data/gehenna_gallery.json');
            const data = await response.json();
            this.renderGallery('gehenna-gallery-container', 'gehenna-gallery-loading', data.gallery, 'gehenna');
        } catch (error) {
            console.error('GEHENNAギャラリーデータの読み込みに失敗:', error);
            this.showGalleryError('gehenna-gallery-container', 'gehenna-gallery-loading');
        }
    }

    // ギャラリーのレンダリング
    renderGallery(containerId, loadingId, galleryData, faction) {
        const container = document.getElementById(containerId);
        const loading = document.getElementById(loadingId);
        
        if (!container) return;

        // ローディング表示を非表示
        if (loading) {
            loading.style.display = 'none';
        }

        // ギャラリーアイテムを生成
        container.innerHTML = '';
        galleryData.forEach(item => {
            const galleryItem = this.createGalleryItem(item, faction);
            container.appendChild(galleryItem);
        });
    }

    // ギャラリーアイテムの作成
    createGalleryItem(item, faction) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.galleryId = item.id;
        
        div.innerHTML = `
            <div class="gallery-item-image">
                <img src="${item.imagePath}" alt="${item.title}" onerror="this.onerror=null;this.src='https://placehold.co/400x300/1f2937/9ca3af?text=IMAGE+NOT+FOUND';">
                <div class="gallery-item-overlay"></div>
            </div>
            <div class="gallery-item-content">
                <h4 class="gallery-item-title">${item.title}</h4>
                <p class="gallery-item-description">${item.description}</p>
                <span class="gallery-item-category">${this.getCategoryLabel(item.category)}</span>
            </div>
        `;

        // クリックイベントの追加（重複を防ぐ）
        div.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openGalleryModal(item);
        }, { once: false });

        return div;
    }

    // カテゴリラベルの取得
    getCategoryLabel(category) {
        const categoryLabels = {
            'cityscape': '都市景観',
            'facility': '施設',
            'system': 'システム',
            'residential': '居住区',
            'cultural': '文化',
            'commerce': '商業',
            'military': '軍事'
        };
        return categoryLabels[category] || category;
    }

    // ギャラリーモーダルの初期化
    initGalleryModal() {
        // モーダルが既に初期化されている場合は再初期化しない
        if (this.galleryModalInitialized) {
            return;
        }

        const modal = document.getElementById('gallery-modal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.gallery-modal-close');
        const overlay = modal.querySelector('.gallery-modal-overlay');

        // クローズボタンイベント
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeGalleryModal();
            });
        }

        // オーバーレイクリックイベント
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeGalleryModal();
            });
        }

        // モーダル自体のクリックでは閉じない（コンテンツエリアのクリック）
        const modalContent = modal.querySelector('.gallery-modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // ESCキーでモーダルを閉じる
        this.galleryModalEscHandler = (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.closeGalleryModal();
            }
        };
        document.addEventListener('keydown', this.galleryModalEscHandler);

        this.galleryModalInitialized = true;
    }

    // ギャラリーモーダルを開く
    openGalleryModal(item) {
        const modal = document.getElementById('gallery-modal');
        if (!modal) {
            console.error('Gallery modal not found');
            return;
        }

        // モーダルが既に開いている場合は閉じる
        if (!modal.classList.contains('hidden')) {
            this.closeGalleryModal();
            return;
        }

        // モーダルの内容を設定
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalCategory = document.getElementById('modal-category');

        if (modalImage) {
            modalImage.src = item.imagePath;
            modalImage.alt = item.title;
            modalImage.onerror = function() {
                this.src = 'https://placehold.co/800x600/1f2937/9ca3af?text=IMAGE+NOT+FOUND';
            };
        }
        if (modalTitle) {
            modalTitle.textContent = item.title;
        }
        if (modalDescription) {
            modalDescription.textContent = item.description;
        }
        if (modalCategory) {
            modalCategory.textContent = this.getCategoryLabel(item.category);
        }

        // モーダルを表示
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // フェードインアニメーション
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });

        console.log('Gallery modal opened for:', item.title);
    }

    // ギャラリーモーダルを閉じる
    closeGalleryModal() {
        const modal = document.getElementById('gallery-modal');
        if (!modal || modal.classList.contains('hidden')) {
            return;
        }

        console.log('Closing gallery modal');

        // フェードアウトアニメーション
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            modal.style.opacity = '';
            document.body.style.overflow = '';
        }, 300);
    }

    // ギャラリーエラー表示
    showGalleryError(containerId, loadingId) {
        const container = document.getElementById(containerId);
        const loading = document.getElementById(loadingId);
        
        if (loading) {
            loading.textContent = 'ギャラリーデータの読み込みに失敗しました。';
            loading.style.color = '#ef4444';
        }
    }

    // === CHARACTER SYSTEM ===
    async loadCharacters() {
        try {
            const response = await fetch('data/characters.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.renderCharacters(data.characters);
            
        } catch (error) {
            console.error('キャラクターの読み込みに失敗しました:', error);
        }
    }

    renderCharacters(characters) {
        const charactersContainer = document.querySelector('#content-characters');
        
        // ヘッダー部分は保持
        const headerHTML = `
            <header class="text-center mb-12">
                <h2 class="font-orbitron text-4xl md:text-6xl font-bold text-white tracking-widest">CHARACTERS</h2>
                <p class="text-gray-400 mt-2 text-lg">登場人物</p>
            </header>
        `;
        
        // キャラクターカードを生成
        const charactersHTML = characters.map(character => this.createCharacterCard(character)).join('');
        
        charactersContainer.innerHTML = headerHTML + charactersHTML;
    }

    createCharacterCard(character) {
        const isReverse = character.layout === 'reverse';
        const themeColor = character.themeColor || 'cyan';
        
        // 詳細情報のHTML生成
        const detailsHTML = Object.entries(character.details).map(([key, value]) => `
            <div class="bg-gray-800/60 rounded-lg p-4 border border-${themeColor}-500/20">
                <h5 class="text-${themeColor}-300 font-bold mb-2 text-lg">${this.getDetailLabel(key)}</h5>
                <p class="text-gray-300 text-base">${value}</p>
            </div>
        `).join('');

        const imageSection = `
            <div class="character-image-section ${isReverse ? 'reverse' : ''} bg-gradient-to-b from-${themeColor}-900/20 to-${themeColor}-800/10 flex items-center justify-center p-6 md:p-8">
                <div class="w-full max-w-sm mx-auto">
                    <img src="${character.image}" alt="${character.name}の立ち絵" class="character-portrait w-full h-auto object-contain rounded-lg" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${character.fallbackImage}';">
                </div>
            </div>
        `;

        const infoSection = `
            <div class="character-info-section p-6 md:p-8 lg:p-10 flex flex-col justify-center character-bg-gradient">
                <div class="space-y-8">
                    <div class="text-center sm:text-left">
                        <h3 class="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold text-${themeColor}-300 text-shadow-${themeColor} mb-3">${character.name}</h3>
                        <p class="font-orbitron text-xl md:text-2xl lg:text-3xl text-${themeColor}-400 mb-8">${character.nameEn}</p>
                    </div>
                    
                    <div class="space-y-6">
                        <div class="border-l-4 border-${themeColor}-400 pl-6">
                            <h4 class="text-xl font-bold text-white mb-3">プロフィール</h4>
                            <p class="text-gray-300 leading-relaxed text-lg">
                                ${character.description}
                            </p>
                        </div>
                        
                        <div class="character-info-grid mt-8">
                            ${detailsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return `
            <div class="mb-16">
                <div class="card rounded-lg overflow-hidden border border-${themeColor}-700/50 border-glow-${themeColor} max-w-6xl mx-auto">
                    <div class="character-force-horizontal ${isReverse ? 'reverse' : ''}">
                        ${isReverse ? infoSection + imageSection : imageSection + infoSection}
                    </div>
                </div>
            </div>
        `;
    }

    getDetailLabel(key) {
        const labels = {
            'age': '年齢',
            'affiliation': '所属',
            'characteristic': '特徴',
            'ability': '能力',
            'relationship': '関係'
        };
        return labels[key] || key;
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
