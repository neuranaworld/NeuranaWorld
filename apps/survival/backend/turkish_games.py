"""
Türkçe Oyunları - Adam Asmaca, Kelime Türetme, Noktalama
"""
import random
from typing import List, Dict, Any

# Türkçe kelime havuzu
TURKISH_WORDS = {
    "kolay": [
        {"word": "OKUL", "hint": "Eğitim kurumu"},
        {"word": "KITAP", "hint": "Okumak için kullanılır"},
        {"word": "KALEM", "hint": "Yazmak için kullanılır"},
        {"word": "MASA", "hint": "Üzerinde yemek yenir"},
        {"word": "SANDALYE", "hint": "Oturmak için kullanılır"},
        {"word": "AĞAÇ", "hint": "Yeşil yaprakları vardır"},
        {"word": "ARABA", "hint": "Dört tekerlekli taşıt"},
        {"word": "DENIZ", "hint": "Tuzlu su kütlesi"},
        {"word": "GÖKYÜZÜ", "hint": "Yukarıda, mavidir"},
        {"word": "GÜNEŞ", "hint": "Işık ve ısı kaynağı"},
    ],
    "orta": [
        {"word": "BİLGİSAYAR", "hint": "Elektronik cihaz"},
        {"word": "KÜTÜPHANE", "hint": "Kitapların bulunduğu yer"},
        {"word": "ÖĞRETMEN", "hint": "Ders anlatan kişi"},
        {"word": "HASTANE", "hint": "Hastaların tedavi edildiği yer"},
        {"word": "YOLCULUK", "hint": "Bir yerden başka bir yere gitme"},
        {"word": "MEYDAN", "hint": "Geniş açık alan"},
        {"word": "DÜĞÜN", "hint": "Evlenme töreni"},
        {"word": "BAYRAM", "hint": "Özel kutlama günü"},
    ],
    "zor": [
        {"word": "MUHASEBE", "hint": "Hesap işleri"},
        {"word": "MÜHENDİS", "hint": "Teknik işlerle uğraşan meslek"},
        {"word": "ARAŞTIRMA", "hint": "İnceleme yapma"},
        {"word": "DÖNÜŞÜM", "hint": "Değişim, transformasyon"},
        {"word": "KÜTLECE", "hint": "Ağırlık olarak"},
    ]
}

# Noktalama kuralları
PUNCTUATION_RULES = [
    {
        "rule": "Hitap sözcüklerinden sonra virgül",
        "example": "Ali, gel buraya.",
        "wrong": "Ali gel buraya.",
        "explanation": "Hitap sözcüklerinden sonra virgül kullanılır."
    },
    {
        "rule": "Sıralı cümleler arasında virgül",
        "example": "Kitap okudum, ödev yaptım, uyudum.",
        "wrong": "Kitap okudum ödev yaptım uyudum.",
        "explanation": "Sıralanan eylemler arasında virgül kullanılır."
    },
    {
        "rule": "Ünlem sözcüklerinden sonra ünlem işareti",
        "example": "Vay canına!",
        "wrong": "Vay canına",
        "explanation": "Ünlem ve hayret bildiren sözcüklerden sonra ünlem işareti kullanılır."
    },
]

# Fiilimsi örnekleri
FIILIMSI_EXAMPLES = [
    {
        "sentence": "Koşan çocuk",
        "fiilimsi": "Sıfat-fiil",
        "ek": "-an/-en",
        "explanation": "Sıfat-fiil, ismi niteleyen fiilimsi türüdür."
    },
    {
        "sentence": "Okuyarak öğrenir",
        "fiilimsi": "Zarf-fiil",
        "ek": "-arak/-erek",
        "explanation": "Zarf-fiil, eylemi niteleyen fiilimsi türüdür."
    },
    {
        "sentence": "Yürümek sağlıklıdır",
        "fiilimsi": "İsim-fiil",
        "ek": "-mak/-mek",
        "explanation": "İsim-fiil, cümlede isim gibi kullanılan fiilimsi türüdür."
    },
]

