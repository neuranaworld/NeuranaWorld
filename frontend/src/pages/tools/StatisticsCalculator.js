import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calculator, Plus, Trash2, Download } from 'lucide-react';

const StatisticsCalculator = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [data2, setData2] = useState([]);
  const [input2, setInput2] = useState('');

  const addValue = (dataset) => {
    const value = parseFloat(dataset === 1 ? input : input2);
    if (!isNaN(value)) {
      if (dataset === 1) {
        setData([...data, value]);
        setInput('');
      } else {
        setData2([...data2, value]);
        setInput2('');
      }
    }
  };

  const removeValue = (dataset, index) => {
    if (dataset === 1) {
      setData(data.filter((_, i) => i !== index));
    } else {
      setData2(data2.filter((_, i) => i !== index));
    }
  };

  const clearData = (dataset) => {
    if (dataset === 1) {
      setData([]);
    } else {
      setData2([]);
    }
  };

  const loadSample = () => {
    setData([85, 90, 78, 92, 88, 95, 82, 89, 91, 87]);
    setData2([75, 82, 88, 79, 85, 90, 76, 84, 86, 81]);
  };

  const mean = (arr) => {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  };

  const median = (arr) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };

  const mode = (arr) => {
    if (arr.length === 0) return [];
    const freq = {};
    arr.forEach(val => freq[val] = (freq[val] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    return Object.keys(freq).filter(key => freq[key] === maxFreq).map(Number);
  };

  const variance = (arr) => {
    if (arr.length === 0) return 0;
    const m = mean(arr);
    return arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / arr.length;
  };

  const stdDev = (arr) => {
    return Math.sqrt(variance(arr));
  };

  const range = (arr) => {
    if (arr.length === 0) return 0;
    return Math.max(...arr) - Math.min(...arr);
  };

  const quartiles = (arr) => {
    if (arr.length === 0) return { q1: 0, q2: 0, q3: 0 };
    const sorted = [...arr].sort((a, b) => a - b);
    const q2 = median(sorted);
    const mid = Math.floor(sorted.length / 2);
    const lower = sorted.slice(0, sorted.length % 2 === 0 ? mid : mid + 1);
    const upper = sorted.slice(mid);
    return {
      q1: median(lower),
      q2: q2,
      q3: median(upper)
    };
  };

  const correlation = (arr1, arr2) => {
    if (arr1.length !== arr2.length || arr1.length === 0) return 0;
    const n = arr1.length;
    const mean1 = mean(arr1);
    const mean2 = mean(arr2);
    const numerator = arr1.reduce((sum, val, i) => sum + (val - mean1) * (arr2[i] - mean2), 0);
    const denominator = Math.sqrt(
      arr1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
      arr2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
    );
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const covariance = (arr1, arr2) => {
    if (arr1.length !== arr2.length || arr1.length === 0) return 0;
    const mean1 = mean(arr1);
    const mean2 = mean(arr2);
    return arr1.reduce((sum, val, i) => sum + (val - mean1) * (arr2[i] - mean2), 0) / arr1.length;
  };

  const percentile = (arr, p) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const skewness = (arr) => {
    if (arr.length === 0) return 0;
    const m = mean(arr);
    const sd = stdDev(arr);
    if (sd === 0) return 0;
    const n = arr.length;
    return (n / ((n - 1) * (n - 2))) *
      arr.reduce((sum, val) => sum + Math.pow((val - m) / sd, 3), 0);
  };

  const kurtosis = (arr) => {
    if (arr.length === 0) return 0;
    const m = mean(arr);
    const sd = stdDev(arr);
    if (sd === 0) return 0;
    const n = arr.length;
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) *
      arr.reduce((sum, val) => sum + Math.pow((val - m) / sd, 4), 0) -
      (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  };

  const stats1 = {
    mean: mean(data),
    median: median(data),
    mode: mode(data),
    variance: variance(data),
    stdDev: stdDev(data),
    range: range(data),
    min: data.length > 0 ? Math.min(...data) : 0,
    max: data.length > 0 ? Math.max(...data) : 0,
    ...quartiles(data),
    count: data.length,
    sum: data.reduce((a, b) => a + b, 0),
    skewness: skewness(data),
    kurtosis: kurtosis(data),
  };

  const stats2 = data2.length > 0 ? {
    mean: mean(data2),
    median: median(data2),
    mode: mode(data2),
    variance: variance(data2),
    stdDev: stdDev(data2),
    range: range(data2),
    min: Math.min(...data2),
    max: Math.max(...data2),
    ...quartiles(data2),
    count: data2.length,
    sum: data2.reduce((a, b) => a + b, 0),
  } : null;

  const corr = data.length > 0 && data2.length > 0 && data.length === data2.length ? correlation(data, data2) : null;
  const cov = data.length > 0 && data2.length > 0 && data.length === data2.length ? covariance(data, data2) : null;

  const exportData = () => {
    const text = `İstatistik Analiz Raporu
========================

Veri Seti 1:
${data.join(', ')}

Temel İstatistikler:
- Ortalama: ${stats1.mean.toFixed(2)}
- Medyan: ${stats1.median.toFixed(2)}
- Mod: ${stats1.mode.join(', ')}
- Varyans: ${stats1.variance.toFixed(2)}
- Standart Sapma: ${stats1.stdDev.toFixed(2)}
- Aralık: ${stats1.range.toFixed(2)}
- Min: ${stats1.min.toFixed(2)}
- Max: ${stats1.max.toFixed(2)}
- Q1: ${stats1.q1.toFixed(2)}
- Q2 (Medyan): ${stats1.q2.toFixed(2)}
- Q3: ${stats1.q3.toFixed(2)}
- Toplam: ${stats1.sum.toFixed(2)}
- Çarpıklık: ${stats1.skewness.toFixed(4)}
- Basıklık: ${stats1.kurtosis.toFixed(4)}

${data2.length > 0 ? `Veri Seti 2:
${data2.join(', ')}

Veri Seti 2 İstatistikleri:
- Ortalama: ${stats2.mean.toFixed(2)}
- Medyan: ${stats2.median.toFixed(2)}
- Standart Sapma: ${stats2.stdDev.toFixed(2)}

İki Veri Seti Analizi:
- Korelasyon: ${corr !== null ? corr.toFixed(4) : 'N/A'}
- Kovaryans: ${cov !== null ? cov.toFixed(4) : 'N/A'}` : ''}
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'istatistik-rapor.txt';
    a.click();
  };

  const StatCard = ({ title, value, color = 'blue', subtitle = '' }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 border-2 border-${color}-300 rounded-xl p-4`}>
      <div className="text-sm font-semibold text-gray-600 mb-1">{title}</div>
      <div className={`text-2xl font-bold text-${color}-700`}>
        {typeof value === 'number' ? value.toFixed(2) : Array.isArray(value) ? value.join(', ') : value}
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  const DataInput = ({ dataset, dataArray, inputValue, setInputValue }) => (
    <div className="bg-white rounded-2xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold mb-4">Veri Seti {dataset}</h2>
      <div className="flex gap-2 mb-4">
        <input type="number" step="0.01" value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addValue(dataset)}
          placeholder="Değer girin..."
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none" />
        <button onClick={() => addValue(dataset)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Ekle
        </button>
        <button onClick={() => clearData(dataset)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-xl">
        {dataArray.map((val, idx) => (
          <span key={idx}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2">
            {val}
            <button onClick={() => removeValue(dataset, idx)} className="hover:text-red-300">×</button>
          </span>
        ))}
        {dataArray.length === 0 && (
          <span className="text-gray-400 text-sm">Henüz veri eklenmedi</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="w-16 h-16" />
            İstatistik Hesaplayıcı
          </h1>
          <p className="text-xl text-white/90">Kapsamlı istatistiksel analiz araçları</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={loadSample}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold">
            Örnek Veri Yükle
          </button>
          {data.length > 0 && (
            <button onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              <Download className="w-5 h-5" /> Rapor İndir
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <DataInput dataset={1} dataArray={data} inputValue={input} setInputValue={setInput} />
          <DataInput dataset={2} dataArray={data2} inputValue={input2} setInputValue={setInput2} />
        </div>

        {data.length > 0 && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-7 h-7 text-blue-600" />
                Veri Seti 1 - Temel İstatistikler
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Ortalama (Mean)" value={stats1.mean} color="blue" />
                <StatCard title="Medyan (Median)" value={stats1.median} color="green" />
                <StatCard title="Mod (Mode)" value={stats1.mode} color="purple" />
                <StatCard title="Varyans" value={stats1.variance} color="orange" />
                <StatCard title="Standart Sapma" value={stats1.stdDev} color="red" />
                <StatCard title="Aralık (Range)" value={stats1.range} color="pink" />
                <StatCard title="Minimum" value={stats1.min} color="cyan" />
                <StatCard title="Maksimum" value={stats1.max} color="indigo" />
                <StatCard title="Q1 (1. Çeyrek)" value={stats1.q1} color="teal" />
                <StatCard title="Q2 (Medyan)" value={stats1.q2} color="emerald" />
                <StatCard title="Q3 (3. Çeyrek)" value={stats1.q3} color="lime" />
                <StatCard title="Toplam" value={stats1.sum} color="amber" />
                <StatCard title="Veri Sayısı" value={stats1.count} color="rose" />
                <StatCard title="Çarpıklık" value={stats1.skewness} color="violet" subtitle="Dağılım simetrisi" />
                <StatCard title="Basıklık" value={stats1.kurtosis} color="fuchsia" subtitle="Uç değer eğilimi" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-purple-600" />
                Yüzdelik Dilimler (Percentiles)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[10, 25, 50, 75, 90, 95, 99].map(p => (
                  <StatCard key={p} title={`${p}. Yüzdelik`} value={percentile(data, p)} color="purple" />
                ))}
              </div>
            </div>
          </>
        )}

        {data2.length > 0 && stats2 && (
          <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold mb-6">Veri Seti 2 - İstatistikler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Ortalama" value={stats2.mean} color="blue" />
              <StatCard title="Medyan" value={stats2.median} color="green" />
              <StatCard title="Standart Sapma" value={stats2.stdDev} color="red" />
              <StatCard title="Veri Sayısı" value={stats2.count} color="purple" />
            </div>
          </div>
        )}

        {corr !== null && cov !== null && (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-6 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold mb-6 text-purple-800">İki Veri Seti Analizi</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 border-2 border-purple-300">
                <div className="text-sm font-semibold text-gray-600 mb-2">Korelasyon Katsayısı (r)</div>
                <div className="text-4xl font-bold text-purple-700 mb-2">{corr.toFixed(4)}</div>
                <div className="text-sm text-gray-600">
                  {Math.abs(corr) > 0.7 ? '🔴 Güçlü' : Math.abs(corr) > 0.4 ? '🟡 Orta' : '🟢 Zayıf'} ilişki
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {corr > 0 ? '↗️ Pozitif yönlü' : '↘️ Negatif yönlü'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-pink-300">
                <div className="text-sm font-semibold text-gray-600 mb-2">Kovaryans</div>
                <div className="text-4xl font-bold text-pink-700">{cov.toFixed(4)}</div>
                <div className="text-sm text-gray-600 mt-2">
                  Değişkenlerin birlikte değişimi
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">📊 İstatistik Kavramları</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Ortalama:</strong> Tüm değerlerin toplamının sayıya bölümü</div>
            <div><strong>Medyan:</strong> Sıralı veride ortadaki değer</div>
            <div><strong>Mod:</strong> En sık tekrar eden değer(ler)</div>
            <div><strong>Varyans:</strong> Verilerin ortalamadan sapmasının karesi</div>
            <div><strong>Standart Sapma:</strong> Varyansın karekökü, verinin yayılımı</div>
            <div><strong>Çeyrekler (Q1, Q2, Q3):</strong> Veriyi %25'lik dilimlere bölen değerler</div>
            <div><strong>Korelasyon:</strong> İki veri seti arasındaki doğrusal ilişki (-1 ile 1 arası)</div>
            <div><strong>Çarpıklık:</strong> Dağılımın simetrisinden sapma (0: simetrik)</div>
            <div><strong>Basıklık:</strong> Dağılımın uç değer eğilimi (0: normal dağılım)</div>
            <div><strong>Yüzdelik:</strong> Verinin belirli bir yüzdesinin altında kalan değer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCalculator;
