/**
 * メインアプリケーションロジック
 */
class ProjectGenesisApp {
    constructor() {
        console.log('ProjectGenesisApp: 初期化開始');
        this.initElements();
        this.initEventListeners();
        this.initializeApp();
        this.initImageModal();
        this.initHeaderSlideshow();
        this.initGallerySystem(); // ギャラリーシステムの初期化
        this.initAudioControl(); // 音声コントロールの初期化
        console.log('ProjectGenesisApp: 初期化完了');
    }

    initElements() {
        // DOM Elements
        this.heroHeader = document.querySelector('.hero-header');
        this.newsBtn = document.getElementById('btn-news');
        this.worldviewBtn = document.getElementById('btn-worldview');
        this.charactersBtn = document.getElementById('btn-characters');
        this.musicBtn = document.getElementById('btn-music');
        
        this.newsContent = document.getElementById('content-news');
        this.worldviewContent = document.getElementById('content-worldview');
        this.charactersContent = document.getElementById('content-characters');
        this.musicContent = document.getElementById('content-music');
        this.aegisContent = document.getElementById('content-aegis');
        this.gehennaContent = document.getElementById('content-gehenna');

        this.allContent = [
            this.newsContent,
            this.worldviewContent, 
            this.charactersContent,
            this.musicContent,
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

        this.musicBtn.addEventListener('click', () => {
            this.showContent(this.musicContent);
            this.setActiveTab(this.musicBtn);
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
        if (contentToShow === this.newsContent || contentToShow === this.worldviewContent || contentToShow === this.charactersContent || contentToShow === this.musicContent) {
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
        this.musicBtn.classList.remove('active');
        
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
        console.log('キャラクター読み込み開始');
        try {
            const response = await fetch('data/characters.json');
            console.log('characters.json fetch完了:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('キャラクターデータ:', data);
            this.renderCharacters(data.characters);
            console.log('キャラクター描画完了');
            
        } catch (error) {
            console.error('キャラクターの読み込みに失敗しました:', error);
            // GitHub Pages用フォールバック
            this.renderCharactersFallback();
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
            <div class="character-image-section ${themeColor}-theme ${isReverse ? 'reverse' : ''}">
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

    // キャラクターフォールバック描画
    renderCharactersFallback() {
        console.log('キャラクターフォールバック描画開始');
        const charactersContainer = document.querySelector('#content-characters');
        
        const fallbackHTML = `
            <header class="text-center mb-12">
                <h2 class="font-orbitron text-4xl md:text-6xl font-bold text-white tracking-widest">CHARACTERS</h2>
                <p class="text-gray-400 mt-2 text-lg">登場人物</p>
            </header>
            
            <div class="mb-16">
                <div class="card rounded-lg overflow-hidden border border-blue-700/50 border-glow-blue max-w-6xl mx-auto">
                    <div class="character-force-horizontal">
                        <div class="character-image-section blue-theme">
                            <div class="w-full max-w-sm mx-auto">
                                <img src="img/characters/chara_yuka_001.png" alt="ユノの立ち絵" class="character-portrait w-full h-auto object-contain rounded-lg" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='https://placehold.co/375x1024/1f2937/9ca3af?text=CHARACTER+IMAGE';">
                            </div>
                        </div>
                        <div class="character-info-section p-6 md:p-8 lg:p-10 flex flex-col justify-center character-bg-gradient">
                            <div class="space-y-8">
                                <div class="text-center sm:text-left">
                                    <h3 class="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold text-blue-300 text-shadow-blue mb-3">ユノ</h3>
                                    <p class="font-orbitron text-xl md:text-2xl lg:text-3xl text-blue-400 mb-8">Yuno (Unit 703)</p>
                                </div>
                                
                                <div class="space-y-6">
                                    <div class="border-l-4 border-blue-400 pl-6">
                                        <h4 class="text-xl font-bold text-white mb-3">プロフィール</h4>
                                        <p class="text-gray-300 leading-relaxed text-lg">
                                            貢献価値テストで満点を叩き出したAEGISの至宝。<br>14歳という若さで、最も危険な任務が多いとされる<br>公安部隊に配属されたエリート。<br>感情の起伏が極端に少なく、常にぼーっとしているように見える。
                                        </p>
                                    </div>
                                    
                                    <div class="character-info-grid mt-8">
                                        <div class="bg-gray-800/60 rounded-lg p-4 border border-blue-500/20">
                                            <h5 class="text-blue-300 font-bold mb-2 text-lg">年齢</h5>
                                            <p class="text-gray-300 text-base">14歳</p>
                                        </div>
                                        <div class="bg-gray-800/60 rounded-lg p-4 border border-blue-500/20">
                                            <h5 class="text-blue-300 font-bold mb-2 text-lg">所属</h5>
                                            <p class="text-gray-300 text-base">AEGIS 公安部隊</p>
                                        </div>
                                        <div class="bg-gray-800/60 rounded-lg p-4 border border-blue-500/20">
                                            <h5 class="text-blue-300 font-bold mb-2 text-lg">特徴</h5>
                                            <p class="text-gray-300 text-base">感情表現が少ない</p>
                                        </div>
                                        <div class="bg-gray-800/60 rounded-lg p-4 border border-blue-500/20">
                                            <h5 class="text-blue-300 font-bold mb-2 text-lg">能力</h5>
                                            <p class="text-gray-300 text-base">貢献価値テスト満点</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        charactersContainer.innerHTML = fallbackHTML;
        console.log('キャラクターフォールバック描画完了');
    }

    // === AUDIO CONTROL SYSTEM ===
    initAudioControl() {
        console.log('音声コントロール初期化開始');
        
        // DOM要素の取得
        this.audioElement = document.getElementById('background-audio');
        this.audioToggleBtn = document.getElementById('audio-toggle');
        this.volumeControl = document.getElementById('volume-control');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumePercentage = document.getElementById('volume-percentage');
        
        // ダイアログ要素の取得（少し待ってから取得を試行）
        setTimeout(() => {
            this.audioPermissionModal = document.getElementById('audio-permission-modal');
            this.audioPermissionYes = document.getElementById('audio-permission-yes');
            this.audioPermissionNo = document.getElementById('audio-permission-no');
            
            console.log('ダイアログ要素取得結果:', {
                modal: !!this.audioPermissionModal,
                yes: !!this.audioPermissionYes,
                no: !!this.audioPermissionNo
            });
            
            // 音楽再生許可ダイアログの初期化
            this.initAudioPermissionDialog();
        }, 100);
        
        console.log('音声要素チェック:', {
            audioElement: !!this.audioElement,
            audioToggleBtn: !!this.audioToggleBtn,
            volumeControl: !!this.volumeControl,
            volumeSlider: !!this.volumeSlider,
            volumePercentage: !!this.volumePercentage
        });
        
        if (!this.audioElement || !this.audioToggleBtn || !this.volumeControl || !this.volumeSlider) {
            console.error('音声コントロール要素が見つかりません');
            console.error('見つからない要素:', {
                audioElement: !this.audioElement ? 'background-audio' : null,
                audioToggleBtn: !this.audioToggleBtn ? 'audio-toggle' : null,
                volumeControl: !this.volumeControl ? 'volume-control' : null,
                volumeSlider: !this.volumeSlider ? 'volume-slider' : null
            });
            return;
        }

        // 初期設定
        this.isPlaying = false;
        this.currentVolume = 0.9; // 90%
        this.audioElement.volume = this.currentVolume;
        this.showVolumeControl = false;
        
        // ローカルストレージから設定を復元
        this.loadAudioSettings();
        
        // イベントリスナーの設定
        this.setupAudioEventListeners();
        
        // 初期状態の設定
        this.updateVolumeDisplay();
        
        console.log('音声コントロール初期化完了');
    }

    setupAudioEventListeners() {
        // 再生/停止ボタンのクリックイベント
        this.audioToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAudio();
        });

        // 音量スライダーのイベント
        this.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(parseInt(e.target.value));
        });

        // マウスオーバーで音量コントロールを表示
        this.audioToggleBtn.addEventListener('mouseenter', () => {
            this.showVolumeControls();
        });

        // 音声コントロール全体からマウスが離れたら音量コントロールを隠す
        const audioContainer = document.querySelector('.audio-control-container');
        audioContainer.addEventListener('mouseleave', () => {
            this.hideVolumeControls();
        });

        // 音声要素のイベント
        this.audioElement.addEventListener('loadstart', () => {
            console.log('音声ファイルの読み込み開始');
        });

        this.audioElement.addEventListener('canplay', () => {
            console.log('音声ファイルの再生準備完了');
        });

        this.audioElement.addEventListener('error', (e) => {
            console.error('音声ファイルの読み込みエラー:', e);
            this.handleAudioError();
        });

        this.audioElement.addEventListener('ended', () => {
            // ループ設定があるので通常は発生しないが、念のため
            console.log('音声再生終了');
            this.isPlaying = false;
            this.updatePlayButton();
        });

        // ページの可視性変更を監視（バッテリー節約）
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    async toggleAudio() {
        try {
            if (this.isPlaying) {
                await this.pauseAudio();
            } else {
                await this.playAudio();
            }
        } catch (error) {
            console.error('音声制御エラー:', error);
            this.handleAudioError();
        }
    }

    async playAudio() {
        try {
            // 最初の再生時にプリロードを有効化
            if (this.audioElement.readyState === 0) {
                this.audioElement.preload = 'auto';
                this.audioElement.load();
            }

            await this.audioElement.play();
            this.isPlaying = true;
            this.updatePlayButton();
            this.saveAudioSettings();
            console.log('音声再生開始');
        } catch (error) {
            console.error('音声再生エラー:', error);
            
            // ユーザー操作が必要な場合の処理
            if (error.name === 'NotAllowedError') {
                console.log('ユーザー操作による再生が必要です');
                // この場合、ボタンは元の状態を保持
            } else {
                this.handleAudioError();
            }
            throw error;
        }
    }

    async pauseAudio() {
        try {
            this.audioElement.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.saveAudioSettings();
            console.log('音声再生停止');
        } catch (error) {
            console.error('音声停止エラー:', error);
            throw error;
        }
    }

    setVolume(volume) {
        // 0-100の範囲を0.0-1.0に変換
        this.currentVolume = Math.max(0, Math.min(100, volume)) / 100;
        this.audioElement.volume = this.currentVolume;
        this.updateVolumeDisplay();
        this.saveAudioSettings();
        
        console.log(`音量設定: ${Math.round(this.currentVolume * 100)}%`);
    }

    updatePlayButton() {
        if (this.isPlaying) {
            this.audioToggleBtn.classList.add('playing');
            this.audioToggleBtn.title = '背景音楽を停止';
        } else {
            this.audioToggleBtn.classList.remove('playing');
            this.audioToggleBtn.title = '背景音楽を再生';
        }
    }

    updateVolumeDisplay() {
        const volumePercent = Math.round(this.currentVolume * 100);
        this.volumeSlider.value = volumePercent;
        this.volumePercentage.textContent = `${volumePercent}%`;
    }

    showVolumeControls() {
        this.volumeControl.style.display = 'block';
        // 少し遅延させてアニメーションを適用
        requestAnimationFrame(() => {
            this.volumeControl.classList.add('show');
        });
    }

    hideVolumeControls() {
        this.volumeControl.classList.remove('show');
        // アニメーション完了後に非表示
        setTimeout(() => {
            if (!this.volumeControl.classList.contains('show')) {
                this.volumeControl.style.display = 'none';
            }
        }, 300);
    }

    handleAudioError() {
        console.error('音声システムでエラーが発生しました');
        this.isPlaying = false;
        this.updatePlayButton();
        
        // エラー状態を視覚的に表示
        this.audioToggleBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        this.audioToggleBtn.title = '音声ファイルの読み込みに失敗しました';
        
        // 5秒後に元の状態に戻す
        setTimeout(() => {
            this.audioToggleBtn.style.background = '';
            this.audioToggleBtn.title = '背景音楽の再生/停止';
        }, 5000);
    }

    // ページ非表示時の処理（バッテリー節約）
    handleVisibilityChange() {
        if (document.hidden) {
            // ページが非表示になった時の処理
            if (this.isPlaying) {
                this.wasPlayingBeforeHidden = true;
                // 必要に応じて音声を一時停止
                // this.pauseAudio();
            }
        } else {
            // ページが表示された時の処理
            if (this.wasPlayingBeforeHidden) {
                this.wasPlayingBeforeHidden = false;
                // 必要に応じて音声を再開
                // this.playAudio();
            }
        }
    }

    // 音楽再生許可ダイアログの初期化
    initAudioPermissionDialog() {
        console.log('音楽再生許可ダイアログ初期化開始');
        console.log('要素チェック:', {
            modal: !!this.audioPermissionModal,
            yes: !!this.audioPermissionYes,
            no: !!this.audioPermissionNo
        });
        
        if (!this.audioPermissionModal || !this.audioPermissionYes || !this.audioPermissionNo) {
            console.error('音楽再生許可ダイアログの要素が見つかりません:', {
                modal: this.audioPermissionModal,
                yes: this.audioPermissionYes,
                no: this.audioPermissionNo
            });
            return;
        }

        // ダイアログのイベントリスナー設定のみ行う
        this.audioPermissionYes.addEventListener('click', () => {
            this.handleAudioPermissionResponse(true);
        });

        this.audioPermissionNo.addEventListener('click', () => {
            this.handleAudioPermissionResponse(false);
        });

        // オーバーレイクリックで閉じる
        const overlay = this.audioPermissionModal.querySelector('.audio-permission-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.handleAudioPermissionResponse(false);
            });
        }

        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.audioPermissionModal.classList.contains('hidden')) {
                this.handleAudioPermissionResponse(false);
            }
        });
        
        console.log('音楽再生許可ダイアログ初期化完了');
    }

    showAudioPermissionDialog() {
        console.log('音楽再生許可ダイアログを表示中...');
        
        // GitHub Pages対応: 要素が見つからない場合は再取得を試行
        if (!this.audioPermissionModal) {
            console.log('要素再取得を試行...');
            this.audioPermissionModal = document.getElementById('audio-permission-modal');
            this.audioPermissionYes = document.getElementById('audio-permission-yes');
            this.audioPermissionNo = document.getElementById('audio-permission-no');
        }
        
        console.log('ダイアログ要素の状態:', {
            modal: !!this.audioPermissionModal,
            yes: !!this.audioPermissionYes,
            no: !!this.audioPermissionNo,
            hasHiddenClass: this.audioPermissionModal ? this.audioPermissionModal.classList.contains('hidden') : null,
            computedStyle: this.audioPermissionModal ? window.getComputedStyle(this.audioPermissionModal).display : null
        });
        
        if (this.audioPermissionModal) {
            // GitHub Pages対応: より確実な表示処理
            this.audioPermissionModal.classList.remove('hidden');
            this.audioPermissionModal.style.display = 'flex';
            this.audioPermissionModal.style.opacity = '1';
            this.audioPermissionModal.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            
            // イベントリスナーがまだ設定されていない場合は設定
            if (this.audioPermissionYes && !this.audioPermissionYes.hasAttribute('data-listener-set')) {
                this.audioPermissionYes.addEventListener('click', () => {
                    this.handleAudioPermissionResponse(true);
                });
                this.audioPermissionYes.setAttribute('data-listener-set', 'true');
            }
            
            if (this.audioPermissionNo && !this.audioPermissionNo.hasAttribute('data-listener-set')) {
                this.audioPermissionNo.addEventListener('click', () => {
                    this.handleAudioPermissionResponse(false);
                });
                this.audioPermissionNo.setAttribute('data-listener-set', 'true');
            }
            
            console.log('ダイアログ表示完了');
        } else {
            console.error('ダイアログ要素が見つかりません - DOM要素一覧:');
            console.error('modal:', document.getElementById('audio-permission-modal'));
            console.error('yes button:', document.getElementById('audio-permission-yes'));
            console.error('no button:', document.getElementById('audio-permission-no'));
        }
    }

    hideAudioPermissionDialog() {
        console.log('音楽再生許可ダイアログを非表示');
        if (this.audioPermissionModal) {
            this.audioPermissionModal.classList.add('hidden');
            this.audioPermissionModal.style.display = 'none';
            this.audioPermissionModal.style.opacity = '0';
            this.audioPermissionModal.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }
    }

    async handleAudioPermissionResponse(allowAudio) {
        console.log('音楽再生許可応答:', allowAudio);
        this.hideAudioPermissionDialog();

        if (allowAudio) {
            try {
                await this.playAudio();
                console.log('自動再生成功');
            } catch (error) {
                console.log('自動再生失敗（ブラウザ制限）:', error);
                // 自動再生が失敗した場合でも、ユーザーは後で手動で再生できる
            }
        } else {
            console.log('ユーザーが音楽再生を拒否');
        }
    }

    // 音声設定の保存
    saveAudioSettings() {
        try {
            const settings = {
                volume: this.currentVolume,
                isPlaying: this.isPlaying
            };
            localStorage.setItem('audioSettings', JSON.stringify(settings));
            console.log('音声設定を保存:', settings);
        } catch (error) {
            console.warn('音声設定の保存に失敗:', error);
        }
    }

    // 音声設定の読み込み
    loadAudioSettings() {
        try {
            const savedSettings = localStorage.getItem('audioSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (settings.volume !== undefined) {
                    this.currentVolume = Math.max(0, Math.min(1, settings.volume));
                    this.audioElement.volume = this.currentVolume;
                }
                console.log('音声設定を復元:', settings);
            }
        } catch (error) {
            console.warn('音声設定の読み込みに失敗:', error);
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
    console.log('DOMContentLoaded イベント発生');
    
    // 確実にDOMが完全に読み込まれるまで少し待つ
    setTimeout(() => {
        console.log('アプリケーション初期化開始');
        window.projectGenesisApp = new ProjectGenesisApp();
        
        // ミュージックマネージャーの初期化
        window.musicManager = new MusicManager();
        
        // GitHub Pages環境でのダイアログ表示
        // さらに長い遅延を設けて確実に表示
        setTimeout(() => {
            if (window.projectGenesisApp) {
                console.log('GitHub Pages対応: ダイアログ表示実行');
                
                // ダイアログ要素の再取得を試行
                const modal = document.getElementById('audio-permission-modal');
                const yesBtn = document.getElementById('audio-permission-yes');
                const noBtn = document.getElementById('audio-permission-no');
                
                console.log('GitHub Pages: 要素チェック', {
                    modal: !!modal,
                    yesBtn: !!yesBtn,
                    noBtn: !!noBtn
                });
                
                if (modal && yesBtn && noBtn) {
                    // 要素を直接アプリインスタンスに設定
                    window.projectGenesisApp.audioPermissionModal = modal;
                    window.projectGenesisApp.audioPermissionYes = yesBtn;
                    window.projectGenesisApp.audioPermissionNo = noBtn;
                    
                    // ダイアログを表示
                    window.projectGenesisApp.showAudioPermissionDialog();
                } else {
                    console.error('GitHub Pages: ダイアログ要素が見つかりません');
                }
            } else {
                console.error('GitHub Pages: アプリケーションが見つかりません');
            }
        }, 3000); // GitHub Pages用に3秒の遅延
        
    }, 200); // DOM読み込み後の遅延を200msに増加
});

class MusicManager {
    constructor() {
        this.tracks = [];
        this.filteredTracks = [];
        this.currentTrack = null;
        this.audio = null;
        this.isPlaying = false;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('音楽マネージャーを初期化中...');
            this.showLoading();
            await this.loadMusicData();
            this.setupEventListeners();
            this.setupMusicModal();
            this.hideLoading();
            this.renderTracks();
        } catch (error) {
            console.error('音楽マネージャー初期化エラー:', error);
            this.showError('音楽データの読み込みに失敗しました。');
        }
    }
    
    async loadMusicData() {
        try {
            console.log('音楽データの読み込みを開始...');
            const response = await fetch('./data/music.json');
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('読み込んだJSONデータ:', data);
            this.tracks = data.tracks || [];
            this.filteredTracks = [...this.tracks];
            console.log(`${this.tracks.length}曲の音楽データを読み込みました`);
            console.log('楽曲データ:', this.tracks);
        } catch (error) {
            console.error('音楽データ読み込みエラー:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // フィルター要素
        const tagFilter = document.getElementById('music-tag-filter');
        const genreFilter = document.getElementById('music-genre-filter');
        const moodFilter = document.getElementById('music-mood-filter');
        const sortSelect = document.getElementById('music-sort');
        const searchInput = document.getElementById('music-search');
        const clearBtn = document.getElementById('clear-filters');
        
        if (tagFilter) tagFilter.addEventListener('change', () => this.applyFilters());
        if (genreFilter) genreFilter.addEventListener('change', () => this.applyFilters());
        if (moodFilter) moodFilter.addEventListener('change', () => this.applyFilters());
        if (sortSelect) sortSelect.addEventListener('change', () => this.applyFilters());
        if (searchInput) searchInput.addEventListener('input', () => this.applyFilters());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearFilters());
        
        this.populateFilterOptions();
    }
    
    populateFilterOptions() {
        const tags = new Set();
        const genres = new Set();
        const moods = new Set();
        
        this.tracks.forEach(track => {
            track.tags?.forEach(tag => tags.add(tag));
            if (track.genre) genres.add(track.genre);
            if (track.mood) moods.add(track.mood);
        });
        
        this.populateSelect('music-tag-filter', Array.from(tags));
        this.populateSelect('music-genre-filter', Array.from(genres));
        this.populateSelect('music-mood-filter', Array.from(moods));
    }
    
    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // 既存のオプション（最初のもの以外）をクリア
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        options.sort().forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }
    
    applyFilters() {
        const tagFilter = document.getElementById('music-tag-filter')?.value || '';
        const genreFilter = document.getElementById('music-genre-filter')?.value || '';
        const moodFilter = document.getElementById('music-mood-filter')?.value || '';
        const sortValue = document.getElementById('music-sort')?.value || 'newest';
        const searchTerm = document.getElementById('music-search')?.value.toLowerCase() || '';
        
        this.filteredTracks = this.tracks.filter(track => {
            const matchesTag = !tagFilter || track.tags?.includes(tagFilter);
            const matchesGenre = !genreFilter || track.genre === genreFilter;
            const matchesMood = !moodFilter || track.mood === moodFilter;
            const matchesSearch = !searchTerm || 
                track.title.toLowerCase().includes(searchTerm) ||
                track.artist.toLowerCase().includes(searchTerm) ||
                track.description?.toLowerCase().includes(searchTerm);
            
            return matchesTag && matchesGenre && matchesMood && matchesSearch;
        });
        
        // ソート
        this.sortTracks(sortValue);
        this.renderTracks();
    }
    
    sortTracks(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredTracks.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'oldest':
                this.filteredTracks.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
                break;
            case 'title':
                this.filteredTracks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'artist':
                this.filteredTracks.sort((a, b) => a.artist.localeCompare(b.artist));
                break;
        }
    }
    
    clearFilters() {
        const elements = [
            'music-tag-filter',
            'music-genre-filter', 
            'music-mood-filter',
            'music-sort',
            'music-search'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0;
                } else {
                    element.value = '';
                }
            }
        });
        
        this.filteredTracks = [...this.tracks];
        this.renderTracks();
    }
    
    renderTracks() {
        const container = document.getElementById('music-grid');
        console.log('renderTracks called - container:', container);
        console.log('filteredTracks length:', this.filteredTracks.length);
        
        if (!container) {
            console.error('Music grid container not found!');
            return;
        }
        
        if (this.filteredTracks.length === 0) {
            console.log('No filtered tracks to display');
            container.innerHTML = '<div class="music-error">該当する楽曲が見つかりませんでした。</div>';
            return;
        }
        
        console.log('Rendering tracks...');
        container.innerHTML = this.filteredTracks.map(track => this.createTrackCard(track)).join('');
        
        // イベントリスナーを追加
        this.attachTrackEventListeners();
    }
    
    createTrackCard(track) {
        const tagsHtml = track.tags?.map(tag => 
            `<span class="music-tag">${tag}</span>`
        ).join('') || '';
        
        return `
            <div class="music-card" data-track-id="${track.id}">
                <div class="music-card-cover">
                    <img src="${track.coverImage}" alt="${track.title}" class="music-card-image" loading="lazy">
                    <div class="music-card-play-overlay">
                        <button class="music-card-play-btn" data-track-id="${track.id}" title="楽曲を再生">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="music-card-content">
                    <h3 class="music-card-title">${track.title}</h3>
                    <p class="music-card-artist">${track.artist}</p>
                    <div class="music-card-info">
                        <span>${track.duration}</span>
                        <span>${track.genre || ''}</span>
                    </div>
                    <div class="music-card-tags">
                        ${tagsHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    attachTrackEventListeners() {
        // カードクリックでモーダル表示
        document.querySelectorAll('.music-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.music-card-play-btn')) return;
                
                const trackId = card.dataset.trackId;
                this.showTrackModal(trackId);
            });
        });
        
        // 再生ボタンクリック
        document.querySelectorAll('.music-card-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const trackId = btn.dataset.trackId;
                this.toggleTrackPlayback(trackId);
            });
        });
    }
    
    toggleTrackPlayback(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track || !track.previewUrl) return;
        
        if (this.currentTrack?.id === trackId && this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack(track);
        }
    }
    
