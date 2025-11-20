import React, { useState } from 'react';
import { QrCode, Download, Copy, Check, Link, Mail, Phone, Wifi, MapPin, CreditCard } from 'lucide-react';

const QRCodeGenerator = () => {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('https://');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);

  const modes = [
    { id: 'text', name: 'Metin', icon: QrCode, placeholder: 'Metninizi girin' },
    { id: 'url', name: 'URL', icon: Link, placeholder: 'https://example.com' },
    { id: 'email', name: 'E-posta', icon: Mail, placeholder: 'ornek@email.com' },
    { id: 'phone', name: 'Telefon', icon: Phone, placeholder: '+90 555 123 45 67' },
    { id: 'wifi', name: 'WiFi', icon: Wifi, placeholder: '' },
  ];

  const getQRData = () => {
    switch (mode) {
      case 'text': return text;
      case 'url': return url;
      case 'email': return `mailto:${email}`;
      case 'phone': return `tel:${phone}`;
      case 'wifi': return `WIFI:T:${wifiType};S:${wifiSSID};P:${wifiPassword};;`;
      default: return text;
    }
  };

  const qrData = getQRData();
  const qrUrl = qrData ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <QrCode className="w-16 h-16" />
            QR Kod Oluşturucu
          </h1>
          <p className="text-xl text-white/90">Her türlü içerik için QR kod oluştur</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">İçerik Türü</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {modes.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`p-4 rounded-xl font-semibold transition-all ${mode === m.id ?
                    'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <m.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">{m.name}</div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {mode === 'text' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Metin</label>
                  <textarea value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="QR koda çevirmek istediğiniz metni girin..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    rows="5" />
                </div>
              )}

              {mode === 'url' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Web Adresi</label>
                  <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none" />
                </div>
              )}

              {mode === 'email' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">E-posta Adresi</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none" />
                </div>
              )}

              {mode === 'phone' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Telefon Numarası</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 555 123 45 67"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none" />
                </div>
              )}

              {mode === 'wifi' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">WiFi Adı (SSID)</label>
                    <input type="text" value={wifiSSID} onChange={(e) => setWifiSSID(e.target.value)}
                      placeholder="WiFi-Ağınız"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Şifre</label>
                    <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="wifi-şifresi"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Güvenlik</label>
                    <select value={wifiType} onChange={(e) => setWifiType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none">
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Açık (Şifresiz)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Boyut: {size}x{size}</label>
                <input type="range" min="128" max="512" step="64" value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Küçük</span><span>Orta</span><span>Büyük</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">QR Kod</h2>
            {qrData ? (
              <div className="flex flex-col items-center">
                <img src={qrUrl} alt="QR Code" className="rounded-lg shadow-lg mb-6" />
                <div className="w-full space-y-3">
                  <button onClick={downloadQR}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> İndir
                  </button>
                  <button onClick={copyToClipboard}
                    className={`w-full px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      copied ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'}`}>
                    {copied ? <><Check className="w-5 h-5" /> Kopyalandı!</> : <><Copy className="w-5 h-5" /> URL Kopyala</>}
                  </button>
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <div className="text-sm font-semibold mb-2">İçerik:</div>
                    <div className="text-xs text-gray-600 break-all max-h-24 overflow-y-auto">{qrData}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <QrCode className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">QR kod oluşturmak için veri girin</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">💡 Kullanım</h3>
          <ul className="space-y-2 text-sm grid md:grid-cols-2 gap-4">
            <li>• <strong>Metin:</strong> Basit metin/mesaj paylaşımı</li>
            <li>• <strong>URL:</strong> Web sitesi linklerini paylaş</li>
            <li>• <strong>E-posta:</strong> E-posta gönderme için hızlı erişim</li>
            <li>• <strong>Telefon:</strong> Numarayı arama için hazırla</li>
            <li>• <strong>WiFi:</strong> WiFi ağına otomatik bağlan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
