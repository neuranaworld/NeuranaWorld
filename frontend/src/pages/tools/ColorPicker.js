import React, { useState } from 'react';
import { Palette, Copy, Check, Plus, Trash2, Download } from 'lucide-react';

const ColorPicker = () => {
  const [color, setColor] = useState('#3b82f6');
  const [palette, setPalette] = useState([]);
  const [copied, setCopied] = useState('');
  const [format, setFormat] = useState('hex');

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: h = 0;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const getColorFormat = () => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    switch (format) {
      case 'hex': return color.toUpperCase();
      case 'rgb': return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'rgba': return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.0)`;
      case 'hsl': return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      default: return color;
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const addToPalette = () => {
    if (!palette.includes(color)) {
      setPalette([...palette, color]);
    }
  };

  const removeFromPalette = (c) => {
    setPalette(palette.filter(p => p !== c));
  };

  const generateShades = () => {
    const rgb = hexToRgb(color);
    if (!rgb) return;
    const shades = [];
    for (let i = 0; i < 10; i++) {
      const factor = i / 9;
      const r = Math.round(rgb.r * (1 - factor) + 255 * factor);
      const g = Math.round(rgb.g * (1 - factor) + 255 * factor);
      const b = Math.round(rgb.b * (1 - factor) + 255 * factor);
      shades.push(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
    }
    setPalette([...new Set([...palette, ...shades])]);
  };

  const generateComplementary = () => {
    const rgb = hexToRgb(color);
    if (!rgb) return;
    const comp = {
      r: 255 - rgb.r,
      g: 255 - rgb.g,
      b: 255 - rgb.b
    };
    const compHex = `#${((1 << 24) + (comp.r << 16) + (comp.g << 8) + comp.b).toString(16).slice(1)}`;
    if (!palette.includes(compHex)) {
      setPalette([...palette, compHex]);
    }
  };

  const exportPalette = () => {
    const data = JSON.stringify(palette, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Palette className="w-16 h-16" />
            Renk Seçici & Palet
          </h1>
          <p className="text-xl text-white/90">Renkler seç, paletler oluştur</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Renk Seçici</h2>
            
            <div className="mb-6">
              <div
                className="w-full h-48 rounded-xl shadow-lg mb-4 transition-all"
                style={{ backgroundColor: color }}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-16 rounded-xl cursor-pointer"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Renk Kodu</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono"
                />
                <button
                  onClick={() => copyToClipboard(color)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  {copied === color ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Format</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['hex', 'rgb', 'rgba', 'hsl'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      format === f
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getColorFormat()}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(getColorFormat())}
                  className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  {copied === getColorFormat() ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={addToPalette}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700"
              >
                <Plus className="inline w-5 h-5 mr-2" />
                Palete Ekle
              </button>
              <button
                onClick={generateComplementary}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600"
              >
                Tamamlayıcı
              </button>
              <button
                onClick={generateShades}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 col-span-2"
              >
                Tonlar Oluştur
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Renk Paleti</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportPalette}
                  disabled={palette.length === 0}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    palette.length > 0
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPalette([])}
                  disabled={palette.length === 0}
                  className={`px-4 py-2 rounded-xl font-semibold ${
                    palette.length > 0
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {palette.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Palette className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p>Paletiniz boş</p>
                <p className="text-sm mt-2">Renk eklemek için "Palete Ekle" butonunu kullanın</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {palette.map((c, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromPalette(c);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(c);
                      }}
                      className="absolute bottom-1 right-1 bg-black/50 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied === c ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <div className="absolute bottom-1 left-1 text-xs font-mono bg-black/50 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {c}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">💡 İpuçları</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Palete Ekle:</strong> Seçili rengi paletinize ekler</li>
            <li>• <strong>Tamamlayıcı:</strong> Rengin tamamlayıcı rengini bulur</li>
            <li>• <strong>Tonlar Oluştur:</strong> Açıktan koyuya 10 ton oluşturur</li>
            <li>• <strong>Kopyala:</strong> Renk kodunu panoya kopyalar</li>
            <li>• <strong>Export:</strong> Paletinizi JSON olarak indirir</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
