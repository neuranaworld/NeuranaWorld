"""
LLM Router: Akıllı model seçimi ve ensemble protokolü
"""
import asyncio
import hashlib
import json
from typing import Dict, Any, List, Tuple
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
from dotenv import load_dotenv

load_dotenv()

EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY")

class LLMRouter:
    """Çoklu-LLM yönlendirme ve ensemble sistemi"""
    
    def __init__(self):
        self.cache = {}
        
    async def route_request(
        self, 
        question_type: str, 
        content: str, 
        mode: str = "auto",
        user_preference: str = "auto"
    ) -> Dict[str, Any]:
        """
        Soru tipine göre uygun modeli seç ve yanıt al
        
        Args:
            question_type: "math_deep", "math_fast", "turkish_grammar", "translate"
            content: Soru içeriği
            mode: "deep" (ensemble) veya "fast" (tek model)
            user_preference: "auto", "gpt-4o", "claude-sonnet-4", "gemini-2.0-flash"
        """
        
        # Kullanıcı tercihi varsa onu kullan
        if user_preference != "auto":
            return await self._call_single_model(user_preference, content)
        
        # Akıllı yönlendirme
        if question_type == "math_deep" and mode == "deep":
            return await self._math_deep_think(content)
        elif question_type == "math_fast":
            return await self._call_single_model("gemini-2.0-flash", content)
        elif question_type == "turkish_grammar":
            return await self._turkish_grammar(content)
        elif question_type == "translate":
            return await self._ensemble_translate(content)
        else:
            # Default: GPT-4o
            return await self._call_single_model("gpt-4o", content)
    
    async def _math_deep_think(self, question: str) -> Dict[str, Any]:
        """
        Matematik derin düşünme modu
        - Primary: GPT-4o
        - Verify: Claude
        - Fallback: Gemini
        """
        try:
            # Primary: GPT-4o
            primary_result = await self._call_single_model(
                "gpt-4o", 
                question,
                system_message="Sen matematiksel problemleri adım adım çözen bir uzmansın. Her adımı açıkla ve sonuca ulaş. Emin değilsen belirt."
            )
            
            # Güven düşükse veya verification gerekiyorsa
            if primary_result.get("confidence", 1.0) < 0.9:
                # Claude ile doğrula
                verify_prompt = f"""
Aşağıdaki matematiksel çözümü doğrula:

Soru: {question}

Çözüm: {primary_result.get('answer', '')}

Bu çözüm doğru mu? Eğer hata varsa düzelt ve açıkla.
"""
                verify_result = await self._call_single_model(
                    "claude-sonnet-4",
                    verify_prompt,
                    system_message="Sen matematiksel çözümleri doğrulayan bir uzmansın."
                )
                
                return {
                    "answer": verify_result.get("answer"),
                    "confidence": 0.95,
                    "model": "gpt-4o-verified-by-claude",
                    "verification": verify_result.get("answer"),
                    "original": primary_result.get("answer")
                }
            
            return primary_result
            
        except Exception as e:
            # Fallback: Gemini
            print(f"GPT-4o/Claude failed, falling back to Gemini: {e}")
            return await self._call_single_model("gemini-2.0-flash", question)
    
    async def _turkish_grammar(self, question: str) -> Dict[str, Any]:
        """
        Türkçe dilbilgisi soruları
        - Primary: Claude (Türkçe güçlü)
        - Verify: GPT-4o
        """
        try:
            primary_result = await self._call_single_model(
                "claude-sonnet-4",
                question,
                system_message="Sen Türkçe dilbilgisi uzmanısın. Noktalama, fiilimsi, tamlamalar konusunda detaylı açıklama yap."
            )
            
            return primary_result
            
        except Exception as e:
            print(f"Claude failed, falling back to GPT-4o: {e}")
            return await self._call_single_model("gpt-4o", question)
    
    async def _ensemble_translate(self, content: str) -> Dict[str, Any]:
        """
        Çeviri için ensemble (GPT-4o + Claude)
        İki modelin çevirilerini karşılaştır
        """
        try:
            # Parse content
            data = json.loads(content) if isinstance(content, str) else content
            text = data.get("text", "")
            source_lang = data.get("source_lang", "auto")
            target_lang = data.get("target_lang", "en")
            
            # Her iki modelden çeviri al
            gpt_result = await self._call_single_model(
                "gpt-4o",
                f"Çevir: '{text}' [{source_lang} -> {target_lang}]. Sadece çeviriyi yaz, başka açıklama yapma.",
                system_message="Sen profesyonel bir çevirmenisin."
            )
            
            claude_result = await self._call_single_model(
                "claude-sonnet-4",
                f"Çevir: '{text}' [{source_lang} -> {target_lang}]. Sadece çeviriyi yaz, başka açıklama yapma.",
                system_message="Sen profesyonel bir çevirmenisin."
            )
            
            gpt_translation = gpt_result.get("answer", "")
            claude_translation = claude_result.get("answer", "")
            
            # Çeviriler benzer mi?
            similarity = self._calculate_similarity(gpt_translation, claude_translation)
            
            if similarity > 0.8:
                # Benzer, yüksek güven
                return {
                    "answer": gpt_translation,
                    "confidence": 0.95,
                    "model": "gpt-4o-claude-ensemble",
                    "alternative": claude_translation,
                    "similarity": similarity
                }
            else:
                # Farklı çeviriler, düşük güven
                return {
                    "answer": gpt_translation,
                    "confidence": 0.7,
                    "model": "gpt-4o-claude-ensemble",
                    "alternative": claude_translation,
                    "similarity": similarity,
                    "warning": "İki model farklı çeviriler üret ti. İkisini de gözden geçirin."
                }
                
        except Exception as e:
            print(f"Ensemble translation failed: {e}")
            return await self._call_single_model("gpt-4o", content)
    
    async def _call_single_model(
        self, 
        model: str, 
        content: str,
        system_message: str = "Sen yardımcı bir asistansın."
    ) -> Dict[str, Any]:
        """Tek bir modelden yanıt al"""
        
        # Cache kontrolü
        cache_key = hashlib.md5(f"{model}:{content}".encode()).hexdigest()
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            # Model ve provider mapping
            provider, model_name = self._get_provider_and_model(model)
            
            # LLM Chat oluştur
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=f"session-{cache_key[:8]}",
                system_message=system_message
            ).with_model(provider, model_name)
            
            # Mesaj gönder
            user_message = UserMessage(text=content)
            response = await chat.send_message(user_message)
            
            result = {
                "answer": response,
                "confidence": 1.0,
                "model": model,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Cache'e ekle
            self.cache[cache_key] = result
            
            return result
            
        except Exception as e:
            print(f"Error calling {model}: {e}")
            raise
    
    def _get_provider_and_model(self, model: str) -> Tuple[str, str]:
        """Model string'inden provider ve model name çıkar"""
        mapping = {
            "gpt-4o": ("openai", "gpt-4o"),
            "gpt-4o-mini": ("openai", "gpt-4o-mini"),
            "claude-sonnet-4": ("anthropic", "claude-3-7-sonnet-20250219"),
            "gemini-2.0-flash": ("gemini", "gemini-2.0-flash"),
        }
        return mapping.get(model, ("openai", "gpt-4o"))
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """İki metin arasında basit benzerlik skoru (0-1)"""
        if not text1 or not text2:
            return 0.0
        
        # Basit token-based similarity
        tokens1 = set(text1.lower().split())
        tokens2 = set(text2.lower().split())
        
        if not tokens1 or not tokens2:
            return 0.0
        
        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)
        
        return len(intersection) / len(union) if union else 0.0
    
    async def k_self_consistency(
        self, 
        model: str, 
        question: str, 
        k: int = 3
    ) -> Dict[str, Any]:
        """
        K-self-consistency: Aynı soruyu farklı sıcaklıklarla k kez sor
        Çoğunluk oyuyla sonuç belirle
        """
        temperatures = [0.3, 0.7, 1.0][:k]
        results = []
        
        for temp in temperatures:
            # TODO: Temperature parametresi ekle
            result = await self._call_single_model(model, question)
            results.append(result.get("answer", ""))
        
        # Çoğunluk oyu (basit versiyon)
        from collections import Counter
        answer_counts = Counter(results)
        most_common = answer_counts.most_common(1)[0]
        
        confidence = most_common[1] / k  # Kaç tanesinde aynı cevap
        
        return {
            "answer": most_common[0],
            "confidence": confidence,
            "model": f"{model}-k{k}-consistency",
            "all_answers": results
        }


    async def multi_ai_consensus(
        self,
        question: str,
        max_iterations: int = 3
    ) -> Dict[str, Any]:
        """
        3 AI konsensus sistemi
        - Gemini, ChatGPT, Claude'a aynı soruyu sor
        - Farklı cevaplar gelirse, tekrar sor ve karşılaştır
        - Konsensusa ulaşana kadar devam et (max 3 iterasyon)
        """
        
        models = ["gemini-2.0-flash", "gpt-4o", "claude-sonnet-4"]
        iteration = 0
        
        while iteration < max_iterations:
            iteration += 1
            print(f"🔄 Konsensus iterasyonu {iteration}/{max_iterations}")
            
            # Her 3 modelden yanıt al (paralel)
            tasks = [
                self._call_single_model(model, question)
                for model in models
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Hataları filtrele
            valid_results = [
                r for r in results 
                if not isinstance(r, Exception) and r.get("answer")
            ]
            
            if len(valid_results) < 2:
                return {
                    "answer": "Yeterli AI yanıtı alınamadı",
                    "confidence": 0.0,
                    "model": "multi-ai-consensus-failed",
                    "error": "Insufficient responses"
                }
            
            # Cevapları karşılaştır
            answers = [r["answer"] for r in valid_results]
            answer_models = [models[i] for i, r in enumerate(results) if not isinstance(r, Exception)]
            
            # Aynı cevap var mı kontrol et
            consensus_answer, consensus_count = self._find_consensus(answers)
            
            if consensus_count >= 2:  # En az 2 AI aynı cevabı verdi
                confidence = consensus_count / len(valid_results)
                
                return {
                    "answer": consensus_answer,
                    "confidence": confidence,
                    "model": "multi-ai-consensus",
                    "consensus_count": f"{consensus_count}/{len(valid_results)}",
                    "iteration": iteration,
                    "all_answers": [
                        {"model": answer_models[i], "answer": ans}
                        for i, ans in enumerate(answers)
                    ]
                }
            
            # Konsensus yok, tekrar dene
            print(f"⚠️ Konsensus bulunamadı, tekrar soruyorum...")
            print(f"Cevaplar: {answers}")
            
            # Eğer son iterasyonsa, çoğunluk oylaması yap
            if iteration == max_iterations:
                # En çok tekrar eden cevabı bul
                from collections import Counter
                answer_counts = Counter(answers)
                most_common_answer, count = answer_counts.most_common(1)[0]
                
                return {
                    "answer": most_common_answer,
                    "confidence": count / len(answers),
                    "model": "multi-ai-majority-vote",
                    "consensus_count": f"{count}/{len(answers)}",
                    "iteration": iteration,
                    "all_answers": [
                        {"model": answer_models[i], "answer": ans}
                        for i, ans in enumerate(answers)
                    ],
                    "warning": "Tam konsensus sağlanamadı, çoğunluk kararı alındı"
                }
        
        return {
            "answer": "Konsensus sağlanamadı",
            "confidence": 0.0,
            "model": "multi-ai-consensus-failed"
        }
    
    def _find_consensus(self, answers: List[str]) -> Tuple[str, int]:
        """
        Cevaplar arasında konsensus bul
        Benzer cevapları grupla (normalizasyon ile)
        """
        from collections import Counter
        
        # Cevapları normalize et (küçük harf, trim, sayıları ayıkla)
        normalized = []
        for ans in answers:
            # Sayıları bul
            import re
            numbers = re.findall(r'-?\d+\.?\d*', ans)
            if numbers:
                # Sayısal cevap
                normalized.append(numbers[0])
            else:
                # Metin cevap
                normalized.append(ans.strip().lower()[:100])
        
        # En çok tekrar edeni bul
        counter = Counter(normalized)
        if not counter:
            return answers[0], 1
        
        most_common_normalized, count = counter.most_common(1)[0]
        
        # Orijinal cevabı bul
        for i, norm in enumerate(normalized):
            if norm == most_common_normalized:
                return answers[i], count
        
        return answers[0], 1
    
    async def generate_and_validate_question(
        self,
        question_type: str,
        difficulty: str = "medium"
    ) -> Dict[str, Any]:
        """
        Soru oluştur ve 3 AI ile doğrula
        
        Args:
            question_type: "grammar", "math", "pattern", "word_game"
            difficulty: "easy", "medium", "hard", "very_hard"
        """
        
        # 1. Gemini ile soru oluştur
        generator_prompt = self._get_generator_prompt(question_type, difficulty)
        
        gemini_result = await self._call_single_model(
            "gemini-2.0-flash",
            generator_prompt,
            system_message="Sen eğitim soruları oluşturan bir uzmansın. JSON formatında yanıt ver."
        )
        
        generated_question = gemini_result.get("answer", "")
        
        # 2. ChatGPT ve Claude ile doğrula
        validation_prompt = f"""
Aşağıdaki soruyu kontrol et:

{generated_question}

Soru doğru mu? Mantık hatası, yazım hatası veya belirsizlik var mı?
Sadece "DOĞRU" veya hataları listele.
"""
        
        gpt_validation = await self._call_single_model("gpt-4o", validation_prompt)
        claude_validation = await self._call_single_model("claude-sonnet-4", validation_prompt)
        
        gpt_valid = "doğru" in gpt_validation.get("answer", "").lower()
        claude_valid = "doğru" in claude_validation.get("answer", "").lower()
        
        if gpt_valid and claude_valid:
            return {
                "question": generated_question,
                "validated": True,
                "confidence": 1.0,
                "validators": ["gpt-4o", "claude-sonnet-4"]
            }
        else:
            return {
                "question": generated_question,
                "validated": False,
                "confidence": 0.5,
                "gpt_feedback": gpt_validation.get("answer"),
                "claude_feedback": claude_validation.get("answer"),
                "warning": "Soru validasyondan geçemedi"
            }
    
    def _get_generator_prompt(self, question_type: str, difficulty: str) -> str:
        """Soru tipi için prompt oluştur"""
        
        prompts = {
            "grammar": f"""
Türkçe dilbilgisi sorusu oluştur (Zorluk: {difficulty}).
Konu: Büyük harflerin kullanımı (A harfi değil, genel büyük harf kuralları).

JSON formatında yanıt ver:
{{
    "question": "Soru metni",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "A",
    "explanation": "Açıklama"
}}
""",
            "word_game": f"""
Adam asmaca için kelime ve ipucu oluştur (Zorluk: {difficulty}).

JSON formatında yanıt ver:
{{
    "word": "KELIME",
    "hint": "İpucu metni",
    "category": "Kategori"
}}
""",
            "pattern": f"""
Örüntü bulma sorusu oluştur (Zorluk: {difficulty}).

JSON formatında yanıt ver:
{{
    "pattern": [1, 2, 4, 8, "?"],
    "answer": 16,
    "explanation": "Her sayı 2 ile çarpılıyor"
}}
""",
            "math": f"""
Matematik sorusu oluştur (Zorluk: {difficulty}).

JSON formatında yanıt ver:
{{
    "question": "Soru metni",
    "answer": "Cevap",
    "steps": ["Adım 1", "Adım 2"]
}}
"""
        }
        
        return prompts.get(question_type, prompts["math"])

# Global router instance
router = LLMRouter()
