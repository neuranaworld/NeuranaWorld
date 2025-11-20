import React, { useEffect } from 'react';

export default function BirimDonusturme() {
  useEffect(() => {
    // Script runs when component mounts
    const script = document.createElement('script');
    script.innerHTML = `
      // Initialize after component mounts
      if (typeof window.birimDonusturmeInit === 'undefined') {
        window.birimDonusturmeInit = true;
        // Scripts will be embedded below
      }
    `;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div dangerouslySetInnerHTML={{__html: `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔄 Birim Dönüştürücü - Modüler</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-gradient-1: #667eea;
            --bg-gradient-2: #764ba2;
            --card-bg: white;
            --text-primary: #333;
            --text-secondary: #666;
            --border-color: #e2e8f0;
            --shadow: rgba(0, 0, 0, 0.3);
            --input-bg: #f8fafc;
        }

        body.dark-theme {
            --bg-gradient-1: #1a1a2e;
            --bg-gradient-2: #16213e;
            --card-bg: #0f3460;
            --text-primary: #eee;
            --text-secondary: #bbb;
            --border-color: #1e3a5f;
            --shadow: rgba(0, 0, 0, 0.8);
            --input-bg: #1e3a5f;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            transition: all 0.3s ease;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
            50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8); }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideInRight {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }

        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s;
        }

        .modal.show {
            display: flex;
        }

        .modal-content {
            background: var(--card-bg);
            padding: 30px;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            animation: slideInRight 0.3s;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 1.8em;
            color: var(--text-primary);
            font-weight: bold;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: var(--text-secondary);
            transition: all 0.3s;
        }

        .close-btn:hover {
            color: #ef4444;
            transform: rotate(90deg);
        }

        .converter-container {
            background: var(--card-bg);
            border-radius: 30px;
            padding: 40px;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 20px 60px var(--shadow);
            animation: fadeIn 0.5s;
            transition: all 0.3s;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.5em;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }

        .header p {
            color: var(--text-secondary);
            font-size: 1.1em;
        }

        .controls {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 25px;
        }

        .control-btn {
            flex: 1;
            padding: 12px;
            border: 2px solid var(--border-color);
            background: var(--input-bg);
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            color: var(--text-primary);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .control-btn:hover {
            background: #667eea;
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .category-tabs {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            margin-bottom: 25px;
        }

        .category-tab {
            padding: 12px;
            border: 2px solid var(--border-color);
            background: var(--input-bg);
            border-radius: 12px;
            cursor: pointer;
            text-align: center;
            font-weight: 600;
            color: var(--text-secondary);
            transition: all 0.3s;
        }

        .category-tab:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .category-tab.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-color: #667eea;
            animation: pulse 0.5s;
        }

        .input-section {
            background: var(--input-bg);
            padding: 25px;
            border-radius: 20px;
            margin-bottom: 20px;
            border: 2px solid var(--border-color);
        }

        .input-group {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            align-items: stretch;
        }

        .input-field {
            flex: 2;
            padding: 15px;
            border: 2px solid var(--border-color);
            border-radius: 12px;
            font-size: 1.2em;
            background: var(--card-bg);
            color: var(--text-primary);
            transition: all 0.3s;
        }

        .input-field:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            animation: glow 2s infinite;
        }

        .input-field.error {
            border-color: #ef4444;
            animation: shake 0.5s;
        }

        .unit-select {
            flex: 1;
            padding: 15px;
            border: 2px solid var(--border-color);
            border-radius: 12px;
            font-size: 1em;
            background: var(--card-bg);
            color: var(--text-primary);
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .unit-select:hover {
            border-color: #667eea;
        }

        .swap-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .swap-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .swap-btn:active {
            transform: rotate(180deg) scale(1.05);
        }

        .result-section {
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 25px;
            border-radius: 20px;
            color: white;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .result-label {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 10px;
        }

        .result-value {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
            word-break: break-all;
        }

        .result-formula {
            font-size: 0.85em;
            opacity: 0.8;
            font-family: 'Courier New', monospace;
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
        }

        .quick-convert {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 20px;
        }

        .quick-btn {
            padding: 12px;
            background: var(--input-bg);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            color: var(--text-primary);
            transition: all 0.3s;
        }

        .quick-btn:hover {
            background: #667eea;
            color: white;
            transform: translateY(-3px);
        }

        .history-item {
            background: var(--input-bg);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 10px;
            border: 2px solid var(--border-color);
            transition: all 0.3s;
        }

        .history-item:hover {
            transform: translateX(5px);
            border-color: #667eea;
        }

        .history-time {
            font-size: 0.85em;
            color: var(--text-secondary);
            margin-bottom: 5px;
        }

        .history-conversion {
            font-weight: 600;
            color: var(--text-primary);
        }

        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: none;
            align-items: center;
            gap: 10px;
            z-index: 10001;
            animation: slideInRight 0.3s;
        }

        .toast.show {
            display: flex;
        }

        .toast.hide {
            animation: slideOutRight 0.3s;
        }

        .toast-success {
            border-left: 4px solid #10b981;
        }

        .toast-error {
            border-left: 4px solid #ef4444;
        }

        @media (max-width: 600px) {
            .converter-container {
                padding: 20px;
            }

            .category-tabs {
                grid-template-columns: repeat(3, 1fr);
            }

            .input-group {
                flex-direction: column;
            }

            .quick-convert {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>

    <div class="converter-container">
        <div class="header">
            <h1>🔄 Birim Dönüştürücü</h1>
            <p>Hızlı ve kolay dönüşüm</p>
        </div>

        <div class="controls">
            <button class="control-btn" onclick="toggleTheme()">
                <span id="themeIcon">🌙</span>
                <span>Tema</span>
            </button>
            <button class="control-btn" onclick="showHistory()">
                <span>📜</span>
                <span>Geçmiş</span>
            </button>
            <button class="control-btn" onclick="toggleSound()">
                <span id="soundIcon">🔊</span>
                <span>Ses</span>
            </button>
        </div>

        <div class="category-tabs" id="categoryTabs"></div>

        <div class="input-section">
            <div class="input-group">
                <input type="number" class="input-field" id="fromValue" placeholder="Değer girin" oninput="convert()">
                <select class="unit-select" id="fromUnit" onchange="convert()"></select>
            </div>

            <button class="swap-btn" onclick="swapUnits()">
                <span>⇅</span>
                <span>Değiştir</span>
            </button>

            <div class="input-group" style="margin-top: 15px;">
                <input type="number" class="input-field" id="toValue" placeholder="Sonuç" readonly>
                <select class="unit-select" id="toUnit" onchange="convert()"></select>
            </div>
        </div>

        <div class="result-section" id="resultSection" style="display: none;">
            <div class="result-label">Sonuç</div>
            <div class="result-value" id="resultValue">0</div>
            <div class="result-formula" id="resultFormula"></div>
        </div>

        <div class="quick-convert" id="quickConvert"></div>
    </div>

    <div class="modal" id="historyModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📜 Dönüşüm Geçmişi</h2>
                <button class="close-btn" onclick="closeHistory()">✕</button>
            </div>
            <div id="historyList"></div>
            <button class="swap-btn" onclick="clearHistory()" style="margin-top: 20px;">
                <span>🗑️</span>
                <span>Geçmişi Temizle</span>
            </button>
        </div>
    </div>

    <div class="toast" id="toast">
        <span id="toastIcon">✓</span>
        <span id="toastMessage"></span>
    </div>

    <script>
        let currentCategory = 'length';
        let history = [];
        let favorites = [];
        let darkTheme = false;
        let soundEnabled = true;

        function loadSettings() {
            try {
                const savedSettings = localStorage.getItem('converterSettings');
                if (savedSettings) {
                    const settings = JSON.parse(savedSettings);
                    darkTheme = settings.darkTheme || false;
                    soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
                    currentCategory = settings.lastCategory || 'length';
                    history = settings.history || [];

                    if (darkTheme) {
                        document.body.classList.add('dark-theme');
                        document.getElementById('themeIcon').textContent = '☀️';
                    }

                    if (!soundEnabled) {
                        document.getElementById('soundIcon').textContent = '🔇';
                    }
                }
            } catch (e) {
                console.error('Ayarlar yüklenemedi:', e);
            }
        }

        function saveSettings() {
            try {
                const settings = {
                    darkTheme,
                    soundEnabled,
                    lastCategory: currentCategory,
                    history: history.slice(-20)
                };
                localStorage.setItem('converterSettings', JSON.stringify(settings));
            } catch (e) {
                console.error('Ayarlar kaydedilemedi:', e);
            }
        }

        const units = {
            length: {
                name: 'Uzunluk',
                units: {
                    'mm': { name: 'Milimetre', factor: 0.001 },
                    'cm': { name: 'Santimetre', factor: 0.01 },
                    'm': { name: 'Metre', factor: 1 },
                    'km': { name: 'Kilometre', factor: 1000 },
                    'inch': { name: 'İnç', factor: 0.0254 },
                    'ft': { name: 'Feet', factor: 0.3048 },
                    'yard': { name: 'Yarda', factor: 0.9144 },
                    'mile': { name: 'Mil', factor: 1609.34 }
                },
                quick: [1, 10, 100, 1000]
            },
            weight: {
                name: 'Ağırlık',
                units: {
                    'mg': { name: 'Miligram', factor: 0.000001 },
                    'g': { name: 'Gram', factor: 0.001 },
                    'kg': { name: 'Kilogram', factor: 1 },
                    'ton': { name: 'Ton', factor: 1000 },
                    'oz': { name: 'Ons', factor: 0.0283495 },
                    'lb': { name: 'Pound', factor: 0.453592 }
                },
                quick: [1, 10, 100, 1000]
            },
            temperature: {
                name: 'Sıcaklık',
                units: {
                    'C': { name: 'Celsius' },
                    'F': { name: 'Fahrenheit' },
                    'K': { name: 'Kelvin' }
                },
                quick: [0, 20, 37, 100]
            },
            area: {
                name: 'Alan',
                units: {
                    'mm2': { name: 'Milimetre Kare', factor: 0.000001 },
                    'cm2': { name: 'Santimetre Kare', factor: 0.0001 },
                    'm2': { name: 'Metre Kare', factor: 1 },
                    'km2': { name: 'Kilometre Kare', factor: 1000000 },
                    'ha': { name: 'Hektar', factor: 10000 },
                    'acre': { name: 'Akre', factor: 4046.86 }
                },
                quick: [1, 10, 100, 1000]
            },
            volume: {
                name: 'Hacim',
                units: {
                    'ml': { name: 'Mililitre', factor: 0.001 },
                    'l': { name: 'Litre', factor: 1 },
                    'm3': { name: 'Metreküp', factor: 1000 },
                    'gal': { name: 'Galon', factor: 3.78541 },
                    'oz': { name: 'Sıvı Ons', factor: 0.0295735 }
                },
                quick: [1, 10, 100, 1000]
            },
            speed: {
                name: 'Hız',
                units: {
                    'm/s': { name: 'Metre/Saniye', factor: 1 },
                    'km/h': { name: 'Kilometre/Saat', factor: 0.277778 },
                    'mph': { name: 'Mil/Saat', factor: 0.44704 },
                    'knot': { name: 'Knot', factor: 0.514444 }
                },
                quick: [10, 50, 100, 200]
            },
            time: {
                name: 'Zaman',
                units: {
                    'ms': { name: 'Milisaniye', factor: 0.001 },
                    's': { name: 'Saniye', factor: 1 },
                    'min': { name: 'Dakika', factor: 60 },
                    'h': { name: 'Saat', factor: 3600 },
                    'day': { name: 'Gün', factor: 86400 },
                    'week': { name: 'Hafta', factor: 604800 },
                    'month': { name: 'Ay', factor: 2592000 },
                    'year': { name: 'Yıl', factor: 31536000 }
                },
                quick: [1, 60, 3600, 86400]
            },
            energy: {
                name: 'Enerji',
                units: {
                    'J': { name: 'Joule', factor: 1 },
                    'kJ': { name: 'Kilojoule', factor: 1000 },
                    'cal': { name: 'Kalori', factor: 4.184 },
                    'kcal': { name: 'Kilokalori', factor: 4184 },
                    'Wh': { name: 'Watt-saat', factor: 3600 },
                    'kWh': { name: 'Kilowatt-saat', factor: 3600000 },
                    'eV': { name: 'Elektronvolt', factor: 1.60218e-19 }
                },
                quick: [1, 100, 1000, 10000]
            },
            power: {
                name: 'Güç',
                units: {
                    'W': { name: 'Watt', factor: 1 },
                    'kW': { name: 'Kilowatt', factor: 1000 },
                    'MW': { name: 'Megawatt', factor: 1000000 },
                    'hp': { name: 'Beygir Gücü', factor: 745.7 },
                    'BTU/h': { name: 'BTU/Saat', factor: 0.293071 }
                },
                quick: [1, 100, 1000, 10000]
            },
            pressure: {
                name: 'Basınç',
                units: {
                    'Pa': { name: 'Pascal', factor: 1 },
                    'kPa': { name: 'Kilopascal', factor: 1000 },
                    'bar': { name: 'Bar', factor: 100000 },
                    'atm': { name: 'Atmosfer', factor: 101325 },
                    'psi': { name: 'PSI', factor: 6894.76 },
                    'mmHg': { name: 'Milimetre Civa', factor: 133.322 }
                },
                quick: [1, 100, 1000, 10000]
            },
            data: {
                name: 'Veri',
                units: {
                    'B': { name: 'Byte', factor: 1 },
                    'KB': { name: 'Kilobyte', factor: 1024 },
                    'MB': { name: 'Megabyte', factor: 1048576 },
                    'GB': { name: 'Gigabyte', factor: 1073741824 },
                    'TB': { name: 'Terabyte', factor: 1099511627776 },
                    'bit': { name: 'Bit', factor: 0.125 },
                    'Kbit': { name: 'Kilobit', factor: 128 },
                    'Mbit': { name: 'Megabit', factor: 131072 }
                },
                quick: [1, 1024, 1048576, 1073741824]
            },
            fuel: {
                name: 'Yakıt Tüketimi',
                units: {
                    'l/100km': { name: 'Litre/100km', factor: 1 },
                    'km/l': { name: 'Kilometre/Litre', factor: -1 },
                    'mpg': { name: 'Mil/Galon (US)', factor: 235.215 },
                    'mpg-uk': { name: 'Mil/Galon (UK)', factor: 282.481 }
                },
                quick: [5, 7, 10, 15]
            }
        };

        function setCategory(category) {
            currentCategory = category;
            populateUnits();
            setupQuickConvert();
            saveSettings();
        }

        function populateUnits() {
            const categoryUnits = units[currentCategory].units;
            const fromSelect = document.getElementById('fromUnit');
            const toSelect = document.getElementById('toUnit');

            fromSelect.innerHTML = '';
            toSelect.innerHTML = '';

            for (let [key, value] of Object.entries(categoryUnits)) {
                const option1 = document.createElement('option');
                option1.value = key;
                option1.textContent = value.name;
                fromSelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = key;
                option2.textContent = value.name;
                toSelect.appendChild(option2);
            }

            if (toSelect.options.length > 1) {
                toSelect.selectedIndex = 1;
            }

            convert();
        }

        function convert() {
            const fromValue = parseFloat(document.getElementById('fromValue').value);
            const fromUnit = document.getElementById('fromUnit').value;
            const toUnit = document.getElementById('toUnit').value;

            if (isNaN(fromValue) || fromValue === '') {
                document.getElementById('toValue').value = '';
                document.getElementById('resultSection').style.display = 'none';
                return;
            }

            if (!isFinite(fromValue) || Math.abs(fromValue) > 1e15) {
                showToast('Geçersiz değer!', 'error');
                document.getElementById('fromValue').classList.add('error');
                setTimeout(() => {
                    document.getElementById('fromValue').classList.remove('error');
                }, 500);
                return;
            }

            let result;
            let formula = '';

            if (currentCategory === 'temperature') {
                result = convertTemperature(fromValue, fromUnit, toUnit);
                formula = getTemperatureFormula(fromUnit, toUnit);
            } else {
                const fromFactor = units[currentCategory].units[fromUnit].factor;
                const toFactor = units[currentCategory].units[toUnit].factor;

                result = (fromValue * fromFactor) / toFactor;
                formula = \`\${fromValue} × \${fromFactor} ÷ \${toFactor} = \${result.toFixed(6)}\`;
            }

            const precision = Math.abs(result) < 0.01 ? 10 : Math.abs(result) < 1 ? 6 : 4;
            result = parseFloat(result.toFixed(precision));

            document.getElementById('toValue').value = result;
            document.getElementById('resultSection').style.display = 'block';
            document.getElementById('resultValue').textContent = result;
            document.getElementById('resultFormula').textContent = formula;

            playSound('convert');
            addToHistory(fromValue, fromUnit, result, toUnit);
        }

        function convertTemperature(value, from, to) {
            if (from === to) return value;

            let celsius;

            if (from === 'C') celsius = value;
            else if (from === 'F') celsius = (value - 32) * 5/9;
            else if (from === 'K') celsius = value - 273.15;

            if (to === 'C') return celsius;
            else if (to === 'F') return celsius * 9/5 + 32;
            else if (to === 'K') return celsius + 273.15;
        }

        function getTemperatureFormula(from, to) {
            const formulas = {
                'C-F': '(°C × 9/5) + 32',
                'F-C': '(°F - 32) × 5/9',
                'C-K': '°C + 273.15',
                'K-C': 'K - 273.15',
                'F-K': '(°F - 32) × 5/9 + 273.15',
                'K-F': '(K - 273.15) × 9/5 + 32'
            };
            return formulas[\`\${from}-\${to}\`] || from + ' → ' + to;
        }

        function swapUnits() {
            const fromUnit = document.getElementById('fromUnit');
            const toUnit = document.getElementById('toUnit');
            const fromValue = document.getElementById('fromValue');
            const toValue = document.getElementById('toValue');

            const tempUnit = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = tempUnit;

            const tempValue = fromValue.value;
            fromValue.value = toValue.value;
            toValue.value = tempValue;

            convert();
            playSound('swap');
        }

        function setupQuickConvert() {
            const quickValues = units[currentCategory].quick;
            const quickConvert = document.getElementById('quickConvert');
            quickConvert.innerHTML = '';

            quickValues.forEach(value => {
                const btn = document.createElement('button');
                btn.className = 'quick-btn';
                btn.textContent = value;
                btn.onclick = () => {
                    document.getElementById('fromValue').value = value;
                    convert();
                };
                quickConvert.appendChild(btn);
            });
        }

        function addToHistory(from, fromUnit, to, toUnit) {
            const now = new Date();
            const time = now.toLocaleTimeString('tr-TR');

            const historyItem = {
                time,
                from,
                fromUnit: units[currentCategory].units[fromUnit].name,
                to,
                toUnit: units[currentCategory].units[toUnit].name,
                category: units[currentCategory].name
            };

            history.unshift(historyItem);
            if (history.length > 50) history.pop();

            saveSettings();
        }

        function updateHistory() {
            const historyList = document.getElementById('historyList');

            if (history.length === 0) {
                historyList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Henüz geçmiş yok</p>';
                return;
            }

            historyList.innerHTML = history.map(item => \`
                <div class="history-item">
                    <div class="history-time">\${item.time} • \${item.category}</div>
                    <div class="history-conversion">\${item.from} \${item.fromUnit} = \${item.to} \${item.toUnit}</div>
                </div>
            \`).join('');
        }

        function clearHistory() {
            if (confirm('Geçmişi temizlemek istediğinizden emin misiniz?')) {
                history = [];
                saveSettings();
                updateHistory();
                showToast('Geçmiş temizlendi', 'success');
            }
        }

        function toggleTheme() {
            darkTheme = !darkTheme;
            document.body.classList.toggle('dark-theme');
            document.getElementById('themeIcon').textContent = darkTheme ? '☀️' : '🌙';
            saveSettings();
            playSound('click');
        }

        function showHistory() {
            updateHistory();
            document.getElementById('historyModal').classList.add('show');
            playSound('open');
        }

        function closeHistory() {
            document.getElementById('historyModal').classList.remove('show');
            playSound('close');
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('soundIcon').textContent = soundEnabled ? '🔊' : '🔇';
            saveSettings();
            playSound('click');
        }

        function playSound(type) {
            if (!soundEnabled) return;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequencies = {
                'convert': 800,
                'swap': 600,
                'click': 400,
                'open': 500,
                'close': 300
            };

            oscillator.frequency.value = frequencies[type] || 440;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }

        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const icon = document.getElementById('toastIcon');
            const msg = document.getElementById('toastMessage');

            icon.textContent = type === 'success' ? '✓' : '✗';
            msg.textContent = message;

            toast.className = \`toast show toast-\${type}\`;

            setTimeout(() => {
                toast.classList.add('hide');
                setTimeout(() => {
                    toast.className = 'toast';
                }, 300);
            }, 2000);
        }

        window.addEventListener('load', () => {
            console.log('🔄 Birim Dönüştürücü başlatıldı');
            console.log('📊 Toplam kategori:', Object.keys(units).length);

            try {
                loadSettings();

                const categoryTabs = document.getElementById('categoryTabs');
                for (let [key, value] of Object.entries(units)) {
                    const tab = document.createElement('button');
                    tab.className = 'category-tab' + (key === currentCategory ? ' active' : '');
                    tab.textContent = value.name;
                    tab.onclick = () => {
                        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        setCategory(key);
                        playSound('click');
                    };
                    categoryTabs.appendChild(tab);
                }

                setCategory(currentCategory);

                console.log('✅ Uygulama hazır');

            } catch (error) {
                console.error('❌ Başlatma hatası:', error);
                showToast('Uygulama başlatılırken hata oluştu!', 'error');
            }
        });

        window.addEventListener('error', (event) => {
            console.error('❌ Global hata:', event.error);
            showToast('Bir hata oluştu!', 'error');
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('paste', (e) => {
                    const pastedText = e.clipboardData.getData('text');
                    if (!/^-?\\d*\\.?\\d*$/.test(pastedText)) {
                        e.preventDefault();
                        showToast('Sadece sayı girebilirsiniz!', 'error');
                    }
                });
            });
        });
    </script>
</body>
</html>
    `}} />
  );
}
