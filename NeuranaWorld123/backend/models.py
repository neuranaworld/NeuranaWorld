from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ThemeMode(str, Enum):
    LIGHT = "light"
    DARK = "dark"
    AUTO = "auto"

class LLMMode(str, Enum):
    AUTO = "auto"
    GPT4O = "gpt-4o"
    CLAUDE = "claude-sonnet-4"
    GEMINI = "gemini-2.0-flash"

class AccuracyPriority(str, Enum):
    MAX_ACCURACY = "max_accuracy"
    LOW_LATENCY = "low_latency"

class UserSettings(BaseModel):
    theme: ThemeMode = ThemeMode.LIGHT
    language: str = "tr"
    llm_mode: LLMMode = LLMMode.AUTO
    accuracy_priority: AccuracyPriority = AccuracyPriority.MAX_ACCURACY
    deep_think_timeout: Optional[int] = None  # None = unlimited

class UserStats(BaseModel):
    total_points: int = 0
    correct_answers: int = 0
    games_played: int = 0
    study_time_minutes: int = 0

class User(BaseModel):
    name: str
    email: Optional[str] = None
    password_hash: Optional[str] = None
    is_anonymous: bool = True
    profile_pic: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    settings: UserSettings = Field(default_factory=UserSettings)
    stats: UserStats = Field(default_factory=UserStats)

class QuestionDifficulty(int, Enum):
    VERY_EASY = 1
    EASY = 2
    MEDIUM = 3
    HARD = 4
    VERY_HARD = 5

class SubjectType(str, Enum):
    MATH = "math"
    TURKISH = "turkish"
    TRANSLATE = "translate"

class Question(BaseModel):
    subject: SubjectType
    category: str
    difficulty: QuestionDifficulty
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: str
    created_by: str  # "ai" or "preset"
    llm_model: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SessionMode(str, Enum):
    DEEP = "deep"
    FAST = "fast"

class Session(BaseModel):
    user_id: str
    subject: SubjectType
    mode: SessionMode
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    questions_answered: int = 0
    correct_count: int = 0

class UserProgress(BaseModel):
    user_id: str
    subject: SubjectType
    category: str
    strength_score: float = 50.0  # 0-100
    weak_areas: List[str] = []
    last_practiced: datetime = Field(default_factory=datetime.utcnow)
    total_attempts: int = 0

class LLMCacheEntry(BaseModel):
    question_hash: str
    model: str
    response: Dict[str, Any]
    confidence: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    verified: bool = False

class GameScore(BaseModel):
    user_id: str
    game_type: str
    score: int
    duration: int  # seconds
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Request/Response Models
class CreateUserRequest(BaseModel):
    name: str
    email: Optional[str] = None
    password: Optional[str] = None
    is_anonymous: bool = True

class LoginRequest(BaseModel):
    email: str
    password: str

class GenerateQuestionRequest(BaseModel):
    subject: SubjectType
    category: str
    difficulty: QuestionDifficulty
    use_ai: bool = False

class VerifyAnswerRequest(BaseModel):
    question_id: str
    user_answer: str
    session_id: str

class DeepThinkRequest(BaseModel):
    question: str
    subject: SubjectType
    mode: SessionMode = SessionMode.DEEP

class TranslateRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

# Multi-AI Comparison Models
class AIProvider(str, Enum):
    CHATGPT = "chatgpt"
    GEMINI = "gemini"
    CLAUDE = "claude"
    DEEPSEEK = "deepseek"
    GROK = "grok"
    MANUS = "manus"
    KUMRU = "kumru"

class MultiAIRequest(BaseModel):
    question: str
    selected_ais: List[AIProvider]
    detailed_mode: bool = False  # False = 60s, True = 600s
    timeout: Optional[int] = None  # Custom timeout override

class AIResponse(BaseModel):
    ai_name: str
    answer: Optional[str] = None
    status: str  # "success", "timeout", "error"
    response_time: float  # seconds
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MultiAIComparisonResponse(BaseModel):
    mode: str  # "single", "consensus", "comparison", "error"
    responses: List[AIResponse]
    consensus_rate: Optional[float] = None
    majority_answer: Optional[str] = None
    recommendation: str
    total_time: float


# ============================================
# NEURAVERSE MODELS
# ============================================

