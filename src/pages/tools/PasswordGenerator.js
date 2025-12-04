import React, { useState } from 'react';
import { Key, Copy, Check, RotateCcw, Shield, Zap, RefreshCw } from 'lucide-react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  const [history, setHistory] = useState([]);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') return;

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
    setHistory(prev => [newPassword, ...prev].slice(0, 10));
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    setStrength(Math.min(score, 5));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'from-red-500 to-orange-500';
    if (strength <= 3) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Zayıf';
    if (strength <= 3) return 'Orta';
    if (strength <= 4) return 'Güçlü';
    return 'Çok Güçlü';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Key className="w-16 h-16" />
            Şifre Oluşturucu
          </h1>
          <p className="text-xl text-white/90">Güvenli ve güçlü şifreler oluşturun</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Oluşturulan Şifre</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={password}
                readOnly
                placeholder="Şifre oluşturmak için butona tıklayın"
                className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-xl font-mono text-lg bg-gray-50"
              />
              <button
                onClick={copyToClipboard}
                disabled={!password}
                className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : password
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>

            {password && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Şifre Gücü: {getStrengthText()}</span>
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getStrengthColor()} transition-all duration-500`}
                    style={{ width: `${(strength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              Şifre Uzunluğu: {length}
            </label>
            <input
              type="range"
              min="4"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>16</span>
              <span>32</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-semibold">Büyük Harfler (A-Z)</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-semibold">Küçük Harfler (a-z)</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-semibold">Sayılar (0-9)</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-semibold">Semboller (!@#$%^&*)</span>
            </label>
          </div>

          <button
            onClick={generatePassword}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-6 h-6" />
            Şifre Oluştur
          </button>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-500" />
              Geçmiş Şifreler
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((pwd, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setPassword(pwd);
                    calculateStrength(pwd);
                  }}
                  className="p-3 bg-gray-50 rounded-lg font-mono text-sm hover:bg-gray-100 cursor-pointer transition-colors flex justify-between items-center"
                >
                  <span>{pwd}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(pwd);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">💡 Güvenlik İpuçları</h3>
          <ul className="space-y-2 text-sm">
            <li>• En az 12 karakter uzunluğunda şifreler kullanın</li>
            <li>• Büyük harf, küçük harf, sayı ve sembol karışımı kullanın</li>
            <li>• Her hesap için farklı bir şifre kullanın</li>
            <li>• Şifrelerinizi düzenli olarak güncelleyin</li>
            <li>• Şifre yöneticisi kullanmayı düşünün</li>
            <li>• Kişisel bilgilerinizi şifre olarak kullanmayın</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
