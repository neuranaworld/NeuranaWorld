const oyunlar = [
    // Aksiyon
    { id: 'breakout', name: 'Breakout', icon: '🧱', category: 'Aksiyon', path: 'Oyunlar/Aksiyon/index_BreakoutGame.html', shortDesc: 'Klasik tuğla kırma oyunu' },
    { id: 'cityrunner', name: 'City Runner', icon: '🏃', category: 'Aksiyon', path: 'Oyunlar/Aksiyon/index_CityRunner.html', shortDesc: 'Şehirde koşu macerası' },
    { id: 'dart', name: 'Dart', icon: '🎯', category: 'Aksiyon', path: 'Oyunlar/Aksiyon/index_DartGame.html', shortDesc: 'Dart atma oyunu' },
    { id: 'flappy', name: 'Flappy Bird', icon: '🐦', category: 'Aksiyon', path: 'Oyunlar/Aksiyon/index_FlappyBird.html', shortDesc: 'Uçan kuş oyunu' },
    { id: 'pong', name: 'Pong', icon: '🏓', category: 'Aksiyon', path: 'Oyunlar/Aksiyon/index_PongGame.html', shortDesc: 'Klasik ping pong' },
    { id: 'skyjumper', name: 'Sky Jumper', icon: '☁️', category: 'Aksiyon', path: 'Oyunlar/Aksiyon/index_SkyJumper.html', shortDesc: 'Gökyüzünde zıplama' },
    { id: 'snake', name: 'Snake', icon: '🐍', category: 'Aksiyon', path: 'Oyunlar/Aksiyon/index_SnakeGame.html', shortDesc: 'Klasik yılan oyunu' },

    // Bulmaca
    { id: 'cizim', name: 'Çizim Oyunu', icon: '🎨', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_CizimGame.html', shortDesc: 'Çizim ve tahmin' },
    { id: '2048', name: '2048', icon: '🔢', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_Game2048.html', shortDesc: 'Sayı birleştirme' },
    { id: 'jigsaw', name: 'Yapboz', icon: '🧩', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_JigsawPuzzle.html', shortDesc: 'Jigsaw puzzle' },
    { id: 'memory', name: 'Hafıza', icon: '🃏', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_MemoryGame.html', shortDesc: 'Hafıza kartları' },
    { id: 'minesweeper', name: 'Mayın Tarlası', icon: '💣', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_MinesweeperGame.html', shortDesc: 'Klasik mayın tarlası' },
    { id: 'nonogram', name: 'Nonogram', icon: '📊', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_NonogramGame.html', shortDesc: 'Mantık bulmacası' },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_PuzzleGame.html', shortDesc: 'Klasik puzzle' },
    { id: 'seker', name: 'Şeker Eşleştirme', icon: '🍬', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_SekerEslestirmece.html', shortDesc: 'Şekerleri eşleştir' },
    { id: 'tetris', name: 'Tetris', icon: '🟦', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_TetrisGame.html', shortDesc: 'Klasik Tetris' },
    { id: 'wordsearch', name: 'Kelime Arama', icon: '🔤', category: 'Bulmaca', path: 'Oyunlar/Bulmaca/index_WordSearchGame.html', shortDesc: 'Kelimeleri bul' },

    // Strateji
    { id: 'batak', name: 'Batak', icon: '🃏', category: 'Strateji', path: 'Oyunlar/Strateji/index_BatakGame.html', shortDesc: 'Türk kart oyunu' },
    { id: 'cards', name: 'Kart Oyunları', icon: '🎴', category: 'Strateji', path: 'Oyunlar/Strateji/index_CardGames.html', shortDesc: 'Çeşitli kart oyunları' },
    { id: 'connect4', name: 'Connect Four', icon: '🔴', category: 'Strateji', path: 'Oyunlar/Strateji/index_ConnectFourGame.html', shortDesc: 'Dörtlü bağla' },
    { id: 'okey101', name: 'Okey 101', icon: '🎲', category: 'Strateji', path: 'Oyunlar/Strateji/index_OkeyGame101.html', shortDesc: 'Okey 101 oyunu' },
    { id: 'okeypro', name: 'Okey Pro', icon: '🎲', category: 'Strateji', path: 'Oyunlar/Strateji/index_OkeyPro.html', shortDesc: 'Profesyonel Okey' },
    { id: 'poker', name: 'Poker', icon: '♠️', category: 'Strateji', path: 'Oyunlar/Strateji/index_PokerGame.html', shortDesc: 'Poker oyunu' },
    { id: 'tictactoe', name: 'XOX', icon: '❌', category: 'Strateji', path: 'Oyunlar/Strateji/index_TicTacToeGame.html', shortDesc: 'Tic Tac Toe' },

    // Macera
    { id: 'maze', name: 'Labirent', icon: '🌀', category: 'Macera', path: 'Oyunlar/Macera/index_MazeGame.html', shortDesc: 'Labirent bulmacası' }
];

const uygulamalar = [
    // Araçlar
    { id: 'calculator', name: 'Hesap Makinesi', icon: '🧮', category: 'Araçlar', path: '#', shortDesc: 'Gelişmiş hesap makinesi', comingSoon: true },
    { id: 'converter', name: 'Birim Dönüştürücü', icon: '🔄', category: 'Araçlar', path: '#', shortDesc: 'Birim çevirici', comingSoon: true },

    // Eğitim
    { id: 'math', name: 'Dört İşlem', icon: '➕', category: 'Eğitim', path: '#', shortDesc: 'Matematik pratiği', comingSoon: true },

    // Müzik
    { id: 'piano', name: 'Müzik Klavyesi', icon: '🎹', category: 'Müzik', path: '#', shortDesc: 'Sanal piyano', comingSoon: true },

    // Zaman
    { id: 'alarm', name: 'Çalar Saat', icon: '⏰', category: 'Zaman', path: '#', shortDesc: 'Alarm ve zamanlayıcı', comingSoon: true },
    { id: 'stopwatch', name: 'Kronometre', icon: '⏱️', category: 'Zaman', path: '#', shortDesc: 'Zaman ölçücü', comingSoon: true },
    { id: 'recorder', name: 'Ses Kayıt', icon: '🎙️', category: 'Zaman', path: '#', shortDesc: 'Ses kaydedici', comingSoon: true },

    // Çizim
    { id: 'draw', name: '2D Grafik Çizimi', icon: '✏️', category: 'Çizim', path: '#', shortDesc: 'Çizim uygulaması', comingSoon: true },

    // Sosyal
    { id: 'neuranaverse', name: 'Neuranaverse', icon: '🌐', category: 'Sosyal', path: '#', shortDesc: 'Metaverse platformu', comingSoon: true }
];

// State Management
let currentFilter = 'all';
let currentSearchTerm = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadAllCards();
    setupSmoothScroll();
    setupFilterButtons();
    setupSearchFunctionality();
    setupScrollToTop();
    setupMobileMenu();
    setupCategoryCards();
    setupClearSearch();
    setupCounterAnimations();
    setupIntersectionObserver();
    updateStats();
}

function loadAllCards() {
    loadCards('oyunlar', oyunlar);
    loadCards('uygulamalar', uygulamalar);
}

function loadCards(type, items) {
    const grid = document.getElementById(`${type}-grid`);

    if (!grid) {
        console.error(`Grid not found: ${type}-grid`);
        return;
    }

    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Yakında yeni içerikler eklenecek...</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const card = createCard(item);
        grid.appendChild(card);
    });
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-name', item.name.toLowerCase());

    const comingSoonBadge = item.comingSoon ? '<span class="coming-soon-badge">Yakında</span>' : '';
    const buttonText = item.comingSoon ? 'Yakında' : 'Oyna';
    const buttonDisabled = item.comingSoon ? 'disabled' : '';

    card.innerHTML = `
        <div class="card-header">
            <span class="card-icon" role="img" aria-label="${item.name}">${item.icon}</span>
            <h3>${item.name}</h3>
        </div>
        <span class="card-category">${item.category}</span>
        ${comingSoonBadge}
        <p class="card-description">${item.shortDesc}</p>
        <a href="${item.path}" class="card-btn ${buttonDisabled}"
           ${item.comingSoon ? 'onclick="return false;"' : 'target="_blank"'}
           aria-label="${buttonText} - ${item.name}">
            ${buttonText}
        </a>
    `;

    return card;
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Apply filter
            filterCards();
        });
    });
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearchTerm = e.target.value.toLowerCase();
            filterCards();
        });
    }
}

