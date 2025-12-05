"""
101 Okey Oyun Motoru
- Resmi 101 Okey kuralları
- 4 oyuncu (1 kullanıcı + 3 AI)
- Taş dağıtımı ve oyun akışı
"""
import random
import uuid
from typing import List, Dict, Optional, Tuple
from datetime import datetime

class OkeyTile:
    """Okey taşı sınıfı"""
    def __init__(self, color: str, number: int, is_fake: bool = False):
        self.color = color  # "red", "blue", "black", "yellow"
        self.number = number  # 1-13
        self.is_fake = is_fake  # Sahte okey mi?
        self.id = str(uuid.uuid4())
    
    def to_dict(self):
        return {
            "id": self.id,
            "color": self.color,
            "number": self.number,
            "is_fake": self.is_fake
        }
    
    def __repr__(self):
        fake_marker = "F" if self.is_fake else ""
        return f"{self.color[0].upper()}{self.number}{fake_marker}"
    
    def __eq__(self, other):
        if not isinstance(other, OkeyTile):
            return False
        return self.color == other.color and self.number == other.number


class OkeyGame:
    """101 Okey oyun mantığı - Tam kurallar"""
    
    COLORS = ["red", "blue", "black", "yellow"]
    
    def __init__(self, game_id: str, user_id: str):
        self.game_id = game_id
        self.user_id = user_id
        self.players = {
            "user": {
                "id": user_id, 
                "name": "Sen", 
                "tiles": [], 
                "racks": [[], [], []],  # 3 ıstaka
                "score": 0,
                "has_opened": False,  # Açtı mı?
                "must_open": False,  # Yandan aldıysa açmak zorunda
                "position": "bottom"
            },
            "ai1": {
                "id": "ai1", 
                "name": "AI Oyuncu 1", 
                "tiles": [], 
                "racks": [[], [], []],
                "score": 0,
                "has_opened": False,
                "must_open": False,
                "position": "right"
            },
            "ai2": {
                "id": "ai2", 
                "name": "AI Oyuncu 2", 
                "tiles": [], 
                "racks": [[], [], []],
                "score": 0,
                "has_opened": False,
                "must_open": False,
                "position": "top"
            },
            "ai3": {
                "id": "ai3", 
                "name": "AI Oyuncu 3", 
                "tiles": [], 
                "racks": [[], [], []],
                "score": 0,
                "has_opened": False,
                "must_open": False,
                "position": "left"
            }
        }
        self.deck = []
        self.discard_pile = []
        self.okey_tile = None
        self.indicator_tile = None
        self.current_turn = "user"
        self.round_number = 1
        self.game_status = "waiting"  # waiting, playing, finished
        self.winner = None
        self.created_at = datetime.utcnow()
        
    def create_deck(self):
        """106 taşlı okey destesi oluştur (2 set)"""
        self.deck = []
        
        # Her renkten 1-13 arası 2 set
        for _ in range(2):
            for color in self.COLORS:
                for number in range(1, 14):
                    self.deck.append(OkeyTile(color, number))
        
        # 2 sahte okey
        self.deck.append(OkeyTile("red", 0, is_fake=True))
        self.deck.append(OkeyTile("blue", 0, is_fake=True))
        
        # Karıştır
        random.shuffle(self.deck)
    
    def determine_okey(self):
        """Gösterge taşını belirle ve okey'i hesapla"""
        # En üstten bir taş gösterge olarak seç
        self.indicator_tile = self.deck.pop(0)
        
        # Okey, göstergenin bir sonraki sayısı, aynı renk
        okey_number = (self.indicator_tile.number % 13) + 1
        self.okey_tile = OkeyTile(self.indicator_tile.color, okey_number)
        
        return self.indicator_tile.to_dict()
    
    def distribute_tiles(self):
        """Her oyuncuya 21 taş dağıt - 101 Okey gerçek kuralları"""
        # Tüm oyunculara 21'er taş
        for player_key in self.players:
            self.players[player_key]["tiles"] = []
            
            for _ in range(21):
                if self.deck:
                    tile = self.deck.pop(0)
                    self.players[player_key]["tiles"].append(tile)
    
    def start_game(self):
        """Oyunu başlat"""
        self.create_deck()
        indicator = self.determine_okey()
        self.distribute_tiles()
        
        # İlk taşı atma yığınına koy
        if self.deck:
            self.discard_pile.append(self.deck.pop(0))
        
        self.game_status = "playing"
        self.current_turn = "user"
        
        return {
            "indicator": indicator,
            "okey": self.okey_tile.to_dict(),
            "user_tiles": [t.to_dict() for t in self.players["user"]["tiles"]],
            "discard_pile_top": self.discard_pile[-1].to_dict() if self.discard_pile else None
        }
        

    def calculate_tile_value(self, tile: OkeyTile) -> int:
        """Taşın puan değerini hesapla"""
        if tile.is_fake:
            return 0
        # Okey joker olarak kullanılabilir
        if self.is_okey(tile):
            return 0  # Okey joker
        return tile.number
    
    def is_okey(self, tile: OkeyTile) -> bool:
        """Taş okey mi?"""
        if not self.okey_tile:
            return False
        return tile.color == self.okey_tile.color and tile.number == self.okey_tile.number
    
    def check_sequence(self, tiles: List[OkeyTile]) -> bool:
        """Seri kontrolü - Aynı renk ardışık sayılar"""
        if len(tiles) < 3:
            return False
        
        # Aynı renk mi?
        if len(set(t.color for t in tiles)) > 1:
            return False
        
        # Sayıları sırala
        numbers = sorted([t.number for t in tiles])
        
        # Ardışık mı?
        for i in range(len(numbers) - 1):
            if numbers[i+1] != numbers[i] + 1:
                return False
        
        return True
    
    def check_set(self, tiles: List[OkeyTile]) -> bool:
        """Çift kontrolü - Aynı sayı farklı renkler"""
        if len(tiles) < 3:
            return False
        
        # Aynı sayı mı?
        if len(set(t.number for t in tiles)) > 1:
            return False
        
        # Farklı renkler mi?
        colors = [t.color for t in tiles]
        if len(colors) != len(set(colors)):
            return False  # Aynı renkten 2 tane olmamalı
        
        return True
    
    def calculate_hand_value(self, tiles: List[OkeyTile]) -> int:
        """Eldeki taşların toplam değerini hesapla"""
        total = 0
        for tile in tiles:
            if not self.is_okey(tile) and not tile.is_fake:
                total += tile.number
        return total
    
    def can_open(self, player_key: str) -> Tuple[bool, int, str]:
        """Oyuncu açabilir mi? (101+ puan VEYA 5+ çift)"""
        player = self.players[player_key]
        tiles = player["tiles"]
        
        # 1. Çift açma kontrolü (5+ çift)
        pairs = self.find_pairs(tiles)
        if len(pairs) >= 5:
            pair_value = sum(self.calculate_tile_value(t) for pair in pairs for t in pair)
            return True, pair_value, "pairs"
        
        # 2. Normal per kontrolü (101+ puan)
        valid_combinations = self.find_valid_combinations(tiles)
        
        if not valid_combinations:
            return False, 0, "none"
        
        # Puan hesapla
        used_tiles = set()
        total_value = 0
        
        for combo in valid_combinations:
            for tile in combo:
                if tile.id not in used_tiles:
                    used_tiles.add(tile.id)
                    total_value += self.calculate_tile_value(tile)
        
        return total_value >= 101, total_value, "normal"
    
    def find_pairs(self, tiles: List[OkeyTile]) -> List[List[OkeyTile]]:
        """Çiftleri bul (aynı sayı, farklı renk, 2'li)"""
        pairs = []
        number_groups = {}
        
        for tile in tiles:
            if tile.number not in number_groups:
                number_groups[tile.number] = []
            number_groups[tile.number].append(tile)
        
        for number, group in number_groups.items():
            # Her sayıdan en fazla 2 taş al (çift için)
            if len(group) >= 2:
                # Farklı renklerden 2'li gruplar oluştur
                for i in range(0, len(group) - 1, 2):
                    if group[i].color != group[i+1].color:
                        pairs.append([group[i], group[i+1]])
        
        return pairs
    
    def find_valid_combinations(self, tiles: List[OkeyTile]) -> List[List[OkeyTile]]:
        """Geçerli kombinasyonları bul (basitleştirilmiş)"""
        combinations = []
        remaining = tiles[:]
        
        # Seri ara
        for color in self.COLORS:
            color_tiles = [t for t in remaining if t.color == color]
            color_tiles.sort(key=lambda x: x.number)
            
            i = 0
            while i < len(color_tiles):
                sequence = [color_tiles[i]]
                j = i + 1
                
                while j < len(color_tiles) and color_tiles[j].number == sequence[-1].number + 1:
                    sequence.append(color_tiles[j])
                    j += 1
                
                if len(sequence) >= 3:
                    combinations.append(sequence)
                    for t in sequence:
                        if t in remaining:
                            remaining.remove(t)
                
                i += 1
        
        # Çift ara
        number_groups = {}
        for tile in remaining:
            if tile.number not in number_groups:
                number_groups[tile.number] = []
            number_groups[tile.number].append(tile)
        
        for number, group in number_groups.items():
            if len(group) >= 3:
                # Farklı renkler mi kontrol et
                colors = [t.color for t in group]
                if len(colors) == len(set(colors)):
                    combinations.append(group[:3])  # İlk 3'ünü al
        
        return combinations
    
    def draw_tile(self, player_key: str, from_discard: bool = False) -> Optional[OkeyTile]:
        """Taş çek - Yandan alırsan açmak zorundasın"""
        if from_discard and self.discard_pile:
            tile = self.discard_pile.pop()
            # Yandan aldı - açma bayrağını set et
            self.players[player_key]["must_open"] = True
        elif self.deck:
            tile = self.deck.pop(0)
        else:
            return None
        
        self.players[player_key]["tiles"].append(tile)
        return tile

    def open_hand(self, player_key: str) -> Dict:
        """Oyuncu elini açar"""
        can_open_status, value, open_type = self.can_open(player_key)
        
        if not can_open_status:
            return {
                "success": False,
                "message": f"Açmak için en az 101 puan veya 5 çift gerekli. Sizde {value} puan var.",
                "value": value,
                "type": open_type
            }
        
        self.players[player_key]["has_opened"] = True
        self.players[player_key]["must_open"] = False  # Açma zorunluluğu kalktı
        self.players[player_key]["open_type"] = open_type  # "normal" veya "pairs"
        
        message = f"Elinizi {value} puanla açtınız!" if open_type == "normal" else f"{len(self.find_pairs(self.players[player_key]['tiles']))} çiftle açtınız!"
        
        return {
            "success": True,
            "message": message,
            "value": value,
            "type": open_type
        }
    
    def add_to_rack(self, player_key: str, rack_index: int, tiles: List[OkeyTile]) -> bool:
        """Istakaya taş ekle"""
        if rack_index < 0 or rack_index > 2:
            return False
        
        player = self.players[player_key]
        
        # Taşları ıstakaya ekle
        player["racks"][rack_index].extend(tiles)
        
        # Taşları elden çıkar
        for tile in tiles:
            for t in player["tiles"]:
                if t.id == tile.id:
                    player["tiles"].remove(t)
                    break
        
        return True
    
    def discard_tile(self, player_key: str, tile_id: str) -> bool:
        """Taş at"""
        player = self.players[player_key]
        
        # Taşı bul
        tile_to_discard = None
        for tile in player["tiles"]:
            if tile.id == tile_id:
                tile_to_discard = tile
                break
        
        if not tile_to_discard:
            return False
        
        # Taşı at
        player["tiles"].remove(tile_to_discard)
        self.discard_pile.append(tile_to_discard)
        
        return True
    
    def check_winning_hand(self, tiles: List[OkeyTile]) -> bool:
        """Kazanan el kontrolü - Basitleştirilmiş"""
        # 101 Okey'de kazanmak için:
        # - 14 taş gruplanmalı (3'lü veya sıra)
        # Bu basit versiyonda sadece taş sayısını kontrol edelim
        # Gerçek implementasyon daha karmaşık
        
        if len(tiles) != 14:
            return False
        
        # Basit kontrol: Tüm taşlar aynı renk veya ardışık
        # Gerçek oyunda kombinasyon kontrolü yapılmalı
        return False  # Şimdilik her zaman False
    
    def ai_play_turn(self, ai_key: str):
        """AI oyuncu sırası - Geliştirilmiş strateji"""
        # AI zorluk seviyelerini belirle
        ai_difficulty = {
            "ai1": "easy",    # Kolay
            "ai2": "medium",  # Orta
            "ai3": "hard"     # Zor
        }
        
        difficulty = ai_difficulty.get(ai_key, "easy")
        player_tiles = self.players[ai_key]["tiles"]
        
        # Desteden mi, yığından mı çekecek?
        from_discard = self._should_draw_from_discard(ai_key, difficulty)
        
        # Taş çek
        drawn_tile = self.draw_tile(ai_key, from_discard)
        
        if not drawn_tile:
            return None
        
        # Hangi taşı atacağını belirle
        tile_to_discard = self._choose_tile_to_discard(ai_key, difficulty)
        
        if tile_to_discard:
            self.discard_tile(ai_key, tile_to_discard.id)
        
        return {
            "action": "play",
            "drawn_from": "discard" if from_discard else "deck",
            "discarded": tile_to_discard.to_dict() if tile_to_discard else None,
            "difficulty": difficulty
        }
    
    def _should_draw_from_discard(self, ai_key: str, difficulty: str) -> bool:
        """Yığından mı çekecek, desteden mi?"""
        if not self.discard_pile:
            return False
        
        discard_top = self.discard_pile[-1]
        player_tiles = self.players[ai_key]["tiles"]
        
        if difficulty == "easy":
            # Kolay: %30 şans rastgele
            return random.random() < 0.3
        
        elif difficulty == "medium":
            # Orta: Aynı renkte taş varsa al
            same_color_count = sum(1 for t in player_tiles if t.color == discard_top.color)
            return same_color_count >= 2 and random.random() < 0.6
        
        else:  # hard
            # Zor: Strateji - aynı renk veya ardışık sayı
            same_color = any(t.color == discard_top.color for t in player_tiles)
            near_number = any(abs(t.number - discard_top.number) <= 1 for t in player_tiles if t.color == discard_top.color)
            
            if same_color or near_number:
                return random.random() < 0.8
            return False
    
    def _choose_tile_to_discard(self, ai_key: str, difficulty: str) -> Optional[OkeyTile]:
        """Hangi taşı atacağını seç"""
        player_tiles = self.players[ai_key]["tiles"]
        
        if not player_tiles:
            return None
        
        if difficulty == "easy":
            # Kolay: Tamamen rastgele
            return random.choice(player_tiles)
        
        elif difficulty == "medium":
            # Orta: Tekli taşları at
            color_counts = {}
            for tile in player_tiles:
                key = tile.color
                color_counts[key] = color_counts.get(key, 0) + 1
            
            # En az olan renkten at
            singles = [t for t in player_tiles if color_counts[t.color] == 1]
            if singles:
                return random.choice(singles)
            return random.choice(player_tiles)
        
        else:  # hard
            # Zor: En düşük değerli ve yalnız taşı at
            tile_values = []
            for tile in player_tiles:
                # Benzer taşları say
                similar_count = sum(1 for t in player_tiles 
                                  if t.color == tile.color and abs(t.number - tile.number) <= 2)
                tile_values.append((tile, similar_count))
            
            # En az benzeri olanı at
            tile_values.sort(key=lambda x: (x[1], x[0].number))
            return tile_values[0][0] if tile_values else random.choice(player_tiles)
    
    def next_turn(self):
        """Sırayı bir sonraki oyuncuya geçir"""
        turn_order = ["user", "ai1", "ai2", "ai3"]
        current_index = turn_order.index(self.current_turn)
        self.current_turn = turn_order[(current_index + 1) % 4]
        
        # Eğer AI'nın sırası, otomatik oyna
        if self.current_turn.startswith("ai"):
            return self.ai_play_turn(self.current_turn)
        
        return None
    
    def get_game_state(self, player_key: str = "user") -> Dict:
        """Oyun durumunu getir"""
        return {
            "game_id": self.game_id,
            "round_number": self.round_number,
            "current_turn": self.current_turn,
            "game_status": self.game_status,
            "okey_tile": self.okey_tile.to_dict() if self.okey_tile else None,
            "indicator_tile": self.indicator_tile.to_dict() if self.indicator_tile else None,
            "user_tiles": [t.to_dict() for t in self.players["user"]["tiles"]],
            "user_racks": [
                [t.to_dict() for t in rack]
                for rack in self.players["user"]["racks"]
            ],
            "discard_pile_top": self.discard_pile[-1].to_dict() if self.discard_pile else None,
            "deck_count": len(self.deck),
            "players": {
                key: {
                    "name": player["name"],
                    "tile_count": len(player["tiles"]),
                    "rack_counts": [len(rack) for rack in player["racks"]],
                    "score": player["score"],
                    "has_opened": player["has_opened"],
                    "position": player["position"]
                }
                for key, player in self.players.items()
            }
        }
    
    def to_dict(self):
        """Oyunu dictionary'e çevir (MongoDB için)"""
        return {
            "_id": self.game_id,
            "user_id": self.user_id,
            "players": {
                key: {
                    "id": player["id"],
                    "name": player["name"],
                    "tiles": [t.to_dict() for t in player["tiles"]],
                    "score": player["score"]
                }
                for key, player in self.players.items()
            },
            "deck": [t.to_dict() for t in self.deck],
            "discard_pile": [t.to_dict() for t in self.discard_pile],
            "okey_tile": self.okey_tile.to_dict() if self.okey_tile else None,
            "current_turn": self.current_turn,
            "round_number": self.round_number,
            "game_status": self.game_status,
            "winner": self.winner,
            "created_at": self.created_at
        }
