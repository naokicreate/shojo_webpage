/**
 * メインアプリケーションロジック
 */
class ProjectGenesisApp {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.initializeApp();
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
}

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
    new ProjectGenesisApp();
});