function filterCards() {
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(card => {
        const category = card.getAttribute('data-category').toLowerCase();
        const name = card.getAttribute('data-name');

        const matchesFilter = currentFilter === 'all' || category === currentFilter.toLowerCase();
        const matchesSearch = currentSearchTerm === '' || name.includes(currentSearchTerm);

        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateVisibleCount();
}


function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');

    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function updateStats() {
    // Update game count
    const oyunlarCount = document.getElementById('oyunlar-count');
    if (oyunlarCount) {
        oyunlarCount.textContent = oyunlar.length;
    }

    // Update app count
    const uygulamalarCount = document.getElementById('uygulamalar-count');
    if (uygulamalarCount) {
        uygulamalarCount.textContent = uygulamalar.length;
    }
}

// Error handling for broken links
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'A') {
        console.error('Link error:', e.target.href);
    }
}, true);

// Mobile Menu
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // Close menu when clicking on a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// Category Cards
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        const link = card.querySelector('.category-link');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.getAttribute('data-filter');

                // Update filter
                currentFilter = filter;

                // Update active button
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-filter') === filter) {
                        btn.classList.add('active');
                    }
                });

                // Apply filter
                filterCards();

                // Scroll to games section
                document.getElementById('oyunlar').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    });
}

// Clear Search
function setupClearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');

    if (searchInput && clearBtn) {
        searchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearBtn.classList.add('visible');
            } else {
                clearBtn.classList.remove('visible');
            }
        });

        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            currentSearchTerm = '';
            clearBtn.classList.remove('visible');
            filterCards();
            searchInput.focus();
        });
    }
}

