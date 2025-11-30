// Jigsaw Puzzle Oyun Konfigürasyonu
export const PUZZLE_SIZES = {
  EASY: { grid: 3, name: 'Kolay (3×3)', pieces: 9 },
  MEDIUM: { grid: 4, name: 'Orta (4×4)', pieces: 16 },
  HARD: { grid: 5, name: 'Zor (5×5)', pieces: 25 },
  EXPERT: { grid: 6, name: 'Uzman (6×6)', pieces: 36 },
};

export const PUZZLE_IMAGES = [
  { id: 1, name: 'Doğa', url: 'https://picsum.photos/600/600?nature', category: 'nature' },
  { id: 2, name: 'Şehir', url: 'https://picsum.photos/600/600?city', category: 'city' },
  { id: 3, name: 'Hayvan', url: 'https://picsum.photos/600/600?animal', category: 'animal' },
  { id: 4, name: 'Mimari', url: 'https://picsum.photos/600/600?architecture', category: 'architecture' },
  { id: 5, name: 'Soyut', url: 'https://picsum.photos/600/600?abstract', category: 'abstract' },
];

export const PIECE_SIZE = 100; // pixels