class BlockType(str, Enum):
    AIR = "air"
    # Temel Bloklar
    GRASS = "grass"
    DIRT = "dirt"
    STONE = "stone"
    SAND = "sand"
    GRAVEL = "gravel"
    COBBLESTONE = "cobblestone"
    CLAY = "clay"
    WOOD = "wood"
    LEAVES = "leaves"
    # İnşaat Blokları
    BRICK = "brick"
    GRANITE = "granite"
    ANDESITE = "andesite"
    GLASS = "glass"
    AMETHYST = "amethyst"
    # Özel
    CHEST = "chest"
    # Sıvılar
    WATER = "water"
    LAVA = "lava"
    # Madenler
    COAL_ORE = "coal_ore"
    IRON_ORE = "iron_ore"
    COPPER_ORE = "copper_ore"
    GOLD_ORE = "gold_ore"
    DIAMOND_ORE = "diamond_ore"
    LAPIS_ORE = "lapis_ore"
    EMERALD_ORE = "emerald_ore"
    RUBY_ORE = "ruby_ore"
    PLATINUM_ORE = "platinum_ore"
    QUARTZ_ORE = "quartz_ore"

class BlockRarity(str, Enum):
    COMMON = "common"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"
    ULTRA_LEGENDARY = "ultra_legendary"

class MachineType(str, Enum):
    DRILL = "drill"
    BLAST_FURNACE = "blast_furnace"
    CONVEYOR = "conveyor"
    INDUSTRIAL_SAWMILL = "industrial_sawmill"
    LOG_DEBARKER = "log_debarker"
    WIND_TURBINE = "wind_turbine"
    COKE_OVEN = "coke_oven"

class MachineStatus(str, Enum):
    IDLE = "idle"
    WORKING = "working"
    PAUSED = "paused"
    BROKEN = "broken"

class ThemeType(str, Enum):
    MODERN = "modern"
    FUTURISTIC = "futuristic"

class Block(BaseModel):
    type: BlockType
    position: List[int]  # [x, y, z]
    rarity: BlockRarity = BlockRarity.COMMON

class Machine(BaseModel):
    id: str
    type: MachineType
    position: List[int]  # [x, y, z]
    rotation: float = 0.0
    status: MachineStatus = MachineStatus.IDLE
    production_rate: float = 1.0
    animation_state: Dict[str, Any] = {}
    last_production: Optional[datetime] = None
    output_items: List[str] = []

class TradeAutomaton(BaseModel):
    id: str
    owner_id: str
    position: List[int]  # [x, y, z] in center island
    item_type: str
    quantity: int  # max 64
    price_item: str  # what item they want in exchange
    price_quantity: int
    rented_slot: int  # slot number in trade center
    active: bool = True
    
class Island(BaseModel):
    owner_id: str
    size: List[int] = [500, 500, 100]  # x, y, z
    blocks: Dict[str, BlockType] = {}  # sparse storage: "x_y_z" -> BlockType
    machines: List[Machine] = []
    theme: ThemeType = ThemeType.MODERN
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_save: datetime = Field(default_factory=datetime.utcnow)
    
class PlayerInventory(BaseModel):
    user_id: str
    items: Dict[str, int] = {}  # item_type -> quantity
    diamonds: int = 0
    
class EventType(str, Enum):
    PARKOUR = "parkour"
    ENEMY_WAVE = "enemy_wave"
    SURVIVAL = "survival"
    RACE = "race"
    
class EventInstance(BaseModel):
    id: str
    type: EventType
    name: str
    participants: List[str] = []
    start_time: datetime = Field(default_factory=datetime.utcnow)
    duration: int = 300  # seconds
    
# Request Models
class CreateIslandRequest(BaseModel):
    user_id: str
    theme: ThemeType = ThemeType.MODERN

class PlaceBlockRequest(BaseModel):
    user_id: str
    block_type: BlockType
    position: List[int]

class PlaceMachineRequest(BaseModel):
    user_id: str
    machine_type: MachineType
    position: List[int]
    rotation: float = 0.0

class CreateTradeRequest(BaseModel):
    user_id: str
    item_type: str
    quantity: int
    price_item: str
    price_quantity: int
    slot_number: int

class ExecuteTradeRequest(BaseModel):
    buyer_id: str
    trade_id: str