    playTrack(track) {
        if (!track.previewUrl) return;
        
        // 既存のオーディオを停止
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        
        this.audio = new Audio(track.previewUrl);
        this.currentTrack = track;
        
        this.audio.addEventListener('loadstart', () => {
            console.log(`楽曲を読み込み中: ${track.title}`);
        });
        
        this.audio.addEventListener('canplay', () => {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updatePlaybackUI();
                console.log(`楽曲を再生中: ${track.title}`);
            }).catch(error => {
                console.error('再生エラー:', error);
                this.showError('楽曲の再生に失敗しました。');
            });
        });
        
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlaybackUI();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('オーディオエラー:', e);
            this.showError('楽曲の読み込みに失敗しました。');
        });
    }
    
    pauseTrack() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlaybackUI();
        }
    }
    
    updatePlaybackUI() {
        // カード内の再生ボタンとカード自体を更新
        document.querySelectorAll('.music-card').forEach(card => {
            const playBtn = card.querySelector('.music-card-play-btn');
            if (playBtn) {
                const trackId = playBtn.dataset.trackId;
                const isCurrentTrack = this.currentTrack?.id === trackId;
                const isPlaying = isCurrentTrack && this.isPlaying;
                
                // カードに playing クラスを追加/削除
                card.classList.toggle('playing', isPlaying);
                
                // 再生ボタンのアイコンを更新
                playBtn.innerHTML = isPlaying ? 
                    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' :
                    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            }
        });
        
        // モーダル内の再生ボタンとモーダル自体も更新
        const modal = document.getElementById('music-modal');
        const modalPlayBtn = document.getElementById('music-modal-play-btn');
        if (modalPlayBtn && modal) {
            const isCurrentModalTrack = modalPlayBtn.dataset.trackId === this.currentTrack?.id;
            const isModalPlaying = isCurrentModalTrack && this.isPlaying;
            
            // モーダルに playing クラスを追加/削除
            modal.classList.toggle('playing', isModalPlaying);
            modalPlayBtn.classList.toggle('playing', isModalPlaying);
        }
    }
    
    setupMusicModal() {
        const modal = document.getElementById('music-modal');
        const closeBtn = document.querySelector('.music-modal-close');
        const overlay = document.querySelector('.music-modal-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideMusicModal());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.hideMusicModal());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.hideMusicModal();
            }
        });
    }
    
    showTrackModal(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        const modal = document.getElementById('music-modal');
        if (!modal) return;
        
        // モーダル内容を更新
        this.populateModalContent(track);
        
        // モーダル表示
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // フォーカス管理
        setTimeout(() => {
            const closeBtn = modal.querySelector('.music-modal-close');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }
    
    populateModalContent(track) {
        // 基本情報
        this.setElementContent('music-modal-image', { src: track.coverImage, alt: track.title });
        this.setElementContent('music-modal-title', track.title);
        this.setElementContent('music-modal-artist', track.artist);
        this.setElementContent('music-modal-duration', track.duration);
        this.setElementContent('music-modal-genre', track.genre || '');
        this.setElementContent('music-modal-mood', track.mood || '');
        this.setElementContent('music-modal-description', track.description || '');
        
        // タグ
        const tagsContainer = document.getElementById('music-modal-tags-container');
        if (tagsContainer && track.tags) {
            tagsContainer.innerHTML = track.tags.map(tag => 
                `<span class="music-tag">${tag}</span>`
            ).join('');
        }
        
        // 歌詞
        const lyricsSection = document.getElementById('music-modal-lyrics-section');
        const lyricsElement = document.getElementById('music-modal-lyrics');
        if (track.lyrics && track.lyrics.trim() !== '' && !track.lyrics.includes('インストゥルメンタルのため歌詞はありません')) {
            // /n を <br> に変換して改行を正しく表示
            const formattedLyrics = track.lyrics.replace(/\/n/g, '<br>');
            lyricsElement.innerHTML = formattedLyrics;
            lyricsSection.style.display = 'block';
        } else {
            lyricsSection.style.display = 'none';
        }
        
        // 制作ノート
        const notesSection = document.getElementById('music-modal-notes-section');
        const notesElement = document.getElementById('music-modal-notes');
        if (track.productionNotes) {
            notesElement.textContent = track.productionNotes;
            notesSection.style.display = 'block';
        } else {
            notesSection.style.display = 'none';
        }
        
        // YouTube
        this.setupYouTubeSection(track);
        
        // アクションボタン
        this.setupActionButtons(track);
        
        // モーダル内再生ボタン
        this.setupModalPlayButton(track);
    }
    
    setupYouTubeSection(track) {
        const youtubeSection = document.getElementById('music-modal-youtube-section');
        const youtubePlayer = document.getElementById('music-modal-youtube-player');
        const youtubeLink = document.getElementById('music-modal-youtube-link');
        
        if (track.youtubeUrl) {
            const videoId = this.extractYouTubeVideoId(track.youtubeUrl);
            if (videoId) {
                youtubePlayer.innerHTML = `
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
                youtubeLink.href = track.youtubeUrl;
                youtubeSection.style.display = 'block';
            } else {
                youtubeSection.style.display = 'none';
            }
        } else {
            youtubeSection.style.display = 'none';
        }
    }
    
    extractYouTubeVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    
    setupActionButtons(track) {
        const purchaseLink = document.getElementById('music-modal-purchase-link');
        if (purchaseLink) {
            if (track.purchaseUrl) {
                purchaseLink.href = track.purchaseUrl;
                purchaseLink.style.display = 'flex';
            } else {
                purchaseLink.style.display = 'none';
            }
        }
        
        const youtubeLink = document.getElementById('music-modal-youtube-link');
        if (youtubeLink) {
            if (track.youtubeUrl) {
                youtubeLink.href = track.youtubeUrl;
                youtubeLink.style.display = 'flex';
            } else {
                youtubeLink.style.display = 'none';
            }
        }
    }
    
    setupModalPlayButton(track) {
        const playBtn = document.getElementById('music-modal-play-btn');
        if (!playBtn) return;
        
        playBtn.dataset.trackId = track.id;
        
        // 既存のイベントリスナーを削除
        const newBtn = playBtn.cloneNode(true);
        playBtn.parentNode.replaceChild(newBtn, playBtn);
        
        // 新しいイベントリスナーを追加
        newBtn.addEventListener('click', () => {
            this.toggleTrackPlayback(track.id);
        });
        
        // 初期状態を設定
        const isCurrentTrack = this.currentTrack?.id === track.id;
        newBtn.classList.toggle('playing', isCurrentTrack && this.isPlaying);
    }
    
    hideMusicModal() {
        const modal = document.getElementById('music-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }
    }
    
    setElementContent(id, content) {
        const element = document.getElementById(id);
        if (!element) return;
        
        if (typeof content === 'object' && content.src) {
            // 画像要素の場合
            element.src = content.src;
            element.alt = content.alt || '';
        } else {
            element.textContent = content;
        }
    }
    
    showLoading() {
        const loadingElement = document.getElementById('music-loading');
        const gridElement = document.getElementById('music-grid');
        const errorElement = document.getElementById('music-error');
        
        if (loadingElement) loadingElement.classList.remove('hidden');
        if (gridElement) gridElement.classList.add('hidden');
        if (errorElement) errorElement.classList.add('hidden');
    }
    
    hideLoading() {
        const loadingElement = document.getElementById('music-loading');
        const gridElement = document.getElementById('music-grid');
        
        if (loadingElement) loadingElement.classList.add('hidden');
        if (gridElement) gridElement.classList.remove('hidden');
    }
    
    showError(message) {
        const loadingElement = document.getElementById('music-loading');
        const gridElement = document.getElementById('music-grid');
        const errorElement = document.getElementById('music-error');
        
        if (loadingElement) loadingElement.classList.add('hidden');
        if (gridElement) gridElement.classList.add('hidden');
        if (errorElement) {
            errorElement.classList.remove('hidden');
            errorElement.textContent = message;
        }
    }
}
