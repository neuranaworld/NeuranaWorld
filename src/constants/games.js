// Oyun verileri
export const oyunlar = [
  // Aksiyon
  { id: 'breakout', name: 'Breakout', icon: '🧱', category: 'Aksiyon', route: '/oyunlar/breakout', shortDesc: 'Klasik tuğla kırma oyunu', color: '#FF6B6B' },
  { id: 'cityrunner', name: 'City Runner', icon: '🏃', category: 'Aksiyon', route: '/oyunlar/cityrunner', shortDesc: 'Şehirde hızlı koşu', color: '#4ECDC4' },
  { id: 'dart', name: 'Dart', icon: '🎯', category: 'Aksiyon', route: '/oyunlar/dart', shortDesc: 'Hedefi vurun', color: '#FF8C42' },
  { id: 'flappy', name: 'Flappy Bird', icon: '🐦', category: 'Aksiyon', route: '/oyunlar/flappybird', shortDesc: 'Uçan kuş macerası', color: '#95E1D3' },
  { id: 'pong', name: 'Pong', icon: '🏓', category: 'Aksiyon', route: '/oyunlar/pong', shortDesc: 'Klasik pong oyunu', color: '#F38181' },
  { id: 'skyjumper', name: 'Sky Jumper', icon: '☁️', category: 'Aksiyon', route: '/oyunlar/skyjumper', shortDesc: 'Gökyüzünde zıpla', color: '#A8E6CF' },
  { id: 'snake', name: 'Snake', icon: '🐍', category: 'Aksiyon', route: '/oyunlar/snake', shortDesc: 'Nostaljik yılan oyunu', color: '#78C850' },

  // Bulmaca
  { id: 'cizim', name: 'Çizim Oyunu', icon: '🎨', category: 'Bulmaca', route: '/oyunlar/cizim', shortDesc: 'Çizerek tahmin et', color: '#FFD93D' },
  { id: '2048', name: '2048', icon: '🔢', category: 'Bulmaca', route: '/oyunlar/2048', shortDesc: 'Sayıları birleştir', color: '#EDC7B7' },
  { id: 'jigsaw', name: 'Yapboz', icon: '🧩', category: 'Bulmaca', route: '/oyunlar/jigsaw', shortDesc: 'Resmi tamamla', color: '#B4A7D6' },
  { id: 'memory', name: 'Hafıza', icon: '🃏', category: 'Bulmaca', route: '/oyunlar/memory', shortDesc: 'Kartları eşleştir', color: '#BAB2B5' },
  { id: 'minesweeper', name: 'Mayın Tarlası', icon: '💣', category: 'Bulmaca', route: '/oyunlar/minesweeper', shortDesc: 'Mayınları bul', color: '#8E9AAF' },
  { id: 'nonogram', name: 'Nonogram', icon: '📊', category: 'Bulmaca', route: '/oyunlar/nonogram', shortDesc: 'Mantık bulmacası', color: '#DEE2FF' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩', category: 'Bulmaca', route: '/oyunlar/puzzle', shortDesc: 'Kaydırmalı puzzle', color: '#9BA3EB' },
  { id: 'seker', name: 'Şeker Eşleştirme', icon: '🍬', category: 'Bulmaca', route: '/oyunlar/seker', shortDesc: 'Şekerleri eşleştir', color: '#FF99C8' },
  { id: 'tetris', name: 'Tetris', icon: '🟦', category: 'Bulmaca', route: '/oyunlar/tetris', shortDesc: 'Klasik Tetris', color: '#A7C7E7' },
  { id: 'wordsearch', name: 'Kelime Arama', icon: '🔤', category: 'Bulmaca', route: '/oyunlar/wordsearch', shortDesc: 'Kelimeleri bul', color: '#FFB7C3' },

  // Strateji
  { id: 'batak', name: 'Batak', icon: '🃏', category: 'Strateji', route: '/oyunlar/batak', shortDesc: 'Türk kart oyunu', color: '#C1666B' },
  { id: 'cards', name: 'Kart Oyunları', icon: '🎴', category: 'Strateji', route: '/oyunlar/cards', shortDesc: 'Çeşitli kart oyunları', color: '#D4A5A5' },
  { id: 'connect4', name: 'Connect Four', icon: '🔴', category: 'Strateji', route: '/oyunlar/connect4', shortDesc: 'Dört taş bir sıra', color: '#E57373' },
  { id: 'okey101', name: 'Okey 101', icon: '🎲', category: 'Strateji', route: '/oyunlar/okey101', shortDesc: 'Klasik Okey 101', color: '#8D6E63' },
  { id: 'okeypro', name: 'Okey Pro', icon: '🎲', category: 'Strateji', route: '/oyunlar/okeypro', shortDesc: 'Profesyonel Okey', color: '#A1887F' },
  { id: 'poker', name: 'Poker', icon: '♠️', category: 'Strateji', route: '/oyunlar/poker', shortDesc: 'Texas Holdem Poker', color: '#5D4037' },
  { id: 'tictactoe', name: 'XOX', icon: '❌', category: 'Strateji', route: '/oyunlar/tictactoe', shortDesc: 'Tic Tac Toe', color: '#90A4AE' },

  // Macera
  { id: 'maze', name: 'Labirent', icon: '🌀', category: 'Macera', route: '/oyunlar/maze', shortDesc: 'Çıkışı bul', color: '#7E57C2' }
]

// Uygulama verileri
export const uygulamalar = [
  { id: 'calculator', name: 'Hesap Makinesi', icon: '🧮', category: 'Araçlar', shortDesc: 'Gelişmiş hesap makinesi', comingSoon: true, color: '#42A5F5' },
  { id: 'converter', name: 'Birim Dönüştürücü', icon: '🔄', category: 'Araçlar', shortDesc: 'Birim çevirici', comingSoon: true, color: '#66BB6A' },
  { id: 'math', name: 'Dört İşlem', icon: '➕', category: 'Eğitim', shortDesc: 'Matematik pratiği', comingSoon: true, color: '#FFA726' },
  { id: 'piano', name: 'Müzik Klavyesi', icon: '🎹', category: 'Müzik', shortDesc: 'Sanal piyano', comingSoon: true, color: '#AB47BC' },
  { id: 'alarm', name: 'Çalar Saat', icon: '⏰', category: 'Zaman', shortDesc: 'Alarm kur', comingSoon: true, color: '#EF5350' },
  { id: 'stopwatch', name: 'Kronometre', icon: '⏱️', category: 'Zaman', shortDesc: 'Zaman ölçücü', comingSoon: true, color: '#26C6DA' },
  { id: 'recorder', name: 'Ses Kayıt', icon: '🎙️', category: 'Zaman', shortDesc: 'Ses kaydedici', comingSoon: true, color: '#EC407A' },
  { id: 'draw', name: '2D Grafik Çizimi', icon: '✏️', category: 'Çizim', shortDesc: 'Çizim uygulaması', comingSoon: true, color: '#5C6BC0' },
  { id: 'neuranaverse', name: 'Neuranaverse', icon: '🌐', category: 'Sosyal', shortDesc: 'Metaverse platformu', comingSoon: true, color: '#8E24AA' }
]

// Kategori ikonları
export const categoryIcons = {
  'Aksiyon': '⚡',
  'Bulmaca': '🧩',
  'Strateji': '♟️',
  'Macera': '🌀',
  'Kelime': '🔤',
  'Spor': '⚽',
  'Araçlar': '🛠️',
  'Eğitim': '📚',
  'Müzik': '🎵',
  'Zaman': '⏰',
  'Çizim': '🎨',
  'Sosyal': '👥'
}

// Kategori renkleri
export const categoryColors = {
  'Aksiyon': '#FF6B6B',
  'Bulmaca': '#4ECDC4',
  'Strateji': '#95E1D3',
  'Macera': '#7E57C2',
  'Kelime': '#FFD93D',
  'Spor': '#78C850'
}
