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
        this.mainHeader = document.getElementById('main-header');
        this.worldviewBtn = document.getElementById('btn-worldview');
        this.charactersBtn = document.getElementById('btn-characters');
        
        this.worldviewContent = document.getElementById('content-worldview');
        this.charactersContent = document.getElementById('content-characters');
        this.aegisContent = document.getElementById('content-aegis');
        this.gehennaContent = document.getElementById('content-gehenna');

        this.allContent = [
            this.worldviewContent, 
            this.charactersContent, 
            this.aegisContent, 
            this.gehennaContent
        ];
    }

    initEventListeners() {
        // Event Listeners for main tabs
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
        
        // Show/hide main header and nav
        if (contentToShow === this.worldviewContent || contentToShow === this.charactersContent) {
            this.mainHeader.classList.remove('hidden');
        } else {
            this.mainHeader.classList.add('hidden');
        }
    }

    setActiveTab(activeBtn) {
        // Remove active class from all buttons
        this.worldviewBtn.classList.remove('active');
        this.charactersBtn.classList.remove('active');
        
        // Add active class to clicked button
        activeBtn.classList.add('active');
    }

    initializeApp() {
        // Initial state - show worldview content
        this.showContent(this.worldviewContent);
        this.setActiveTab(this.worldviewBtn);
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
