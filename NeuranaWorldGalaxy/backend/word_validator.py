"""
İsim-Şehir-Hayvan-Bitki-Eşya Doğrulama Sistemi
Kanıta dayalı doğrulama motoru
"""
import re
from typing import Dict, Any, Tuple
import requests
from datetime import datetime

class WordValidator:
    """Kelime doğrulama motoru"""
    
    def __init__(self):
        # Bilinen terimler veritabanı (genişletilebilir)
        self.known_terms = {
            'isim': [
                'ahmet', 'mehmet', 'ali', 'ayşe', 'fatma', 'zeynep', 'mustafa', 'can', 'ece', 'elif',
                'emre', 'deniz', 'berk', 'ada', 'yağmur', 'efe', 'defne', 'mert', 'selin', 'burak'
            ],
            'sehir': [
                'ankara', 'istanbul', 'izmir', 'bursa', 'antalya', 'adana', 'konya', 'gaziantep',
                'şanlıurfa', 'mersin', 'diyarbakır', 'kayseri', 'eskişehir', 'trabzon', 'malatya'
            ],
            'hayvan': [
                'aslan', 'kaplan', 'fil', 'zebra', 'zürafа', 'kedi', 'köpek', 'kuş', 'balık', 'yılan',
                'timsah', 'ayı', 'kurt', 'tilki', 'tavşan', 'sincap', 'fare', 'hamster', 'papağan'
            ],
            'bitki': [
                'gül', 'papatya', 'lale', 'karanfil', 'menekşe', 'orkide', 'çam', 'meşe', 'çınar',
                'buğday', 'mısır', 'domates', 'biber', 'patlıcan', 'salatalık', 'karpuz', 'kavun'
            ],
            'esya': [
                'kalem', 'defter', 'silgi', 'cetvel', 'masa', 'sandalye', 'dolap', 'yatak', 'lamba',
                'telefon', 'bilgisayar', 'televizyon', 'buzdolabı', 'fırın', 'çaydanlık', 'tabak'
            ]
        }
        
        # Yasak kelimeler (küfür, hakaret vb.)
        self.banned_words = ['test', 'asdf', 'qwerty']  # Gerçek uygulamada genişletilir
        
    def normalize_word(self, word: str) -> str:
        """Kelimeyi normalize et"""
        # Küçük harfe çevir
        word = word.lower().strip()
        
        # Türkçe karakterleri düzelt
        replacements = {
            'ı': 'ı', 'i': 'i', 'ş': 'ş', 'ğ': 'ğ', 'ü': 'ü', 'ö': 'ö', 'ç': 'ç'
        }
        
        # Ekleri temizle
        suffixes = ['ler', 'lar', 'lık', 'lik', 'ci', 'cı', 'çi', 'çı']
        for suffix in suffixes:
            if word.endswith(suffix) and len(word) > len(suffix) + 2:
                word = word[:-len(suffix)]
                break
        
        return word
    
    def check_banned(self, word: str) -> bool:
        """Yasak kelime kontrolü"""
        word_lower = word.lower()
        return any(banned in word_lower for banned in self.banned_words)
    
    def check_validity(self, word: str) -> bool:
        """Geçerlilik kontrolü"""
        # Minimum uzunluk
        if len(word) < 2:
            return False
        
        # Sadece harf içermeli
        if not re.match(r'^[a-zA-ZğüşıöçĞÜŞİÖÇ\s-]+$', word):
            return False
        
        # Anlamsız tekrar kontrolü
        if len(set(word)) < 2:  # Sadece 1-2 farklı harf
            return False
        
        return True
    
    def search_web_evidence(self, word: str, category: str) -> Tuple[bool, str, int]:
        """Web'de kanıt ara (simüle edilmiş)"""
        # Gerçek uygulamada Google/Wikipedia API kullanılır
        # Şimdilik basit mantık
        
        normalized = self.normalize_word(word)
        
        # Bilinen terimler kontrolü
        if normalized in self.known_terms.get(category, []):
            return True, f"'{word}' bilinen bir {category} terimi", 95
        
        # Uzunluk ve format kontrolü
        if len(word) >= 3:
            # Kabul edilebilir görünüyor (gerçek uygulamada web araması)
            return True, f"'{word}' {category} kategorisinde geçici kabul edildi", 65
        
        return False, f"'{word}' için yeterli kanıt bulunamadı", 30
    
    def validate_word(self, word: str, category: str, target_letter: str) -> Dict[str, Any]:
        """
        Kelimeyi doğrula
        
        Returns:
            dict: {
                'karar': 'Kabul' | 'Geçici Kabul' | 'Reddet',
                'kategori_uygunlugu': 'Uygun' | 'Uygun değil',
                'gerekce': str,
                'kanit_notu': str,
                'guven': int (0-100),
                'is_valid': bool
            }
        """
        
        # 1. Başlangıç kontrolü
        if not word or not word.strip():
            return {
                'karar': 'Reddet',
                'kategori_uygunlugu': 'Uygun değil',
                'gerekce': 'Boş kelime girildi',
                'kanit_notu': '—',
                'guven': 0,
                'is_valid': False
            }
        
        word_clean = word.strip()
        
        # 2. Harf kontrolü
        if target_letter and not word_clean.upper().startswith(target_letter.upper()):
            return {
                'karar': 'Reddet',
                'kategori_uygunlugu': 'Uygun değil',
                'gerekce': f"Kelime '{target_letter}' harfi ile başlamalı",
                'kanit_notu': '—',
                'guven': 0,
                'is_valid': False
            }
        
        # 3. Geçerlilik kontrolü
        if not self.check_validity(word_clean):
            return {
                'karar': 'Reddet',
                'kategori_uygunlugu': 'Uygun değil',
                'gerekce': 'Geçersiz format veya anlamsız dizi',
                'kanit_notu': '—',
                'guven': 5,
                'is_valid': False
            }
        
        # 4. Yasak kelime kontrolü
        if self.check_banned(word_clean):
            return {
                'karar': 'Reddet',
                'kategori_uygunlugu': 'Uygun değil',
                'gerekce': 'Yasak kelime tespit edildi',
                'kanit_notu': 'İhlal',
                'guven': 0,
                'is_valid': False
            }
        
        # 5. Normalizasyon
        normalized = self.normalize_word(word_clean)
        
        # 6. Web kanıt araması
        found, evidence, confidence = self.search_web_evidence(normalized, category)
        
        # 7. Karar verme
        if confidence >= 90:
            return {
                'karar': 'Kabul',
                'kategori_uygunlugu': 'Uygun',
                'gerekce': evidence,
                'kanit_notu': 'Çoklu güvenilir kaynak',
                'guven': confidence,
                'is_valid': True
            }
        elif confidence >= 60:
            return {
                'karar': 'Geçici Kabul',
                'kategori_uygunlugu': 'Uygun',
                'gerekce': evidence,
                'kanit_notu': 'Tek kaynak veya yeni terim',
                'guven': confidence,
                'is_valid': True
            }
        else:
            return {
                'karar': 'Reddet',
                'kategori_uygunlugu': 'Uygun değil',
                'gerekce': evidence,
                'kanit_notu': 'Yetersiz kanıt',
                'guven': confidence,
                'is_valid': False
            }
    
    def validate_all_answers(self, answers: Dict[str, str], target_letter: str) -> Dict[str, Any]:
        """Tüm cevapları doğrula"""
        results = {}
        total_score = 0
        
        for category, word in answers.items():
            if word and word.strip():
                validation = self.validate_word(word, category, target_letter)
                results[category] = validation
                
                # Puanlama
                if validation['is_valid']:
                    if validation['karar'] == 'Kabul':
                        total_score += 10
                    elif validation['karar'] == 'Geçici Kabul':
                        total_score += 7
        
        return {
            'results': results,
            'total_score': total_score,
            'timestamp': datetime.utcnow().isoformat()
        }


# Global instance
word_validator = WordValidator()