// Counter Animations
function setupCounterAnimations() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.section');
    const statCards = document.querySelectorAll('.stat-card');
    const categoryCards = document.querySelectorAll('.category-card');

    [...cards, ...sections, ...statCards, ...categoryCards].forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Update visible counts
function updateVisibleCount() {
    const sections = ['oyunlar', 'uygulamalar'];

    sections.forEach(section => {
        const grid = document.getElementById(`${section}-grid`);
        if (!grid) return;

        const visibleCards = grid.querySelectorAll('.card:not([style*="display: none"])');
        const countElement = document.getElementById(`visible-${section}-count`);

        if (countElement) {
            countElement.textContent = visibleCards.length;
        }

        // Show empty message if no cards visible
        let emptyMsg = grid.querySelector('.no-results');
        if (visibleCards.length === 0 && currentSearchTerm) {
            if (!emptyMsg) {
                emptyMsg = document.createElement('div');
                emptyMsg.className = 'no-results';
                emptyMsg.innerHTML = '<p>🔍 Aradığınız kriterlere uygun içerik bulunamadı.</p>';
                grid.appendChild(emptyMsg);
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    });
}

// Enhanced updateStats
function updateStats() {
    // Update game count
    const oyunlarCount = document.getElementById('oyunlar-count');
    if (oyunlarCount) {
        oyunlarCount.textContent = oyunlar.length;
    }

    // Update app count
    const uygulamalarCount = document.getElementById('uygulamalar-count');
    if (uygulamalarCount) {
        uygulamalarCount.textContent = uygulamalar.length;
    }

    // Update hero stats
    const heroGames = document.getElementById('hero-games');
    const heroApps = document.getElementById('hero-apps');
    if (heroGames) heroGames.textContent = oyunlar.length;
    if (heroApps) heroApps.textContent = uygulamalar.length;

    // Update visible counts
    updateVisibleCount();
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { oyunlar, uygulamalar, createCard };
}
