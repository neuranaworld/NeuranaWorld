import React, { useState } from 'react';
import { FileJson, Copy, Check, Download, Upload, Zap } from 'lucide-react';

const JSONVisualizer = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [compact, setCompact] = useState(false);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const result = compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setFormatted(result);
      setError('');
    } catch (err) {
      setError(err.message);
      setFormatted('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setFormatted(JSON.stringify(parsed));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
  };

  const uploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const loadSample = () => {
    const sample = {
      name: "Örnek JSON",
      version: "1.0.0",
      users: [
        { id: 1, name: "Ahmet", active: true },
        { id: 2, name: "Ayşe", active: false }
      ],
      settings: {
        theme: "dark",
        language: "tr",
        notifications: { email: true, sms: false }
      }
    };
    setInput(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <FileJson className="w-16 h-16" />
            JSON Görselleştirici
          </h1>
          <p className="text-xl text-white/90">JSON verilerinizi düzenleyin ve görselleştirin</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">JSON Girişi</h2>
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <input type="file" accept=".json" onChange={uploadFile} className="hidden" />
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-semibold">Yükle</span>
                  </div>
                </label>
                <button
                  onClick={loadSample}
                  className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm font-semibold"
                >
                  Örnek
                </button>
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "value", "array": [1, 2, 3]}'
              className="w-full h-96 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono text-sm resize-none focus:border-blue-500 focus:outline-none"
            />

            {error && (
              <div className="mt-4 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl">
                <strong>Hata:</strong> {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={formatJSON}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg"
              >
                <Zap className="inline w-5 h-5 mr-2" />
                Formatla
              </button>
              <button
                onClick={minifyJSON}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 shadow-lg"
              >
                Sıkıştır
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Formatlanmış JSON</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!formatted}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                    formatted
                      ? copied
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={downloadJSON}
                  disabled={!formatted}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                    formatted
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {formatted ? (
              <pre className="w-full h-96 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl font-mono text-sm overflow-auto">
                {formatted}
              </pre>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-50 border-2 border-gray-300 rounded-xl">
                <div className="text-center text-gray-400">
                  <FileJson className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p>JSON formatlanmamış</p>
                  <p className="text-sm mt-2">Sol tarafa JSON girin ve formatla butonuna tıklayın</p>
                </div>
              </div>
            )}

            {formatted && (
              <div className="mt-4 bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-xl">
                <strong>Başarılı!</strong> JSON doğru formatlandı
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">💡 Özellikler</h3>
          <ul className="space-y-2 text-sm grid md:grid-cols-2 gap-x-8">
            <li>• <strong>Formatla:</strong> JSON'u okunabilir hale getirir</li>
            <li>• <strong>Sıkıştır:</strong> JSON'u minimum boyuta indirir</li>
            <li>• <strong>Kopyala:</strong> Formatlanmış JSON'u kopyalar</li>
            <li>• <strong>İndir:</strong> JSON dosyası olarak kaydeder</li>
            <li>• <strong>Yükle:</strong> Bilgisayarınızdan JSON dosyası yükler</li>
            <li>• <strong>Hata Kontrolü:</strong> Otomatik JSON doğrulama</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JSONVisualizer;
