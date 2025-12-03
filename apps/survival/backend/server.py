from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import bcrypt
import random

# Local imports
from models import *
from llm_router import router as llm_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/neuramath')
client = AsyncIOMotorClient(mongo_url)
db = client.neuramath

# Create the main app without a prefix
app = FastAPI(title="NeuranaWorld API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================
# AUTHENTICATION & USER MANAGEMENT
# ============================================

@api_router.post("/auth/anonymous")
async def create_anonymous_user():
    """Anonim kullanıcı oluştur"""
    user_id = str(uuid.uuid4())
    user_data = {
        "_id": user_id,
        "name": f"Misafir#{random.randint(1000, 9999)}",
        "is_anonymous": True,
        "created_at": datetime.utcnow(),
        "settings": {
            "theme": "light",
            "language": "tr",
            "llm_mode": "auto",
            "accuracy_priority": "max_accuracy"
        },
        "stats": {
            "total_points": 0,
            "correct_answers": 0,
            "games_played": 0,
            "study_time_minutes": 0
        }
    }
    
    await db.users.insert_one(user_data)
    return {"user_id": user_id, "name": user_data["name"]}


@api_router.post("/auth/register")
async def register_user(req: CreateUserRequest):
    """Yeni kullanıcı kaydı"""
    # Email kontrolü
    if req.email:
        existing = await db.users.find_one({"email": req.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email zaten kullanılıyor")
    
    user_id = str(uuid.uuid4())
    password_hash = None
    if req.password:
        password_hash = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
    
    user_data = {
        "_id": user_id,
        "name": req.name,
        "email": req.email,
        "password_hash": password_hash,
        "is_anonymous": req.is_anonymous,
        "created_at": datetime.utcnow(),
        "settings": {
            "theme": "light",
            "language": "tr",
            "llm_mode": "auto",
            "accuracy_priority": "max_accuracy"
        },
        "stats": {
            "total_points": 0,
            "correct_answers": 0,
            "games_played": 0,
            "study_time_minutes": 0
        }
    }
    
    await db.users.insert_one(user_data)
    return {"user_id": user_id, "name": user_data["name"]}


@api_router.post("/auth/login")
async def login_user(req: LoginRequest):
    """Kullanıcı girişi"""
    user = await db.users.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
    
    if not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Bu hesap için şifre ayarlanmamış")
    
    if not bcrypt.checkpw(req.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
    
    return {
        "user_id": user["_id"],
        "name": user["name"],
        "email": user["email"]
    }


@api_router.get("/user/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Kullanıcı istatistiklerini getir"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    return user.get("stats", {})


@api_router.get("/user/{user_id}/settings")
async def get_user_settings(user_id: str):
    """Kullanıcı ayarlarını getir"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    return user.get("settings", {})


@api_router.put("/user/{user_id}/settings")
async def update_user_settings(user_id: str, settings: dict):
    """Kullanıcı ayarlarını güncelle"""
    result = await db.users.update_one(
        {"_id": user_id},
        {"$set": {"settings": settings}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    return {"success": True}


# ============================================
# LLM & DEEP THINKING
# ============================================

@api_router.post("/llm/deep-think")
async def deep_think(req: DeepThinkRequest):
    """
    Derin düşünme modu - 3 AI konsensus sistemi
    - ChatGPT, Gemini, Claude'a sor
    - Cevapları karşılaştır
    - Konsensus sağlanana kadar tekrar sor
    - Tüm AI'lar aynı sonuca ulaşınca kullanıcıya göster
    """
    try:
        # DEEP modda konsensus sistemi kullan
        if req.mode == SessionMode.DEEP:
            print(f"🧠 Derin düşünme modu: {req.question}")
            
            # Multi-AI konsensus
            result = await llm_router.multi_ai_consensus(
                question=req.question,
                max_iterations=3
            )
            
            return {
                "answer": result.get("answer"),
                "confidence": result.get("confidence"),
                "model": result.get("model"),
                "consensus_details": {
                    "consensus_count": result.get("consensus_count"),
                    "iteration": result.get("iteration"),
                    "all_answers": result.get("all_answers", [])
                },
                "timestamp": datetime.utcnow()
            }
        
        # FAST modda tek model kullan (Gemini hızlı)
        else:
            result = await llm_router.route_request(
                question_type="math_fast",
                content=req.question,
                mode="fast"
            )
            
            return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI işlemi başarısız: {str(e)}")


@api_router.post("/llm/translate")
async def translate_text(req: TranslateRequest):
    """Çoklu-dil çeviri (ensemble mode)"""
    try:
        content = {
            "text": req.text,
            "source_lang": req.source_lang,
            "target_lang": req.target_lang
        }
        
        result = await llm_router.route_request(
            question_type="translate",
            content=str(content),
            mode="deep"
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Çeviri başarısız: {str(e)}")



# ============================================
# MULTI-AI COMPARISON SYSTEM
# ============================================

@api_router.post("/multi-ai/compare")
async def multi_ai_compare(req: MultiAIRequest):
    """
    Çoklu AI karşılaştırma sistemi
    - Seçili AI'lara paralel sorgu gönder
    - Cevapları karşılaştır
    - Konsensüs analizi yap
    """
    import time
    import asyncio
    
    start_time = time.time()
    timeout = req.timeout if req.timeout else (600 if req.detailed_mode else 60)
    
    # AI model mapping - Sadece gerçek çalışan AI'lar
    ai_model_map = {
        "chatgpt": ("openai", "gpt-4o"),
        "gemini": ("gemini", "gemini-2.0-flash"),
        "claude": ("anthropic", "claude-3-7-sonnet-20250219"),
    }
    
    async def query_single_ai(ai_name: str):
        """Tek bir AI'ya sorgu gönder"""
        ai_start = time.time()
        
        try:
            # Sadece desteklenen AI'lar için gerçek sorgu yap
            if ai_name in ai_model_map:
                provider, model = ai_model_map[ai_name]
                
                result = await asyncio.wait_for(
                    llm_router.route_request(
                        question_type="general",
                        content=req.question,
                        mode="fast",
                        user_preference=f"{provider}-{model}" if ai_name == "chatgpt" else model
                    ),
                    timeout=timeout
                )
                
                return AIResponse(
                    ai_name=ai_name.upper(),
                    answer=result.get("answer", ""),
                    status="success",
                    response_time=time.time() - ai_start
                )
            else:
                # Diğer AI'lar için placeholder
                await asyncio.sleep(1)  # Simüle et
                return AIResponse(
                    ai_name=ai_name.upper(),
                    answer=f"[{ai_name.upper()}] API entegrasyonu yapılmadı",
                    status="error",
                    response_time=time.time() - ai_start
                )
                
        except asyncio.TimeoutError:
            return AIResponse(
                ai_name=ai_name.upper(),
                answer=None,
                status="timeout",
                response_time=timeout
            )
        except Exception as e:
            return AIResponse(
                ai_name=ai_name.upper(),
                answer=str(e),
                status="error",
                response_time=time.time() - ai_start
            )
    
    # Tüm AI'lara paralel sorgu gönder
    tasks = [query_single_ai(ai.value) for ai in req.selected_ais]
    responses = await asyncio.gather(*tasks)
    
    # Konsensüs analizi
    successful_responses = [r for r in responses if r.status == "success"]
    
    if len(successful_responses) == 0:
        # Hiç başarılı cevap yok
        mode = "error"
        consensus_rate = 0.0
        majority_answer = None
        recommendation = "❌ Hiç AI cevap veremedi. Lütfen tekrar deneyin."
    elif len(successful_responses) == 1:
        # Tek cevap
        mode = "single"
        consensus_rate = 1.0
        majority_answer = successful_responses[0].answer
        recommendation = "💡 Sadece 1 AI cevap verdi. Daha güvenilir sonuç için daha fazla AI seçebilirsiniz."
    else:
        # Çoklu cevap - gelişmiş konsensüs analizi
        answers = [r.answer for r in successful_responses]
        
        # İleri seviye benzerlik kontrolü
        def calculate_similarity(text1: str, text2: str) -> float:
            """İki metin arasında gelişmiş benzerlik hesapla"""
            if not text1 or not text2:
                return 0.0
            
            # Normalize et - noktalama işaretlerini ve fazla boşlukları temizle
            import re
            t1 = re.sub(r'[^\w\s]', '', text1.strip().lower())
            t2 = re.sub(r'[^\w\s]', '', text2.strip().lower())
            t1 = ' '.join(t1.split())
            t2 = ' '.join(t2.split())
            
            # Aynıysa
            if t1 == t2:
                return 1.0
            
            # Çok kısa cevaplar için (matematik gibi) - anahtar kelimeler aynı mı?
            if len(t1.split()) <= 5 and len(t2.split()) <= 5:
                # Sayıları ve anahtar kelimeleri kontrol et
                key_match = 0
                for word in t1.split():
                    if word in t2:
                        key_match += 1
                
                if key_match > 0:
                    # Eğer ana kelimeler eşleşiyorsa yüksek benzerlik
                    return min(1.0, key_match / max(len(t1.split()), len(t2.split())) + 0.3)
            
            # Token-based similarity
            tokens1 = set(t1.split())
            tokens2 = set(t2.split())
            
            if not tokens1 or not tokens2:
                return 0.0
            
            intersection = tokens1.intersection(tokens2)
            union = tokens1.union(tokens2)
            
            jaccard = len(intersection) / len(union) if union else 0.0
            
            # Uzunluk benzerliği de ekle
            length_similarity = 1 - abs(len(t1) - len(t2)) / max(len(t1), len(t2))
            
            # Ortalama
            return (jaccard * 0.7 + length_similarity * 0.3)
        
        # Tüm cevapları birbirleriyle karşılaştır
        similarities = []
        for i in range(len(answers)):
            for j in range(i + 1, len(answers)):
                sim = calculate_similarity(answers[i], answers[j])
                similarities.append(sim)
        
        # Ortalama benzerlik
        avg_similarity = sum(similarities) / len(similarities) if similarities else 0.0
        
        # Debug log
        print(f"DEBUG: Average similarity: {avg_similarity:.2f}")
        print(f"DEBUG: All similarities: {[f'{s:.2f}' for s in similarities]}")
        
        # Eğer tüm cevaplar çok benzerse (>80% benzerlik) - TEK CEVAP MODU
        if avg_similarity >= 0.80:
            mode = "perfect_consensus"
            consensus_rate = 1.0
            majority_answer = answers[0]  # Hepsi aynı, ilkini göster
            recommendation = f"🎉 MÜKEMMEL UYUŞMA! Tüm {len(successful_responses)} AI aynı cevabı verdi. %100 güvenilirlik."
        else:
            # Çoğunluk analizi
            from collections import Counter
            answer_counter = Counter([a.strip().lower()[:150] for a in answers if a])
            most_common = answer_counter.most_common(1)[0] if answer_counter else (None, 0)
            
            consensus_rate = most_common[1] / len(successful_responses) if most_common[1] > 0 else 0
            majority_answer = next((a for a in answers if a.strip().lower()[:150] == most_common[0]), answers[0])
            
            if consensus_rate >= 0.8:
                mode = "consensus"
                recommendation = f"🎯 Yüksek güvenilirlik - {int(consensus_rate*100)}% AI aynı fikirde"
            elif consensus_rate >= 0.5:
                mode = "comparison"
                recommendation = f"⚖️ Orta güvenilirlik - AI'lar kısmen hemfikir ({int(consensus_rate*100)}%)"
            else:
                mode = "comparison"
                recommendation = "⚠️ Dikkat - AI'lar farklı görüşlerde. Ek araştırma önerilir."
    
    total_time = time.time() - start_time
    
    return MultiAIComparisonResponse(
        mode=mode,
        responses=responses,
        consensus_rate=consensus_rate,
        majority_answer=majority_answer,
        recommendation=recommendation,
        total_time=total_time
    )


# ============================================
# QUESTION GENERATION & MANAGEMENT
# ============================================

# Hazır matematik soruları
PRESET_MATH_QUESTIONS = {
    "dört_işlem": [
        {"question": "25 + 47 = ?", "answer": "72", "explanation": "25 ile 47'yi toplarken: 20 + 40 = 60, 5 + 7 = 12, toplam 72", "difficulty": 1},
        {"question": "134 - 67 = ?", "answer": "67", "explanation": "134'ten 67 çıkarırsak 67 kalır", "difficulty": 2},
        {"question": "12 × 8 = ?", "answer": "96", "explanation": "12'yi 8 ile çarparken: 12 × 8 = 96", "difficulty": 2},
        {"question": "144 ÷ 12 = ?", "answer": "12", "explanation": "144'ü 12'ye böldüğümüzde 12 elde ederiz", "difficulty": 2},
    ],
    "üslü_sayılar": [
        {"question": "2³ = ?", "answer": "8", "explanation": "2³ = 2 × 2 × 2 = 8", "difficulty": 2},
        {"question": "5² = ?", "answer": "25", "explanation": "5² = 5 × 5 = 25", "difficulty": 1},
        {"question": "3⁴ = ?", "answer": "81", "explanation": "3⁴ = 3 × 3 × 3 × 3 = 81", "difficulty": 3},
    ]
}

# Hazır Türkçe soruları
PRESET_TURKISH_QUESTIONS = {
    "noktalama": [
        {
            "question": "Hangi cümlede noktalama doğru kullanılmıştır?",
            "options": [
                "Ali gel buraya.",
                "Ali, gel buraya.",
                "Ali gel, buraya.",
                "Ali; gel buraya."
            ],
            "answer": "Ali, gel buraya.",
            "explanation": "Hitap sözcüklerinden sonra virgül kullanılır.",
            "difficulty": 2
        }
    ],
    "fiilimsi": [
        {
            "question": "'Koşan çocuk' örneğinde hangi fiilimsi vardır?",
            "options": ["Sıfat-fiil", "Zarf-fiil", "İsim-fiil", "Fiilimsi yoktur"],
            "answer": "Sıfat-fiil",
            "explanation": "'-an/-en' eki sıfat-fiil ekidir ve ismi niteler.",
            "difficulty": 3
        }
    ]
}


@api_router.post("/questions/generate")
async def generate_question(req: GenerateQuestionRequest):
    """Soru üret (hibrit: hazır havuz veya AI)"""
    
    # Kolay-orta sorular: hazır havuzdan
    if not req.use_ai and req.difficulty.value <= 3:
        if req.subject == SubjectType.MATH:
            category_questions = PRESET_MATH_QUESTIONS.get(req.category, [])
            if category_questions:
                # Zorluğa göre filtrele
                filtered = [q for q in category_questions if q.get("difficulty", 1) == req.difficulty.value]
                if filtered:
                    question = random.choice(filtered)
                    question["id"] = str(uuid.uuid4())
                    question["source"] = "preset"
                    return question
        
        elif req.subject == SubjectType.TURKISH:
            category_questions = PRESET_TURKISH_QUESTIONS.get(req.category, [])
            if category_questions:
                filtered = [q for q in category_questions if q.get("difficulty", 1) == req.difficulty.value]
                if filtered:
                    question = random.choice(filtered)
                    question["id"] = str(uuid.uuid4())
                    question["source"] = "preset"
                    return question
    
    # Zor sorular veya AI talep edildi: LLM kullan
    if req.subject == SubjectType.MATH:
        prompt = f"""
Lütfen aşağıdaki özelliklerde bir matematik sorusu üret:

Kategori: {req.category}
Zorluk: {req.difficulty.value}/5

Soruyu JSON formatında ver:
{{
    "question": "soru metni",
    "answer": "doğru cevap",
    "explanation": "adım adım açıklama"
}}

Sadece JSON döndür, başka metin ekleme.
"""
        
        result = await llm_router.route_request(
            question_type="math_fast",
            content=prompt,
            mode="fast"
        )
        
        try:
            import json
            question_data = json.loads(result.get("answer", "{}"))
            question_data["id"] = str(uuid.uuid4())
            question_data["source"] = "ai"
            question_data["model"] = result.get("model")
            return question_data
        except:
            raise HTTPException(status_code=500, detail="AI soru üretimi başarısız")
    
    elif req.subject == SubjectType.TURKISH:
        prompt = f"""
Lütfen aşağıdaki özelliklerde bir Türkçe dilbilgisi sorusu üret:

Kategori: {req.category}
Zorluk: {req.difficulty.value}/5

Soruyu JSON formatında ver:
{{
    "question": "soru metni",
    "options": ["A", "B", "C", "D"],
    "answer": "doğru cevap",
    "explanation": "detaylı açıklama"
}}

Sadece JSON döndür.
"""
        
        result = await llm_router.route_request(
            question_type="turkish_grammar",
            content=prompt,
            mode="fast"
        )
        
        try:
            import json
            question_data = json.loads(result.get("answer", "{}"))
            question_data["id"] = str(uuid.uuid4())
            question_data["source"] = "ai"
            question_data["model"] = result.get("model")
            return question_data
        except:
            raise HTTPException(status_code=500, detail="AI soru üretimi başarısız")
    
    raise HTTPException(status_code=400, detail="Desteklenmeyen konu")


@api_router.post("/questions/verify")
async def verify_answer(req: VerifyAnswerRequest):
    """Kullanıcı cevabını doğrula ve istatistikleri güncelle"""
    
    # Session'ı bul
    session = await db.sessions.find_one({"_id": req.session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Oturum bulunamadı")
    
    # Soruyu bul (eğer veritabanında kaydedilmişse)
    question = await db.questions.find_one({"_id": req.question_id})
    
    is_correct = False
    if question:
        is_correct = (req.user_answer.strip().lower() == question.get("correct_answer", "").strip().lower())
    
    # Session güncelle
    update_data = {
        "$inc": {"questions_answered": 1}
    }
    if is_correct:
        update_data["$inc"]["correct_count"] = 1
    
    await db.sessions.update_one({"_id": req.session_id}, update_data)
    
    # User stats güncelle
    user_id = session.get("user_id")
    if user_id:
        user_update = {
            "$inc": {"stats.total_points": 10 if is_correct else 0, "stats.correct_answers": 1 if is_correct else 0}
        }
        await db.users.update_one({"_id": user_id}, user_update)
    
    return {
        "is_correct": is_correct,
        "explanation": question.get("explanation") if question else None
    }


# ============================================
# GAMES
# ============================================

@api_router.post("/games/math/start")
async def start_math_game(user_id: str, game_type: str):
    """Matematik oyunu başlat"""
    game_id = str(uuid.uuid4())
    
    game_data = {
        "_id": game_id,
        "user_id": user_id,
        "game_type": game_type,
        "start_time": datetime.utcnow(),
        "score": 0,
        "questions_answered": 0
    }
    
    await db.games.insert_one(game_data)
    
    return {"game_id": game_id, "message": f"{game_type} oyunu başladı!"}


@api_router.post("/games/turkish/start")
async def start_turkish_game(user_id: str, game_type: str):
    """Türkçe oyunu başlat"""
    game_id = str(uuid.uuid4())
    
    game_data = {
        "_id": game_id,
        "user_id": user_id,
        "game_type": game_type,
        "start_time": datetime.utcnow(),
        "score": 0,
        "questions_answered": 0
    }
    
    await db.games.insert_one(game_data)
    
    return {"game_id": game_id, "message": f"{game_type} oyunu başladı!"}


@api_router.post("/games/score")
async def save_game_score(game_id: str, score: int, duration: int):
    """Oyun skorunu kaydet"""
    
    await db.games.update_one(
        {"_id": game_id},
        {
            "$set": {
                "score": score,
                "duration": duration,
                "end_time": datetime.utcnow()
            }
        }
    )
    
    # User stats güncelle
    game = await db.games.find_one({"_id": game_id})
    if game:
        user_id = game.get("user_id")
        await db.users.update_one(
            {"_id": user_id},
            {"$inc": {"stats.games_played": 1, "stats.total_points": score}}
        )
    
    return {"success": True, "score": score}


@api_router.get("/")
async def root():
    """API sağlık kontrolü"""
    return {
        "app": "NeuranaWorld", 
        "version": "1.0.0",
        "status": "healthy",
        "description": "Çoklu-LLM destekli eğitim platformu"
    }


# ============================================
# CONSENSUS & POLYNOMIAL ARENA
# ============================================

from consensus_engine import consensus_engine
from turkish_games import turkish_games
from turkish_question_generator import turkish_question_generator
from word_validator import word_validator

@api_router.post("/llm/consensus")
async def consensus_solve(req: DeepThinkRequest):
    """
    %0 hata hedefi ile konsensus çözüm
    - K-self-consistency
    - Çapraz doğrulama
    - Kural tabanlı kontrol
    """
    try:
        # K-self-consistency (3 kez sor, çoğunluk oyu)
        k_result = await consensus_engine.k_self_consistency(
            question=req.question,
            k=3,
            model="gpt-4o"
        )
        
        # Eğer güven düşükse çapraz doğrulama yap
        if k_result.get("confidence", 0) < 0.95:
            cross_result = await consensus_engine.cross_verification(
                question=req.question,
                primary_model="gpt-4o",
                verifier_model="claude-sonnet-4"
            )
            
            return {
                **cross_result,
                "method": "cross-verification",
                "k_consistency": k_result,
                "confidence_boost": True
            }
        
        return {
            **k_result,
            "method": "k-self-consistency",
            "threshold_met": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Konsensus hatası: {str(e)}")


@api_router.post("/games/polynomial-arena/start")
async def start_polynomial_arena(user_id: str, level: int = 1):
    """
    Polinom Arena oyunu başlat
    
    Seviyeler:
    1-5: Kolay (derece ≤ 3, tam sayı kökler)
    6-10: Orta (derece ≤ 5, rasyonel kökler)
    11-15: Zor (derece ≤ 8, karmaşık kökler)
    16+: Usta (faktörizasyon + bölme)
    """
    game_id = str(uuid.uuid4())
    
    # Seviye parametreleri
    if level <= 5:
        degree = random.randint(2, 3)
        coeff_range = (-10, 10)
        difficulty_label = "Kolay"
    elif level <= 10:
        degree = random.randint(3, 5)
        coeff_range = (-20, 20)
        difficulty_label = "Orta"
    elif level <= 15:
        degree = random.randint(5, 8)
        coeff_range = (-50, 50)
        difficulty_label = "Zor"
    else:
        degree = random.randint(6, 8)
        coeff_range = (-100, 100)
        difficulty_label = "Usta"
    
    # AI ile polinom sorusu üret
    prompt = f"""
Seviye {level} ({difficulty_label}) için bir polinom sorusu üret:

Parametreler:
- Derece: {degree}
- Katsayı aralığı: {coeff_range}

Soru tiplerinden birini seç:
1. Çarpanlara Ayırma: "P(x) = ... polinomunu çarpanlarına ayır"
2. Kök Bulma: "P(x) = 0 denkleminin köklerini bul"
3. Polinom Bölme: "P(x)'i Q(x)'e böl, bölüm ve kalanı bul"
4. Çoktan Seçmeli: "Aşağıdakilerden hangisi P(x)'in çarpanıdır?"

JSON formatında döndür:
{{
    "polynomial": "x^2 + 5x + 6",
    "question": "Soru metni",
    "question_type": "factorization",
    "correct_answer": "Doğru cevap",
    "options": ["A", "B", "C", "D"],  // Çoktan seçmeli ise
    "explanation": "Adım adım çözüm",
    "difficulty": {level}
}}
"""
    
    try:
        result = await llm_router.route_request(
            question_type="math_deep",
            content=prompt,
            mode="deep"
        )
        
        import json
        question_data = json.loads(result.get("answer", "{}"))
        
        # Oyun verisini kaydet
        game_data = {
            "_id": game_id,
            "user_id": user_id,
            "game_type": "polynomial_arena",
            "level": level,
            "difficulty": difficulty_label,
            "question": question_data,
            "start_time": datetime.utcnow(),
            "score": 0,
            "turns_completed": 0
        }
        
        await db.games.insert_one(game_data)
        
        return {
            "game_id": game_id,
            "level": level,
            "difficulty": difficulty_label,
            "question": question_data,
            "message": f"Polinom Arena - Seviye {level} başladı!"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Oyun başlatılamadı: {str(e)}")


@api_router.post("/games/polynomial-arena/answer")
async def answer_polynomial_question(
    game_id: str,
    user_answer: str
):
    """
    Polinom Arena cevap doğrulama
    Konsensus engine ile %0 hata kontrolü
    """
    try:
        # Oyunu bul
        game = await db.games.find_one({"_id": game_id})
        if not game:
            raise HTTPException(status_code=404, detail="Oyun bulunamadı")
        
        question_data = game.get("question", {})
        correct_answer = question_data.get("correct_answer", "")
        
        # Cevabı doğrula - Konsensus ile
        verify_prompt = f"""
Polinom sorusu: {question_data.get('question')}
Doğru cevap: {correct_answer}
Kullanıcı cevabı: {user_answer}

Bu iki cevap matematiksel olarak eşdeğer mi? 
(Örn: (x+2)(x+3) ile x^2+5x+6 eşdeğerdir)

JSON formatında yanıt ver:
{{
    "is_correct": true/false,
    "confidence": 0.0-1.0,
    "explanation": "Açıklama"
}}
"""
        
        verify_result = await llm_router.route_request(
            question_type="math_deep",
            content=verify_prompt,
            mode="deep"
        )
        
        import json
        verification = json.loads(verify_result.get("answer", "{}"))
        
        is_correct = verification.get("is_correct", False)
        confidence = verification.get("confidence", 0.0)
        
        # Puanla
        if is_correct:
            xp_gained = 10
            await db.games.update_one(
                {"_id": game_id},
                {
                    "$inc": {"score": xp_gained, "turns_completed": 1},
                    "$set": {"last_answer_correct": True}
                }
            )
            
            # User stats güncelle
            await db.users.update_one(
                {"_id": game.get("user_id")},
                {"$inc": {"stats.total_points": xp_gained, "stats.correct_answers": 1}}
            )
            
            message = f"✅ Doğru! +{xp_gained} XP"
        else:
            await db.games.update_one(
                {"_id": game_id},
                {
                    "$inc": {"turns_completed": 1},
                    "$set": {"last_answer_correct": False}
                }
            )
            message = "❌ Yanlış. Doğru cevap: " + correct_answer
        
        return {
            "is_correct": is_correct,
            "confidence": confidence,
            "message": message,
            "explanation": question_data.get("explanation", ""),
            "xp_gained": xp_gained if is_correct else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cevap doğrulanamadı: {str(e)}")


# ============================================
# TÜRKÇE OYUNLARI
# ============================================

@api_router.post("/games/turkish/hangman/start")
async def start_hangman(user_id: str, difficulty: str = "kolay"):
    """Adam Asmaca 2.0 başlat"""
    game_id = str(uuid.uuid4())
    
    game_data = turkish_games.generate_hangman(difficulty)
    game_data["_id"] = game_id
    game_data["user_id"] = user_id
    game_data["start_time"] = datetime.utcnow()
    
    await db.games.insert_one(game_data)
    
    return {
        "game_id": game_id,
        "hint": game_data["hint"],
        "display_word": game_data["display_word"],
        "remaining_attempts": game_data["remaining_attempts"],
        "difficulty": difficulty
    }


@api_router.post("/games/turkish/hangman/guess")
async def guess_hangman(request: dict):
    """Adam Asmaca tahmin"""
    game_id = request.get("game_id")
    letter = request.get("letter", "").upper()
    
    if not game_id or not letter:
        raise HTTPException(status_code=400, detail="game_id ve letter gerekli")
    
    game = await db.games.find_one({"_id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    result = turkish_games.check_hangman_guess(game, letter)
    
    # Veritabanını güncelle
    await db.games.update_one(
        {"_id": game_id},
        {"$set": result}
    )
    
    # Kazandıysa puan ver
    if result.get("game_status") == "won":
        await db.users.update_one(
            {"_id": game.get("user_id")},
            {"$inc": {"stats.total_points": 20, "stats.games_played": 1}}
        )
    
    return result


@api_router.post("/games/turkish/word-chain/start")
async def start_word_chain(user_id: str):
    """Kelime Türetme başlat"""
    game_id = str(uuid.uuid4())
    
    game_data = turkish_games.generate_word_chain()
    game_data["_id"] = game_id
    game_data["user_id"] = user_id
    game_data["start_time"] = datetime.utcnow()
    
    await db.games.insert_one(game_data)
    
    return {
        "game_id": game_id,
        "current_word": game_data["current_word"],
        "last_letter": game_data["last_letter"],
        "score": 0,
        "message": f"İlk kelime: {game_data['current_word']}. Şimdi '{game_data['last_letter']}' harfi ile başla!"
    }


@api_router.post("/games/turkish/word-chain/answer")
async def answer_word_chain(request: dict):
    """Kelime türetme cevap"""
    game_id = request.get("game_id")
    word = request.get("word", "").upper()
    
    if not game_id or not word:
        raise HTTPException(status_code=400, detail="game_id ve word gerekli")
    
    game = await db.games.find_one({"_id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    result = turkish_games.validate_word_chain(game, word)
    
    # Güncelle
    await db.games.update_one(
        {"_id": game_id},
        {"$set": result}
    )
    
    if result.get("is_valid"):
        await db.users.update_one(
            {"_id": game.get("user_id")},
            {"$inc": {"stats.total_points": 10}}
        )
    
    return result


@api_router.get("/games/turkish/punctuation/quiz")
async def get_punctuation_quiz():
    """Noktalama oyunu sorusu al - Mantık tabanlı"""
    try:
        return turkish_question_generator.generate_grammar_question("noktalama", difficulty=random.choice([1, 2, 3]))
    except Exception as e:
        print(f"Punctuation quiz error: {e}")
        return turkish_games.generate_punctuation_quiz()


@api_router.get("/games/turkish/fiilimsi/quiz")
async def get_fiilimsi_quiz():
    """Fiilimsi oyunu sorusu al - Mantık tabanlı"""
    try:
        return turkish_question_generator.generate_grammar_question("fiilimsa", difficulty=2)
    except Exception as e:
        print(f"Fiilimsa quiz error: {e}")
        return turkish_games.generate_fiilimsi_quiz()


@api_router.get("/games/turkish/grammar/quiz")
async def get_grammar_quiz(topic: str = "noktalama", difficulty: int = 2):
    """Genel dil bilgisi sorusu al - Mantık tabanlı"""
    try:
        question = turkish_question_generator.generate_grammar_question(topic, difficulty)
        
        # Doğrulama
        if turkish_question_generator.validate_question(question):
            return question
        else:
            # Doğrulama başarısız, tekrar üret
            return turkish_question_generator.generate_grammar_question(topic, difficulty)
    except Exception as e:
        print(f"Grammar quiz error: {e}")
        # Fallback
        return turkish_games.generate_punctuation_quiz()

# ============================================
# MATEMATİK OYUNLARI
# ============================================

@api_router.post("/games/math/basic-ops/start")
async def start_basic_ops(user_id: str, operation: str = "all"):
    """
    Dört İşlem Oyunu
    operation: addition, subtraction, multiplication, division, all
    """
    game_id = str(uuid.uuid4())
    
    # İşlem seç
    ops = {
        "addition": "+",
        "subtraction": "-",
        "multiplication": "×",
        "division": "÷"
    }
    
    if operation == "all":
        selected_op = random.choice(list(ops.values()))
    else:
        selected_op = ops.get(operation, "+")
    
    # Sayılar üret
    if selected_op == "+":
        a, b = random.randint(1, 50), random.randint(1, 50)
        answer = a + b
        question = f"{a} + {b} = ?"
    elif selected_op == "-":
        a, b = random.randint(10, 100), random.randint(1, 50)
        answer = a - b
        question = f"{a} - {b} = ?"
    elif selected_op == "×":
        a, b = random.randint(2, 12), random.randint(2, 12)
        answer = a * b
        question = f"{a} × {b} = ?"
    else:  # division
        b = random.randint(2, 12)
        answer = random.randint(2, 12)
        a = answer * b
        question = f"{a} ÷ {b} = ?"
    
    game_data = {
        "_id": game_id,
        "user_id": user_id,
        "game_type": "basic_ops",
        "question": question,
        "correct_answer": str(answer),
        "operation": selected_op,
        "start_time": datetime.utcnow(),
        "score": 0
    }
    
    await db.games.insert_one(game_data)
    
    return {
        "game_id": game_id,
        "question": question,
        "operation": selected_op
    }


@api_router.post("/games/math/basic-ops/answer")
async def answer_basic_ops(request: dict):
    """Dört işlem cevap doğrula"""
    game_id = request.get("game_id")
    user_answer = request.get("user_answer", "")
    
    if not game_id or not user_answer:
        raise HTTPException(status_code=400, detail="game_id ve user_answer gerekli")
    
    game = await db.games.find_one({"_id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    correct_answer = str(game.get("correct_answer", ""))
    is_correct = (str(user_answer).strip() == correct_answer.strip())
    
    if is_correct:
        await db.games.update_one(
            {"_id": game_id},
            {"$inc": {"score": 10}}
        )
        await db.users.update_one(
            {"_id": game.get("user_id")},
            {"$inc": {"stats.total_points": 10, "stats.correct_answers": 1}}
        )
        
        return {
            "is_correct": True,
            "message": "✅ Doğru! +10 puan",
            "correct_answer": correct_answer
        }
    else:
        return {
            "is_correct": False,
            "message": f"❌ Yanlış. Doğru cevap: {correct_answer}",
            "correct_answer": correct_answer
        }


@api_router.post("/games/math/number-guess/start")
async def start_number_guess(user_id: str):
    """Sayı Tahmin Oyunu"""
    game_id = str(uuid.uuid4())
    
    target = random.randint(1, 100)
    
    game_data = {
        "_id": game_id,
        "user_id": user_id,
        "game_type": "number_guess",
        "target_number": target,
        "attempts": 0,
        "max_attempts": 7,
        "guesses": [],
        "start_time": datetime.utcnow()
    }
    
    await db.games.insert_one(game_data)
    
    return {
        "game_id": game_id,
        "message": "1 ile 100 arasında bir sayı tuttum. 7 hakta tahmin et!",
        "max_attempts": 7
    }


@api_router.post("/games/math/number-guess/guess")
async def guess_number(request: dict):
    """Sayı tahmin"""
    game_id = request.get("game_id")
    guess = request.get("guess")
    
    if not game_id or guess is None:
        raise HTTPException(status_code=400, detail="game_id ve guess gerekli")
    
    guess = int(guess)
    
    game = await db.games.find_one({"_id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    target = game.get("target_number")
    attempts = game.get("attempts", 0) + 1
    max_attempts = game.get("max_attempts", 7)
    guesses = game.get("guesses", [])
    guesses.append(guess)
    
    if guess == target:
        # Kazandı
        await db.games.update_one(
            {"_id": game_id},
            {"$set": {"attempts": attempts, "guesses": guesses, "status": "won"}}
        )
        await db.users.update_one(
            {"_id": game.get("user_id")},
            {"$inc": {"stats.total_points": 30, "stats.games_played": 1}}
        )
        
        return {
            "is_correct": True,
            "message": f"🎉 Tebrikler! {attempts} denemede buldun! +30 puan",
            "target_number": target,
            "game_over": True
        }
    elif attempts >= max_attempts:
        # Kaybetti
        await db.games.update_one(
            {"_id": game_id},
            {"$set": {"attempts": attempts, "guesses": guesses, "status": "lost"}}
        )
        
        return {
            "is_correct": False,
            "message": f"😞 Hakkın bitti! Sayı: {target}",
            "target_number": target,
            "game_over": True
        }
    else:
        # Devam
        hint = "büyük" if guess < target else "küçük"
        await db.games.update_one(
            {"_id": game_id},
            {"$set": {"attempts": attempts, "guesses": guesses}}
        )
        
        return {
            "is_correct": False,
            "message": f"Daha {hint}! Kalan hak: {max_attempts - attempts}",
            "hint": hint,
            "attempts_left": max_attempts - attempts,
            "game_over": False
        }


# ============================================
# YENİ OYUNLAR - POLINOM VE SUDOKU
# ============================================

@api_router.post("/games/math/polynomial/start")
async def start_polynomial(user_id: str, degree: int = 2):
    """Polinom çarpanlara ayırma oyunu başlat"""
    import sympy as sp
    from sympy import symbols, expand, factor
    
    game_id = str(uuid.uuid4())
    x = symbols('x')
    
    # Rastgele polinom oluştur
    if degree == 2:
        # (x+a)(x+b) formatında
        a, b = random.randint(-10, 10), random.randint(-10, 10)
        polynomial = expand((x + a) * (x + b))
        factored = f"(x{'+' if a >= 0 else ''}{a})(x{'+' if b >= 0 else ''}{b})"
    elif degree == 3:
        # (x+a)(x+b)(x+c)
        a, b, c = random.randint(-5, 5), random.randint(-5, 5), random.randint(-5, 5)
        polynomial = expand((x + a) * (x + b) * (x + c))
        factored = f"(x{'+' if a >= 0 else ''}{a})(x{'+' if b >= 0 else ''}{b})(x{'+' if c >= 0 else ''}{c})"
    else:
        # Daha zor
        a, b = random.randint(-8, 8), random.randint(-8, 8)
        polynomial = expand((x + a) * (x + b) * (x + 1) * (x - 1))
        factored = f"(x{'+' if a >= 0 else ''}{a})(x{'+' if b >= 0 else ''}{b})(x+1)(x-1)"
    
    game_data = {
        "_id": game_id,
        "user_id": user_id,
        "game_type": "polynomial",
        "polynomial": str(polynomial),
        "factored_form": factored,
        "degree": degree,
        "start_time": datetime.utcnow()
    }
    
    await db.games.insert_one(game_data)
    
    return {
        "game_id": game_id,
        "polynomial": str(polynomial)
    }


@api_router.post("/games/math/polynomial/answer")
async def answer_polynomial(request: dict):
    """Polinom cevabını kontrol et"""
    game_id = request.get("game_id")
    user_answer = request.get("user_answer", "").replace(" ", "")
    
    if not game_id or not user_answer:
        raise HTTPException(status_code=400, detail="game_id ve user_answer gerekli")
    
    game = await db.games.find_one({"_id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    correct_answer = game.get("factored_form", "").replace(" ", "")
    
    # Basit karşılaştırma
    is_correct = user_answer.lower() == correct_answer.lower()
    
    if is_correct:
        await db.users.update_one(
            {"_id": game.get("user_id")},
            {"$inc": {"stats.total_points": 15}}
        )
        return {
            "is_correct": True,
            "message": "✅ Doğru! Polinom başarıyla çarpanlarına ayrıldı!",
            "correct_answer": correct_answer
        }
    else:
        return {
            "is_correct": False,
            "message": f"❌ Yanlış. Doğru cevap: {correct_answer}",
            "correct_answer": correct_answer
        }


@api_router.get("/games/math/polynomial/hint")
async def get_polynomial_hint(game_id: str):
    """Polinom için ipucu ver"""
    game = await db.games.find_one({"_id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    hints = [
        "İki sayıyı çarpınca polinomu veren sayıları bul",
        "Katsayılara dikkat et",
        "Çarpanlara ayırmak için gruplandırma kullan",
        "Ortak çarpan parantezine al"
    ]
    
    return {"hint": random.choice(hints)}


@api_router.post("/games/math/sudoku/start")
async def start_sudoku(user_id: str, difficulty: str = "medium"):
    """Sudoku oyunu başlat"""
    game_id = str(uuid.uuid4())
    
    # Basit sudoku oluşturma (gerçek uygulamada daha gelişmiş algoritma kullanılır)
    def generate_sudoku(difficulty_level):
        # Çözülmüş bir sudoku tabanı
        base = [[0]*9 for _ in range(9)]
        
        # Basit bir başlangıç tahtası (örnek)
        solved_board = [
            [5,3,4,6,7,8,9,1,2],
            [6,7,2,1,9,5,3,4,8],
            [1,9,8,3,4,2,5,6,7],
            [8,5,9,7,6,1,4,2,3],
            [4,2,6,8,5,3,7,9,1],
            [7,1,3,9,2,4,8,5,6],
            [9,6,1,5,3,7,2,8,4],
            [2,8,7,4,1,9,6,3,5],
            [3,4,5,2,8,6,1,7,9]
        ]
        
        # Rastgele hücreleri sil
        board = [row[:] for row in solved_board]
        cells_to_remove = {'easy': 30, 'medium': 40, 'hard': 50}.get(difficulty_level, 40)
        
        removed = 0
        while removed < cells_to_remove:
            row, col = random.randint(0, 8), random.randint(0, 8)
            if board[row][col] != 0:
                board[row][col] = 0
                removed += 1
        
        return board, solved_board
    
    board, solution = generate_sudoku(difficulty)
    
    game_data = {
        "_id": game_id,
        "user_id": user_id,
        "game_type": "sudoku",
        "board": board,
        "solution": solution,
        "difficulty": difficulty,
        "start_time": datetime.utcnow()
    }
    
    await db.games.insert_one(game_data)
    
    return {
        "game_id": game_id,
        "board": board,
        "difficulty": difficulty
    }


@api_router.post("/games/math/sudoku/check")
async def check_sudoku(request: dict):
    """Sudoku tahtasını kontrol et"""
    game_id = request.get("game_id")
    board = request.get("board")
    
    if not game_id or not board:
        raise HTTPException(status_code=400, detail="game_id ve board gerekli")
    
    game = await db.games.find_one({"_id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    solution = game.get("solution")
    
    # Kontrol et
    mistakes = 0
    is_complete = True
    
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                is_complete = False
            elif board[i][j] != solution[i][j]:
                mistakes += 1
    
    if is_complete and mistakes == 0:
        await db.users.update_one(
            {"_id": game.get("user_id")},
            {"$inc": {"stats.total_points": 50}}
        )
        return {
            "is_complete": True,
            "mistakes": 0,
            "message": "🎉 Tebrikler! Sudoku çözüldü!"
        }
    
    return {
        "is_complete": False,
        "mistakes": mistakes
    }


# ============================================
# İSİM-ŞEHİR-HAYVAN DOĞRULAMA
# ============================================

@api_router.post("/games/isim-sehir-hayvan/validate")
async def validate_isim_sehir_hayvan(request: dict):
    """İsim-Şehir-Hayvan cevaplarını doğrula"""
    answers = request.get("answers", {})
    target_letter = request.get("letter", "")
    
    if not answers or not target_letter:
        raise HTTPException(status_code=400, detail="answers ve letter gerekli")
    
    # Doğrulama yap
    validation_results = word_validator.validate_all_answers(answers, target_letter)
    
    return validation_results



# ============================================
# 101 OKEY OYUNU
# ============================================

from okey_game import OkeyGame

# In-memory oyun deposu (production'da Redis kullanılmalı)
active_okey_games = {}

@api_router.post("/games/okey/start")
async def start_okey_game(user_id: str):
    """101 Okey oyunu başlat"""
    game_id = str(uuid.uuid4())
    
    # Yeni oyun oluştur
    game = OkeyGame(game_id, user_id)
    game_start_data = game.start_game()
    
    # Oyunu depola
    active_okey_games[game_id] = game
    
    # MongoDB'ye de kaydet
    await db.games.insert_one(game.to_dict())
    
    return {
        "game_id": game_id,
        "message": "101 Okey oyunu başladı!",
        **game_start_data,
        "game_state": game.get_game_state()
    }


@api_router.get("/games/okey/{game_id}/state")
async def get_okey_game_state(game_id: str):
    """Oyun durumunu getir"""
    if game_id not in active_okey_games:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    game = active_okey_games[game_id]
    return game.get_game_state()


@api_router.post("/games/okey/{game_id}/draw")
async def draw_okey_tile(game_id: str, from_discard: bool = False):
    """Taş çek"""
    if game_id not in active_okey_games:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    game = active_okey_games[game_id]
    
    if game.current_turn != "user":
        raise HTTPException(status_code=400, detail="Sizin sıranız değil")
    
    # Taş çek
    tile = game.draw_tile("user", from_discard)
    
    if not tile:
        raise HTTPException(status_code=400, detail="Taş çekilemedi")
    
    # MongoDB'yi güncelle
    await db.games.update_one(
        {"_id": game_id},
        {"$set": game.to_dict()}
    )
    
    return {
        "tile": tile.to_dict(),
        "game_state": game.get_game_state()
    }


@api_router.post("/games/okey/{game_id}/discard")
async def discard_okey_tile(game_id: str, tile_id: str):
    """Taş at"""
    if game_id not in active_okey_games:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    game = active_okey_games[game_id]
    
    if game.current_turn != "user":
        raise HTTPException(status_code=400, detail="Sizin sıranız değil")
    
    # Taşı at
    success = game.discard_tile("user", tile_id)
    
    if not success:
        raise HTTPException(status_code=400, detail="Taş atılamadı")
    
    # Sırayı ilerlet ve AI'ların oynamasını sağla
    ai_actions = []
    game.next_turn()
    
    # AI'lar sırayla oynasın
    while game.current_turn != "user":
        ai_action = game.ai_play_turn(game.current_turn)
        if ai_action:
            ai_actions.append({
                "player": game.current_turn,
                **ai_action
            })
        game.next_turn()
    
    # MongoDB'yi güncelle
    await db.games.update_one(
        {"_id": game_id},
        {"$set": game.to_dict()}
    )
    
    return {
        "success": True,
        "ai_actions": ai_actions,
        "game_state": game.get_game_state()
    }




@api_router.post("/games/okey/{game_id}/open")
async def open_okey_hand(game_id: str):
    """Oyuncu elini açar (101+ puan)"""
    if game_id not in active_okey_games:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    game = active_okey_games[game_id]
    
    if game.current_turn != "user":
        raise HTTPException(status_code=400, detail="Sizin sıranız değil")
    
    # Açma kontrolü
    result = game.open_hand("user")
    
    # MongoDB'yi güncelle
    await db.games.update_one(
        {"_id": game_id},
        {"$set": game.to_dict()}
    )
    
    return {
        **result,
        "game_state": game.get_game_state()
    }


@api_router.post("/games/okey/{game_id}/rack/add")
async def add_to_okey_rack(game_id: str, rack_index: int, tile_ids: List[str]):
    """Istakaya taş ekle"""
    if game_id not in active_okey_games:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    game = active_okey_games[game_id]
    player = game.players["user"]
    
    # Tile ID'lerden taşları bul
    tiles_to_add = []
    for tile_id in tile_ids:
        for tile in player["tiles"]:
            if tile.id == tile_id:
                tiles_to_add.append(tile)
                break
    
    # Istakaya ekle
    success = game.add_to_rack("user", rack_index, tiles_to_add)
    
    if not success:
        raise HTTPException(status_code=400, detail="Istakaya eklenemedi")
    
    # MongoDB'yi güncelle
    await db.games.update_one(
        {"_id": game_id},
        {"$set": game.to_dict()}
    )
    
    return {
        "success": True,
        "game_state": game.get_game_state()
    }

@api_router.post("/games/okey/{game_id}/finish")
async def finish_okey_game(game_id: str):
    """Oyunu bitir"""
    if game_id not in active_okey_games:
        raise HTTPException(status_code=404, detail="Oyun bulunamadı")
    
    game = active_okey_games[game_id]
    game.game_status = "finished"
    
    # MongoDB'yi güncelle
    await db.games.update_one(
        {"_id": game_id},
        {"$set": game.to_dict()}
    )
    
    # Memory'den sil
    del active_okey_games[game_id]
    
    return {
        "success": True,
        "message": "Oyun bitti!"
    }


# ============================================
# NEURAVERSE API ENDPOINTS
# ============================================

@api_router.post("/neuraverse/island/create")
async def create_island(req: CreateIslandRequest):
    """Yeni ada oluştur"""
    # Zaten ada var mı kontrol et
    existing = await db.islands.find_one({"owner_id": req.user_id})
    if existing:
        return {"island_id": existing["_id"], "message": "Ada zaten mevcut"}
    
    island_id = str(uuid.uuid4())
    island_data = {
        "_id": island_id,
        "owner_id": req.user_id,
        "size": [500, 500, 100],
        "blocks": {},  # Sparse storage
        "machines": [],
        "theme": req.theme.value,
        "created_at": datetime.utcnow(),
        "last_save": datetime.utcnow()
    }
    
    # Başlangıç platformu oluştur (10x10 grass)
    for x in range(245, 255):
        for z in range(245, 255):
            key = f"{x}_0_{z}"
            island_data["blocks"][key] = "grass"
    
    await db.islands.insert_one(island_data)
    
    # Envanter oluştur
    inventory_data = {
        "_id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "items": {"wood": 10, "stone": 10},
        "diamonds": 0
    }
    await db.inventories.insert_one(inventory_data)
    
    return {
        "island_id": island_id,
        "message": "Ada başarıyla oluşturuldu!",
        "spawn_position": [250, 1, 250]
    }


@api_router.get("/neuraverse/island/{user_id}")
async def get_island(user_id: str):
    """Oyuncunun adasını getir"""
    island = await db.islands.find_one({"owner_id": user_id})
    if not island:
        raise HTTPException(status_code=404, detail="Ada bulunamadı")
    
    inventory = await db.inventories.find_one({"user_id": user_id})
    
    return {
        "island": island,
        "inventory": inventory
    }


@api_router.post("/neuraverse/island/block")
async def place_or_remove_block(req: PlaceBlockRequest):
    """Blok ekle veya kaldır"""
    island = await db.islands.find_one({"owner_id": req.user_id})
    if not island:
        raise HTTPException(status_code=404, detail="Ada bulunamadı")
    
    x, y, z = req.position
    key = f"{x}_{y}_{z}"
    
    # Blok ekle
    if req.block_type != BlockType.AIR:
        island["blocks"][key] = req.block_type.value
    else:
        # Blok kaldır
        if key in island["blocks"]:
            del island["blocks"][key]
    
    # Kaydet
    await db.islands.update_one(
        {"owner_id": req.user_id},
        {"$set": {"blocks": island["blocks"], "last_save": datetime.utcnow()}}
    )
    
    return {"success": True, "position": req.position}


@api_router.post("/neuraverse/machine/place")
async def place_machine(req: PlaceMachineRequest):
    """Makine yerleştir"""
    island = await db.islands.find_one({"owner_id": req.user_id})
    if not island:
        raise HTTPException(status_code=404, detail="Ada bulunamadı")
    
    machine_id = str(uuid.uuid4())
    machine_data = {
        "id": machine_id,
        "type": req.machine_type.value,
        "position": req.position,
        "rotation": req.rotation,
        "status": "idle",
        "production_rate": 1.0,
        "animation_state": {},
        "last_production": datetime.utcnow(),
        "output_items": []
    }
    
    island["machines"].append(machine_data)
    
    await db.islands.update_one(
        {"owner_id": req.user_id},
        {"$set": {"machines": island["machines"], "last_save": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "machine_id": machine_id,
        "machine": machine_data
    }


@api_router.get("/neuraverse/machine/status/{user_id}")
async def get_machine_status(user_id: str):
    """Tüm makinelerin durumunu getir"""
    island = await db.islands.find_one({"owner_id": user_id})
    if not island:
        raise HTTPException(status_code=404, detail="Ada bulunamadı")
    
    return {"machines": island.get("machines", [])}


@api_router.post("/neuraverse/machine/collect/{machine_id}")
async def collect_machine_output(machine_id: str, user_id: str):
    """Makine çıktısını topla"""
    island = await db.islands.find_one({"owner_id": user_id})
    if not island:
        raise HTTPException(status_code=404, detail="Ada bulunamadı")
    
    # Makineyi bul
    machine = None
    for m in island["machines"]:
        if m["id"] == machine_id:
            machine = m
            break
    
    if not machine:
        raise HTTPException(status_code=404, detail="Makine bulunamadı")
    
    # Çıktıları topla
    output_items = machine.get("output_items", [])
    if not output_items:
        return {"success": False, "message": "Toplanacak item yok"}
    
    # Envantere ekle
    inventory = await db.inventories.find_one({"user_id": user_id})
    for item in output_items:
        if item in inventory["items"]:
            inventory["items"][item] += 1
        else:
            inventory["items"][item] = 1
    
    await db.inventories.update_one(
        {"user_id": user_id},
        {"$set": {"items": inventory["items"]}}
    )
    
    # Makine çıktısını temizle
    machine["output_items"] = []
    await db.islands.update_one(
        {"owner_id": user_id},
        {"$set": {"machines": island["machines"]}}
    )
    
    return {
        "success": True,
        "collected": output_items
    }


@api_router.post("/neuraverse/trade/create")
async def create_trade(req: CreateTradeRequest):
    """Ticaret otomatı oluştur"""
    # Slot boş mu kontrol et
    existing = await db.trade_automatons.find_one({
        "rented_slot": req.slot_number,
        "active": True
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Bu slot dolu")
    
    # Envanterde item var mı kontrol et
    inventory = await db.inventories.find_one({"user_id": req.user_id})
    if not inventory or inventory["items"].get(req.item_type, 0) < req.quantity:
        raise HTTPException(status_code=400, detail="Yeterli item yok")
    
    # Otomatı oluştur
    trade_id = str(uuid.uuid4())
    trade_data = {
        "_id": trade_id,
        "owner_id": req.user_id,
        "position": [req.slot_number * 5, 0, 0],  # Slot bazlı pozisyon
        "item_type": req.item_type,
        "quantity": req.quantity,
        "price_item": req.price_item,
        "price_quantity": req.price_quantity,
        "rented_slot": req.slot_number,
        "active": True,
        "created_at": datetime.utcnow()
    }
    
    await db.trade_automatons.insert_one(trade_data)
    
    # Envanterden item düş
    inventory["items"][req.item_type] -= req.quantity
    await db.inventories.update_one(
        {"user_id": req.user_id},
        {"$set": {"items": inventory["items"]}}
    )
    
    return {
        "success": True,
        "trade_id": trade_id,
        "automaton": trade_data
    }


@api_router.get("/neuraverse/trade/list")
async def list_trades():
    """Tüm aktif ticaret otomatlarını listele"""
    trades = await db.trade_automatons.find({"active": True}).to_list(100)
    return {"trades": trades}


@api_router.post("/neuraverse/trade/execute")
async def execute_trade(req: ExecuteTradeRequest):
    """Takası gerçekleştir"""
    trade = await db.trade_automatons.find_one({"_id": req.trade_id})
    if not trade or not trade["active"]:
        raise HTTPException(status_code=404, detail="Ticaret bulunamadı")
    
    # Alıcının envanteri
    buyer_inv = await db.inventories.find_one({"user_id": req.buyer_id})
    if not buyer_inv:
        raise HTTPException(status_code=404, detail="Envanter bulunamadı")
    
    # Yeterli para var mı kontrol et
    price_item = trade["price_item"]
    price_qty = trade["price_quantity"]
    
    if price_item == "diamond":
        if buyer_inv.get("diamonds", 0) < price_qty:
            raise HTTPException(status_code=400, detail="Yeterli elmas yok")
    else:
        if buyer_inv["items"].get(price_item, 0) < price_qty:
            raise HTTPException(status_code=400, detail="Yeterli item yok")
    
    # Takası gerçekleştir
    # Alıcıdan parayı al
    if price_item == "diamond":
        buyer_inv["diamonds"] -= price_qty
    else:
        buyer_inv["items"][price_item] -= price_qty
    
    # Alıcıya item ver
    if trade["item_type"] in buyer_inv["items"]:
        buyer_inv["items"][trade["item_type"]] += trade["quantity"]
    else:
        buyer_inv["items"][trade["item_type"]] = trade["quantity"]
    
    await db.inventories.update_one(
        {"user_id": req.buyer_id},
        {"$set": {"items": buyer_inv["items"], "diamonds": buyer_inv.get("diamonds", 0)}}
    )
    
    # Satıcıya parayı ver
    seller_inv = await db.inventories.find_one({"user_id": trade["owner_id"]})
    if price_item == "diamond":
        seller_inv["diamonds"] = seller_inv.get("diamonds", 0) + price_qty
    else:
        if price_item in seller_inv["items"]:
            seller_inv["items"][price_item] += price_qty
        else:
            seller_inv["items"][price_item] = price_qty
    
    await db.inventories.update_one(
        {"user_id": trade["owner_id"]},
        {"$set": {"items": seller_inv["items"], "diamonds": seller_inv.get("diamonds", 0)}}
    )
    
    # Otomatı deaktive et
    await db.trade_automatons.update_one(
        {"_id": req.trade_id},
        {"$set": {"active": False}}
    )
    
    return {
        "success": True,
        "message": "Takas başarılı!"
    }


@api_router.post("/neuraverse/island/save")
async def save_island(user_id: str):
    """Adayı manuel kaydet"""
    island = await db.islands.find_one({"owner_id": user_id})
    if not island:
        raise HTTPException(status_code=404, detail="Ada bulunamadı")
    
    await db.islands.update_one(
        {"owner_id": user_id},
        {"$set": {"last_save": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "message": "Ada kaydedildi",
        "timestamp": datetime.utcnow()
    }


# Include the router in the main app


# ============================================
# MULTI-AI CONSENSUS ENDPOINTS
# ============================================

@api_router.post("/ai/consensus")
async def ai_consensus_endpoint(request: dict):
    """
    3 AI konsensus sistemi
    - Gemini, ChatGPT, Claude'a aynı soruyu sor
    - Farklı cevaplar gelirse tekrar kontrol et
    - Konsensusa ulaşana kadar devam et
    """
    question = request.get("question", "")
    max_iterations = request.get("max_iterations", 3)
    
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")
    
    result = await llm_router.multi_ai_consensus(question, max_iterations)
    
    return {
        "success": True,
        "result": result,
        "timestamp": datetime.utcnow()
    }


@api_router.post("/ai/generate-question")
async def generate_validated_question(request: dict):
    """
    AI ile soru oluştur ve diğer AI'larla doğrula
    
    Body:
    {
        "question_type": "grammar" | "math" | "pattern" | "word_game",
        "difficulty": "easy" | "medium" | "hard" | "very_hard"
    }
    """
    question_type = request.get("question_type", "math")
    difficulty = request.get("difficulty", "medium")
    
    result = await llm_router.generate_and_validate_question(
        question_type,
        difficulty
    )
    
    return {
        "success": True,
        "result": result,
        "timestamp": datetime.utcnow()
    }


@api_router.post("/turkish/generate-question")
async def generate_turkish_question(request: dict):
    """
    Türkçe dilbilgisi sorusu oluştur (Gemini)
    ChatGPT ve Claude ile doğrula
    
    Konu: Büyük harflerin kullanımı
    """
    difficulty = request.get("difficulty", "medium")
    
    result = await llm_router.generate_and_validate_question(
        "grammar",
        difficulty
    )
    
    # Eğer validate edilmediyse, tekrar dene (max 3 kez)
    retries = 0
    while not result.get("validated") and retries < 3:
        retries += 1
        print(f"⚠️ Soru validasyondan geçemedi, yeniden oluşturuluyor... ({retries}/3)")
        result = await llm_router.generate_and_validate_question("grammar", difficulty)
    
    return {
        "success": result.get("validated", False),
        "question": result.get("question"),
        "confidence": result.get("confidence"),
        "retries": retries,
        "timestamp": datetime.utcnow()
    }


@api_router.post("/word-game/generate")
async def generate_word_game(request: dict):
    """
    Adam asmaca veya kelime oyunu için kelime/ipucu oluştur
    3 AI ile doğrula
    """
    difficulty = request.get("difficulty", "medium")
    game_type = request.get("game_type", "hangman")  # hangman, word_derivation, isim_sehir
    
    result = await llm_router.generate_and_validate_question(
        "word_game",
        difficulty
    )
    
    # Tekrar dene
    retries = 0
    while not result.get("validated") and retries < 3:
        retries += 1
        result = await llm_router.generate_and_validate_question("word_game", difficulty)
    
    return {
        "success": result.get("validated", False),
        "data": result.get("question"),
        "confidence": result.get("confidence"),
        "retries": retries,
        "timestamp": datetime.utcnow()
    }


@api_router.post("/pattern/generate")
async def generate_pattern_question(request: dict):
    """
    Örüntü bulma sorusu oluştur (3 AI)
    """
    difficulty = request.get("difficulty", "medium")
    
    result = await llm_router.generate_and_validate_question(
        "pattern",
        difficulty
    )
    
    retries = 0
    while not result.get("validated") and retries < 3:
        retries += 1
        result = await llm_router.generate_and_validate_question("pattern", difficulty)
    
    return {
        "success": result.get("validated", False),
        "pattern": result.get("question"),
        "confidence": result.get("confidence"),
        "retries": retries,
        "timestamp": datetime.utcnow()
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
