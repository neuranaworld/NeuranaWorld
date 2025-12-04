import React, { useState } from 'react';
import { FileText, Copy, Check, RotateCcw } from 'lucide-react';

const TextDiff = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [copied, setCopied] = useState('');

  const getDiff = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLen = Math.max(lines1.length, lines2.length);
    const diff = [];

    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 === line2) {
        diff.push({ type: 'equal', line1, line2, num: i + 1 });
      } else if (!line1) {
        diff.push({ type: 'added', line1, line2, num: i + 1 });
      } else if (!line2) {
        diff.push({ type: 'removed', line1, line2, num: i + 1 });
      } else {
        diff.push({ type: 'modified', line1, line2, num: i + 1 });
      }
    }

    return diff;
  };

  const diff = getDiff();
  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    modified: diff.filter(d => d.type === 'modified').length,
    equal: diff.filter(d => d.type === 'equal').length,
  };

  const copyDiff = async () => {
    const diffText = diff.map(d => {
      if (d.type === 'added') return `+ ${d.line2}`;
      if (d.type === 'removed') return `- ${d.line1}`;
      if (d.type === 'modified') return `~ ${d.line1} → ${d.line2}`;
      return `  ${d.line1}`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(diffText);
      setCopied('diff');
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const loadSample = () => {
    setText1(`Merhaba Dünya
Bu bir test metnidir
İlk satır
İkinci satır
Üçüncü satır`);
    setText2(`Merhaba Dünya
Bu bir test metnidir
Değiştirilmiş satır
İkinci satır
Dördüncü satır
Beşinci satır`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <FileText className="w-16 h-16" />
            Metin Karşılaştırıcı
          </h1>
          <p className="text-xl text-white/90">İki metni karşılaştır ve farklılıkları gör</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={loadSample}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold">
            Örnek Yükle
          </button>
          <button onClick={() => { setText1(''); setText2(''); }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> Temizle
          </button>
          <button onClick={copyDiff}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
              copied === 'diff' ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            {copied === 'diff' ? <><Check className="w-5 h-5" /> Kopyalandı!</> : <><Copy className="w-5 h-5" /> Farkı Kopyala</>}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Metin 1 (Eski)</h2>
            <textarea value={text1} onChange={(e) => setText1(e.target.value)}
              placeholder="İlk metni buraya yapıştırın..."
              className="w-full h-96 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono text-sm resize-none focus:border-blue-500 focus:outline-none" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Metin 2 (Yeni)</h2>
            <textarea value={text2} onChange={(e) => setText2(e.target.value)}
              placeholder="İkinci metni buraya yapıştırın..."
              className="w-full h-96 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono text-sm resize-none focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Karşılaştırma Sonucu</h2>
            <div className="flex gap-4 text-sm">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold">+ {stats.added} eklendi</span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-semibold">- {stats.removed} silindi</span>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-semibold">~ {stats.modified} değişti</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-semibold">= {stats.equal} aynı</span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-xl">
            {diff.length > 0 ? (
              <table className="w-full font-mono text-sm">
                <tbody>
                  {diff.map((d, idx) => (
                    <tr key={idx} className={`
                      ${d.type === 'added' ? 'bg-green-50' : ''}
                      ${d.type === 'removed' ? 'bg-red-50' : ''}
                      ${d.type === 'modified' ? 'bg-yellow-50' : ''}
                      border-b border-gray-200
                    `}>
                      <td className="px-4 py-2 text-gray-500 w-12">{d.num}</td>
                      <td className="px-4 py-2 w-1/2">
                        {d.line1 && (
                          <span className={d.type === 'removed' || d.type === 'modified' ? 'line-through text-red-600' : ''}>
                            {d.line1}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 w-1/2">
                        {d.line2 && (
                          <span className={d.type === 'added' || d.type === 'modified' ? 'font-bold text-green-600' : ''}>
                            {d.line2}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <FileText className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p>Karşılaştırma yapılacak metin yok</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">📖 Nasıl Kullanılır</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Yeşil:</strong> Sadece ikinci metinde var (eklenen satırlar)</li>
            <li>• <strong>Kırmızı:</strong> Sadece ilk metinde var (silinen satırlar)</li>
            <li>• <strong>Sarı:</strong> Her iki metinde var ama farklı (değiştirilen satırlar)</li>
            <li>• <strong>Beyaz:</strong> Her iki metinde de aynı (değişmeyen satırlar)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TextDiff;
