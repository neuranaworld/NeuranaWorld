#!/bin/bash

# Farm Dominion v2 - File Checker
# Linux/Mac Version

echo "========================================"
echo "🔍 FARM DOMINION v2 - DOSYA KONTROLÜ"
echo "========================================"
echo ""

MISSING=0
TOTAL=0
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    ((TOTAL++))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
    else
        echo -e "${RED}❌${NC} $1 - EKSİK!"
        ((MISSING++))
    fi
}

check_dir() {
    if [ ! -d "$1" ]; then
        echo -e "${RED}⚠️  Klasör bulunamadı: $1${NC}"
        mkdir -p "$1"
        echo -e "${YELLOW}📁 Klasör oluşturuldu: $1${NC}"
    fi
}

echo "📁 ANA DOSYALAR"
echo "----------------"
check_file "index.html"
check_file "README.md"
check_file "QUICKSTART.txt"
check_file "DEVELOPMENT_SUMMARY.md"

echo ""
echo "📁 JS KLASÖRÜ"
echo "-------------"
check_dir "js"
check_file "js/main.js"
check_file "js/world.js"
check_file "js/terrain.js"
check_file "js/buildings.js"
check_file "js/audio.js"
check_file "js/settings.js"
check_file "js/utils.js"
check_file "js/three_module.js"
check_file "js/PointerLockControls.js"

echo ""
echo "📁 ASSETS/TEXTURES KLASÖRÜ"
echo "---------------------------"
check_dir "assets/textures"
check_file "assets/textures/grass.jpg"
check_file "assets/textures/rock.jpg"
check_file "assets/textures/water.jpg"
check_file "assets/textures/dirt.jpg"
check_file "assets/textures/wood.jpg"

echo ""
echo "📁 ASSETS/AUDIO KLASÖRÜ"
echo "------------------------"
check_dir "assets/audio"
check_file "assets/audio/ambient.mp3"
check_file "assets/audio/birds.mp3"
check_file "assets/audio/wind.mp3"

echo ""
echo "📁 ASSETS/CONFIG DOSYALARI"
echo "---------------------------"
check_dir "assets"
check_file "assets/buildings.txt"
check_file "assets/npcs.txt"
check_file "assets/terrain.txt"
check_file "assets/weather.txt"

echo ""
echo "========================================"
echo "📊 SONUÇ"
echo "========================================"
echo "Toplam Dosya: $TOTAL"
echo "Eksik Dosya: $MISSING"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ TÜM DOSYALAR MEVCUT!${NC}"
    echo "🎮 Oyunu başlatabilirsiniz!"
    echo ""
    echo "🚀 Çalıştırmak için:"
    echo "   python3 -m http.server 8000"
    echo "   VEYA"
    echo "   npx http-server -p 8000"
    echo ""
    echo "Sonra tarayıcıda: http://localhost:8000"
else
    echo -e "${RED}❌ $MISSING DOSYA EKSİK!${NC}"
    echo -e "${YELLOW}⚠️  Lütfen eksik dosyaları tamamlayın.${NC}"
fi

echo ""
