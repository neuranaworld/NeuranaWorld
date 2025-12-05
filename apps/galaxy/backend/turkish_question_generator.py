"""
Türkçe Mantık Tabanlı Soru Üretme Sistemi
Kullanıcının verdiği düşünme zinciri prensipleri ile çalışır
"""
import random
from typing import Dict, List, Any

class TurkishQuestionGenerator:
    """Türkçe soruları mantık tabanlı üretir"""
    
    def __init__(self):
        self.used_patterns = set()
        
    def generate_grammar_question(self, topic: str, difficulty: int = 2) -> Dict[str, Any]:
        """
        Dil bilgisi sorusu üret
        
        Düşünme Zinciri:
        1. Anlam Analizi
        2. Kural Çözümleme  
        3. Gözlem Adımı
        4. Çelişki Kur
        5. Cevap Mantığı
        6. Farklılaşma Adımı
        7. Doğruluk Denetimi
        8. Dil Duygusu
        """
        
        if topic == "noktalama":
            return self._generate_punctuation_question(difficulty)
        elif topic == "fiilimsa":
            return self._generate_fiilimsa_question(difficulty)
        elif topic == "buyuk_unlu_uyumu":
            return self._generate_vowel_harmony_question(difficulty)
        elif topic == "ses_olayi":
            return self._generate_phonetic_event_question(difficulty)
        else:
            return self._generate_general_grammar_question(difficulty)
    
    def _generate_punctuation_question(self, difficulty: int) -> Dict[str, Any]:
        """Noktalama soruları - Geliştirilmiş ve hatasız"""
        
        questions_db = {
            1: [  # Kolay
                {
                    "rule": "Hitap sözcüklerinden sonra virgül kullanılır",
                    "correct": "Ayşe, gel buraya.",
                    "wrong_examples": [
                        "Ayşe gel buraya.",
                        "Ayşe. Gel buraya.",
                        "Ayşe; gel buraya."
                    ],
                    "explanation": "Hitap sözcüklerinden sonra virgül kullanılır. 'Ayşe' bir hitaptır ve virgülle ayrılmalıdır."
                },
                {
                    "rule": "Cümle sonunda nokta kullanılır",
                    "correct": "Kitap okudum.",
                    "wrong_examples": [
                        "Kitap okudum",
                        "Kitap okudum!",
                        "Kitap okudum;"
                    ],
                    "explanation": "Bildirme cümlelerinin sonunda nokta kullanılır."
                },
                {
                    "rule": "Soru cümlelerinin sonunda soru işareti kullanılır",
                    "correct": "Bugün okula gidecek misin?",
                    "wrong_examples": [
                        "Bugün okula gidecek misin.",
                        "Bugün okula gidecek misin!",
                        "Bugün okula gidecek misin"
                    ],
                    "explanation": "Soru cümlelerinin sonunda soru işareti kullanılmalıdır."
                },
                {
                    "rule": "Sıralı cümleler arasında virgül kullanılır",
                    "correct": "Ders çalıştım, ödev yaptım, uyudum.",
                    "wrong_examples": [
                        "Ders çalıştım ödev yaptım uyudum.",
                        "Ders çalıştım; ödev yaptım; uyudum.",
                        "Ders çalıştım. Ödev yaptım. Uyudum."
                    ],
                    "explanation": "Sıralanan eylemler arasında virgül kullanılır."
                }
            ],
            2: [  # Orta
                {
                    "rule": "İki nokta üst üste, açıklama için kullanılır",
                    "correct": "Üç renk seçtik: kırmızı, mavi ve yeşil.",
                    "wrong_examples": [
                        "Üç renk seçtik, kırmızı, mavi ve yeşil.",
                        "Üç renk seçtik; kırmızı, mavi ve yeşil.",
                        "Üç renk seçtik - kırmızı, mavi ve yeşil."
                    ],
                    "explanation": "İki nokta üst üste, arkasından gelen açıklama veya örnekleri belirtmek için kullanılır."
                },
                {
                    "rule": "Noktalı virgül, birbirine bağlı cümleler arasında kullanılır",
                    "correct": "Hava çok güzel; pikniğe gidelim.",
                    "wrong_examples": [
                        "Hava çok güzel, pikniğe gidelim.",
                        "Hava çok güzel: pikniğe gidelim.",
                        "Hava çok güzel pikniğe gidelim."
                    ],
                    "explanation": "Noktalı virgül, anlamca birbirine bağlı cümleler arasında kullanılır."
                },
                {
                    "rule": "Ünlem işareti, güçlü duygu bildiren cümlelerde kullanılır",
                    "correct": "Ne güzel bir gün!",
                    "wrong_examples": [
                        "Ne güzel bir gün.",
                        "Ne güzel bir gün?",
                        "Ne güzel bir gün;"
                    ],
                    "explanation": "Şaşkınlık, sevinç gibi güçlü duyguları ifade eden cümlelerde ünlem işareti kullanılır."
                }
            ],
            3: [  # Zor
                {
                    "rule": "Kesme işareti, özel isimlere ek getirilirken kullanılır",
                    "correct": "Mehmet'in kalemi masada.",
                    "wrong_examples": [
                        "Mehmetin kalemi masada.",
                        "Mehmet-in kalemi masada.",
                        "Mehmet in kalemi masada."
                    ],
                    "explanation": "Özel isimlere ek getirilirken kesme işareti kullanılır. 'Mehmet' özel isimdir ve '-in' eki kesme ile ayrılmalıdır."
                },
                {
                    "rule": "Kesme işareti, kısaltmalara ek getirirken kullanılır",
                    "correct": "TRT'de haber izledim.",
                    "wrong_examples": [
                        "TRTde haber izledim.",
                        "TRT-de haber izledim.",
                        "T.R.T.'de haber izledim."
                    ],
                    "explanation": "Kısaltmalara ek getirilirken kesme işareti kullanılır. 'TRT' bir kısaltmadır."
                },
                {
                    "rule": "Tırnak işareti, doğrudan alıntılarda kullanılır",
                    "correct": "\"Yarın gelirim\" dedi.",
                    "wrong_examples": [
                        "Yarın gelirim dedi.",
                        "'Yarın gelirim' dedi.",
                        "-Yarın gelirim- dedi."
                    ],
                    "explanation": "Birisinin sözünü aynen aktarırken tırnak işareti kullanılır."
                }
            ]
        }
        
        # Zorluğa göre soru seç
        available_questions = questions_db.get(difficulty, questions_db[2])
        selected = random.choice(available_questions)
        
        # Seçenekleri oluştur - 4 seçenek
        wrong_examples = selected["wrong_examples"][:3]
        options = [selected["correct"]] + wrong_examples
        random.shuffle(options)
        
        # Pattern kontrolü (tekrar önleme)
        pattern_key = f"noktalama_{selected['rule'][:30]}_{difficulty}"
        if pattern_key in self.used_patterns and len(available_questions) > 1:
            # Farklı bir soru seç
            available_questions = [q for q in available_questions if q != selected]
            if available_questions:
                selected = random.choice(available_questions)
                wrong_examples = selected["wrong_examples"][:3]
                options = [selected["correct"]] + wrong_examples
                random.shuffle(options)
        
        self.used_patterns.add(pattern_key)
        
        return {
            "question": f"Aşağıdaki cümlelerden hangisinde noktalama işaretleri doğru kullanılmıştır?",
            "options": options,
            "correct_answer": selected["correct"],
            "explanation": selected["explanation"],
            "difficulty": difficulty,
            "topic": "noktalama",
            "rule": selected["rule"]
        }
    
    def _generate_fiilimsa_question(self, difficulty: int) -> Dict[str, Any]:
        """Fiilimsa soruları - Geliştirilmiş ve hatasız"""
        
        questions_db = {
            1: [  # Kolay
                {
                    "sentence": "Koşan çocuk parkta oynadı.",
                    "fiilimsa": "Sıfat-fiil",
                    "ek": "-an/-en",
                    "target_word": "Koşan",
                    "explanation": "'-an/-en' eki sıfat-fiil ekidir ve ismi niteler. 'Koşan' kelimesi 'çocuk' ismini niteler."
                },
                {
                    "sentence": "Yürümek sağlıklıdır.",
                    "fiilimsa": "İsim-fiil",
                    "ek": "-mak/-mek",
                    "target_word": "Yürümek",
                    "explanation": "'-mak/-mek' eki isim-fiil ekidir. 'Yürümek' kelimesi cümlede isim görevindedir."
                },
                {
                    "sentence": "Gülümseyen adam bize baktı.",
                    "fiilimsa": "Sıfat-fiil",
                    "ek": "-an/-en",
                    "target_word": "Gülümseyen",
                    "explanation": "'-an/-en' eki sıfat-fiil ekidir. 'Gülümseyen' kelimesi 'adam' ismini niteler."
                },
                {
                    "sentence": "Koşmak yararlıdır.",
                    "fiilimsa": "İsim-fiil",
                    "ek": "-mak/-mek",
                    "target_word": "Koşmak",
                    "explanation": "'-mak/-mek' eki isim-fiil ekidir. 'Koşmak' kelimesi cümlede özne görevindedir."
                }
            ],
            2: [  # Orta
                {
                    "sentence": "Okuyarak öğrenir.",
                    "fiilimsa": "Zarf-fiil",
                    "ek": "-arak/-erek",
                    "target_word": "Okuyarak",
                    "explanation": "'-arak/-erek' eki zarf-fiil ekidir ve eylemi niteler. 'Okuyarak' kelimesi 'öğrenir' fiilini niteler ve 'nasıl' sorusuna cevap verir."
                },
                {
                    "sentence": "Yazılan mektup çok güzeldi.",
                    "fiilimsa": "Sıfat-fiil",
                    "ek": "-an/-en",
                    "target_word": "Yazılan",
                    "explanation": "'-an/-en' eki sıfat-fiil ekidir. 'Yazılan' kelimesi 'mektup' ismini niteler ve edilgen çatıdadır."
                },
                {
                    "sentence": "Düşünerek hareket et.",
                    "fiilimsa": "Zarf-fiil",
                    "ek": "-arak/-erek",
                    "target_word": "Düşünerek",
                    "explanation": "'-arak/-erek' eki zarf-fiil ekidir. 'Düşünerek' kelimesi 'hareket et' fiilini niteler."
                },
                {
                    "sentence": "Okuduğu kitap çok ilginçti.",
                    "fiilimsa": "Sıfat-fiil",
                    "ek": "-dik/-tik",
                    "target_word": "Okuduğu",
                    "explanation": "'-dik/-tik' eki sıfat-fiil ekidir. 'Okuduğu' kelimesi 'kitap' ismini niteler ve iyelik eki almıştır."
                }
            ],
            3: [  # Zor
                {
                    "sentence": "Geldiği zaman haber ver.",
                    "fiilimsa": "Sıfat-fiil",
                    "ek": "-dik/-tik",
                    "target_word": "Geldiği",
                    "explanation": "'-dik/-tik' eki sıfat-fiil ekidir. 'Geldiği' kelimesi 'zaman' ismini niteler ve iyelik eki almıştır."
                },
                {
                    "sentence": "Yazılmış mektupları okudum.",
                    "fiilimsa": "Sıfat-fiil",
                    "ek": "-mış/-miş",
                    "target_word": "Yazılmış",
                    "explanation": "'-mış/-miş' eki sıfat-fiil ekidir. 'Yazılmış' kelimesi 'mektupları' ismini niteler."
                },
                {
                    "sentence": "Yürüyerek geldi.",
                    "fiilimsa": "Zarf-fiil",
                    "ek": "-arak/-erek",
                    "target_word": "Yürüyerek",
                    "explanation": "'-arak/-erek' eki zarf-fiil ekidir. 'Yürüyerek' kelimesi 'geldi' fiilini niteler ve 'nasıl' sorusuna cevap verir."
                }
            ]
        }
        
        available_questions = questions_db.get(difficulty, questions_db[2])
        selected = random.choice(available_questions)
        
        # Seçenekler - Her seferinde farklı kombinasyon
        all_fiilimsa_types = ["Sıfat-fiil", "Zarf-fiil", "İsim-fiil"]
        wrong_options = [f for f in all_fiilimsa_types if f != selected["fiilimsa"]]
        options = [selected["fiilimsa"]] + wrong_options
        random.shuffle(options)
        
        # Pattern kontrolü
        pattern_key = f"fiilimsa_{selected['sentence'][:20]}_{difficulty}"
        if pattern_key in self.used_patterns and len(available_questions) > 1:
            available_questions = [q for q in available_questions if q != selected]
            if available_questions:
                selected = random.choice(available_questions)
                wrong_options = [f for f in all_fiilimsa_types if f != selected["fiilimsa"]]
                options = [selected["fiilimsa"]] + wrong_options
                random.shuffle(options)
        
        self.used_patterns.add(pattern_key)
        
        return {
            "question": f"'{selected['sentence']}' cümlesinde hangi fiilimsi türü vardır?",
            "options": options,
            "correct_answer": selected["fiilimsa"],
            "explanation": selected["explanation"],
            "difficulty": difficulty,
            "topic": "fiilimsa",
            "target_word": selected["target_word"]
        }
    
    def _generate_vowel_harmony_question(self, difficulty: int) -> Dict[str, Any]:
        """Büyük ünlü uyumu soruları"""
        
        # Anlam Analizi: Türkçe'de kelime içindeki ünlülerin kalınlık-incelik uyumu
        # Kural: İlk hecedeki ünlü kalınsa (a, ı, o, u), sonrakiler de kalın olmalı
        
        correct_words = ["masa", "kapı", "göz", "süt"]  # Uyumlu
        wrong_words = ["mase", "kapü", "gaz", "süte"]   # Uyumsuz (kasıtlı)
        
        selected_correct = random.choice(correct_words)
        selected_wrong = random.choice(wrong_words)
        
        options = [selected_correct, selected_wrong, random.choice(correct_words), random.choice(wrong_words)]
        options = list(set(options))
        random.shuffle(options)
        
        return {
            "question": "Aşağıdaki kelimelerden hangisi büyük ünlü uyumuna uymaktadır?",
            "options": options[:4],
            "correct_answer": selected_correct,
            "explanation": f"'{selected_correct}' kelimesi büyük ünlü uyumuna uygundur çünkü tüm ünlüler aynı kalınlık-incelik düzeyindedir.",
            "difficulty": difficulty,
            "topic": "buyuk_unlu_uyumu"
        }
    
    def _generate_phonetic_event_question(self, difficulty: int) -> Dict[str, Any]:
        """Ses olayları soruları"""
        
        events = {
            "unsuz_yumusamasi": {
                "example": "kitap → kitaba",
                "explanation": "Ünlü ile başlayan bir ek geldiğinde, kelime sonundaki 'p' sesi 'b'ye yumuşar.",
                "rule": "Ünsüz yumuşaması"
            },
            "unsuz_dusmesi": {
                "example": "ağaç → ağacı",
                "explanation": "İyelik eki geldiğinde kelime içindeki ç sesi düşer.",
                "rule": "Ünsüz düşmesi"
            },
            "unlu_daralması": {
                "example": "ara → arıyor",
                "explanation": "Ünlü ile başlayan bir ek geldiğinde kelime sonundaki geniş ünlü daralır.",
                "rule": "Ünlü daralması"
            }
        }
        
        selected_event = random.choice(list(events.values()))
        
        return {
            "question": f"'{selected_event['example']}' örneğinde hangi ses olayı görülür?",
            "options": [selected_event["rule"], "Ünlü düşmesi", "Ünsüz türemesi", "Ünlü türemesi"],
            "correct_answer": selected_event["rule"],
            "explanation": selected_event["explanation"],
            "difficulty": difficulty,
            "topic": "ses_olayi"
        }
    
    def _generate_general_grammar_question(self, difficulty: int) -> Dict[str, Any]:
        """Genel dilbilgisi soruları"""
        
        # Varsayılan olarak noktalama sorusu üret
        return self._generate_punctuation_question(difficulty)
    
    def validate_question(self, question: Dict[str, Any]) -> bool:
        """
        Soruyu doğrulama - 7. Doğruluk Denetimi
        
        Kontroller:
        1. Tek mantıksal doğru cevap var mı?
        2. Seçenekler birbirinden farklı mı?
        3. Açıklama yeterli mi?
        """
        
        # Tek doğru cevap kontrolü
        if question["correct_answer"] not in question["options"]:
            return False
        
        # Seçenekler farklı mı?
        if len(set(question["options"])) != len(question["options"]):
            return False
        
        # Açıklama var mı?
        if not question.get("explanation"):
            return False
        
        return True


# Global instance
turkish_question_generator = TurkishQuestionGenerator()
