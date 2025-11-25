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

const uygulamalar = [];

document.addEventListener('DOMContentLoaded', function() {
    loadCards();
    setupSmoothScroll();
});

function loadCards() {
    const oyunlarGrid = document.getElementById('oyunlar-grid');
    
    oyunlar.forEach(oyun => {
        const card = createCard(oyun);
        oyunlarGrid.appendChild(card);
    });
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <span class="card-icon">${item.icon}</span>
            <h3>${item.name}</h3>
        </div>
        <span class="card-category">${item.category}</span>
        <p class="card-description">${item.shortDesc}</p>
        <a href="${item.path}" class="card-btn" target="_blank">Oyna</a>
    `;
    return card;
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