class TurkishGames:
    """Türkçe oyunları yönetici sınıfı"""
    
    @staticmethod
    def generate_hangman(difficulty: str = "kolay") -> Dict[str, Any]:
        """
        Adam Asmaca 2.0 - Gelişmiş versiyon
        
        Args:
            difficulty: kolay, orta, zor
            
        Returns:
            Oyun verisi
        """
        words = TURKISH_WORDS.get(difficulty, TURKISH_WORDS["kolay"])
        selected = random.choice(words)
        
        word = selected["word"]
        hint = selected["hint"]
        
        # Türkçe karakterleri normalize et
        display_word = ["_" if c != " " else " " for c in word]
        
        return {
            "word": word,
            "hint": hint,
            "display_word": display_word,
            "difficulty": difficulty,
            "max_attempts": 6,
            "remaining_attempts": 6,
            "guessed_letters": [],
            "game_status": "active"
        }
    
    @staticmethod
    def check_hangman_guess(game_data: Dict, letter: str) -> Dict[str, Any]:
        """
        Adam asmaca tahmin kontrolü
        
        Args:
            game_data: Mevcut oyun verisi
            letter: Tahmin edilen harf
            
        Returns:
            Güncellenmiş oyun durumu
        """
        letter = letter.upper()
        word = game_data["word"]
        display_word = game_data["display_word"]
        guessed_letters = game_data["guessed_letters"]
        
        if letter in guessed_letters:
            return {
                **game_data,
                "message": "Bu harfi zaten denedin!",
                "is_new": False
            }
        
        guessed_letters.append(letter)
        
        if letter in word:
            # Doğru tahmin
            for i, c in enumerate(word):
                if c == letter:
                    display_word[i] = letter
            
            # Kazandı mı?
            if "_" not in display_word:
                return {
                    **game_data,
                    "display_word": display_word,
                    "guessed_letters": guessed_letters,
                    "game_status": "won",
                    "message": "🎉 Tebrikler! Kelimeyi buldun!",
                    "is_correct": True
                }
            
            return {
                **game_data,
                "display_word": display_word,
                "guessed_letters": guessed_letters,
                "message": "✅ Doğru harf!",
                "is_correct": True
            }
        else:
            # Yanlış tahmin
            remaining = game_data["remaining_attempts"] - 1
            
            if remaining <= 0:
                return {
                    **game_data,
                    "remaining_attempts": 0,
                    "guessed_letters": guessed_letters,
                    "game_status": "lost",
                    "message": f"❌ Oyun bitti! Doğru kelime: {word}",
                    "is_correct": False
                }
            
            return {
                **game_data,
                "remaining_attempts": remaining,
                "guessed_letters": guessed_letters,
                "message": f"❌ Yanlış harf! Kalan hak: {remaining}",
                "is_correct": False
            }
    
    @staticmethod
    def generate_word_chain() -> Dict[str, Any]:
        """
        Kelime Türetme Oyunu
        Son harfle başlayan kelime bulma
        
        Returns:
            Başlangıç kelimesi
        """
        starting_words = ["MASA", "AĞAÇ", "OKUL", "DENIZ", "GÖKYÜZÜ"]
        word = random.choice(starting_words)
        
        return {
            "current_word": word,
            "last_letter": word[-1],
            "chain": [word],
            "score": 0,
            "used_words": [word]
        }
    
    @staticmethod
    def validate_word_chain(game_data: Dict, user_word: str) -> Dict[str, Any]:
        """
        Kelime türetme doğrulama
        
        Rules:
        1. Son harfle başlamalı
        2. Daha önce kullanılmamış olmalı
        3. Geçerli Türkçe kelime olmalı
        """
        user_word = user_word.upper()
        last_letter = game_data["last_letter"]
        used_words = game_data["used_words"]
        
        # Kontroller
        if user_word in used_words:
            return {
                **game_data,
                "is_valid": False,
                "message": "❌ Bu kelime zaten kullanıldı!"
            }
        
        if not user_word.startswith(last_letter):
            return {
                **game_data,
                "is_valid": False,
                "message": f"❌ Kelime '{last_letter}' harfi ile başlamalı!"
            }
        
        # TODO: Gerçek kelime kontrolü (TDK API veya liste)
        # Şimdilik basit kontrol
        if len(user_word) < 2:
            return {
                **game_data,
                "is_valid": False,
                "message": "❌ Çok kısa kelime!"
            }
        
        # Geçerli
        chain = game_data["chain"]
        chain.append(user_word)
        used_words.append(user_word)
        
        return {
            "current_word": user_word,
            "last_letter": user_word[-1],
            "chain": chain,
            "score": game_data["score"] + 10,
            "used_words": used_words,
            "is_valid": True,
            "message": f"✅ Doğru! +10 puan. Şimdi '{user_word[-1]}' ile başla."
        }
    
    @staticmethod
    def generate_punctuation_quiz() -> Dict[str, Any]:
        """Noktalama oyunu - doğru cümleyi seç"""
        rule = random.choice(PUNCTUATION_RULES)
        
        # 4 seçenek oluştur
        options = [
            rule["example"],
            rule["wrong"],
        ]
        
        # 2 tane daha yanlış seçenek ekle
        other_wrongs = [
            rule["example"].replace(",", ";"),
            rule["example"].replace(".", "!"),
        ]
        options.extend(other_wrongs[:2])
        random.shuffle(options)
        
        return {
            "question": f"Hangi cümlede '{rule['rule']}' kuralı doğru uygulanmıştır?",
            "options": options,
            "correct_answer": rule["example"],
            "explanation": rule["explanation"],
            "rule": rule["rule"]
        }
    
    @staticmethod
    def generate_fiilimsi_quiz() -> Dict[str, Any]:
        """Fiilimsi tanıma oyunu"""
        example = random.choice(FIILIMSI_EXAMPLES)
        
        options = ["Sıfat-fiil", "Zarf-fiil", "İsim-fiil", "Fiilimsi yoktur"]
        random.shuffle(options)
        
        return {
            "question": f"'{example['sentence']}' cümlesinde hangi fiilimsi türü vardır?",
            "options": options,
            "correct_answer": example["fiilimsi"],
            "explanation": example["explanation"],
            "ek": example["ek"]
        }

# Global instance
turkish_games = TurkishGames()
