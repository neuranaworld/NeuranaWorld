import React, { useState } from 'react';
import { Shapes, Circle, Square, Triangle, Hexagon, Box } from 'lucide-react';

const GeometryCalculator = () => {
  const [shape, setShape] = useState('circle');
  const [params, setParams] = useState({});
  const [results, setResults] = useState(null);

  const shapes = {
    circle: {
      name: 'Daire',
      icon: Circle,
      inputs: [{ name: 'radius', label: 'Yarıçap (r)', unit: 'cm' }],
      calculate: ({ radius }) => ({
        area: Math.PI * Math.pow(radius, 2),
        perimeter: 2 * Math.PI * radius,
        diameter: 2 * radius,
        formulas: {
          alan: 'π × r²',
          çevre: '2 × π × r',
          çap: '2 × r'
        }
      })
    },
    square: {
      name: 'Kare',
      icon: Square,
      inputs: [{ name: 'side', label: 'Kenar (a)', unit: 'cm' }],
      calculate: ({ side }) => ({
        area: Math.pow(side, 2),
        perimeter: 4 * side,
        diagonal: side * Math.sqrt(2),
        formulas: {
          alan: 'a²',
          çevre: '4 × a',
          köşegen: 'a × √2'
        }
      })
    },
    rectangle: {
      name: 'Dikdörtgen',
      icon: Square,
      inputs: [
        { name: 'width', label: 'Genişlik (a)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (b)', unit: 'cm' }
      ],
      calculate: ({ width, height }) => ({
        area: width * height,
        perimeter: 2 * (width + height),
        diagonal: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
        formulas: {
          alan: 'a × b',
          çevre: '2 × (a + b)',
          köşegen: '√(a² + b²)'
        }
      })
    },
    triangle: {
      name: 'Üçgen',
      icon: Triangle,
      inputs: [
        { name: 'base', label: 'Taban (a)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (h)', unit: 'cm' },
        { name: 'side1', label: 'Kenar 1 (b)', unit: 'cm', optional: true },
        { name: 'side2', label: 'Kenar 2 (c)', unit: 'cm', optional: true }
      ],
      calculate: ({ base, height, side1, side2 }) => {
        const area = (base * height) / 2;
        const s1 = side1 || base;
        const s2 = side2 || base;
        const perimeter = parseFloat(base) + parseFloat(s1) + parseFloat(s2);
        return {
          area,
          perimeter,
          formulas: {
            alan: '(a × h) / 2',
            çevre: 'a + b + c'
          }
        };
      }
    },
    trapezoid: {
      name: 'Yamuk',
      icon: Shapes,
      inputs: [
        { name: 'base1', label: 'Taban 1 (a)', unit: 'cm' },
        { name: 'base2', label: 'Taban 2 (b)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (h)', unit: 'cm' }
      ],
      calculate: ({ base1, base2, height }) => ({
        area: ((parseFloat(base1) + parseFloat(base2)) * height) / 2,
        formulas: {
          alan: '((a + b) × h) / 2'
        }
      })
    },
    parallelogram: {
      name: 'Paralelkenar',
      icon: Shapes,
      inputs: [
        { name: 'base', label: 'Taban (a)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (h)', unit: 'cm' },
        { name: 'side', label: 'Yan Kenar (b)', unit: 'cm', optional: true }
      ],
      calculate: ({ base, height, side }) => ({
        area: base * height,
        perimeter: side ? 2 * (parseFloat(base) + parseFloat(side)) : null,
        formulas: {
          alan: 'a × h',
          çevre: '2 × (a + b)'
        }
      })
    },
    hexagon: {
      name: 'Altıgen (Düzgün)',
      icon: Hexagon,
      inputs: [{ name: 'side', label: 'Kenar (a)', unit: 'cm' }],
      calculate: ({ side }) => ({
        area: (3 * Math.sqrt(3) * Math.pow(side, 2)) / 2,
        perimeter: 6 * side,
        formulas: {
          alan: '(3 × √3 × a²) / 2',
          çevre: '6 × a'
        }
      })
    },
    sphere: {
      name: 'Küre',
      icon: Circle,
      inputs: [{ name: 'radius', label: 'Yarıçap (r)', unit: 'cm' }],
      calculate: ({ radius }) => ({
        volume: (4 / 3) * Math.PI * Math.pow(radius, 3),
        surfaceArea: 4 * Math.PI * Math.pow(radius, 2),
        formulas: {
          hacim: '(4/3) × π × r³',
          yüzeyAlanı: '4 × π × r²'
        }
      })
    },
    cube: {
      name: 'Küp',
      icon: Box,
      inputs: [{ name: 'side', label: 'Kenar (a)', unit: 'cm' }],
      calculate: ({ side }) => ({
        volume: Math.pow(side, 3),
        surfaceArea: 6 * Math.pow(side, 2),
        diagonal: side * Math.sqrt(3),
        formulas: {
          hacim: 'a³',
          yüzeyAlanı: '6 × a²',
          köşegen: 'a × √3'
        }
      })
    },
    cylinder: {
      name: 'Silindir',
      icon: Circle,
      inputs: [
        { name: 'radius', label: 'Yarıçap (r)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (h)', unit: 'cm' }
      ],
      calculate: ({ radius, height }) => ({
        volume: Math.PI * Math.pow(radius, 2) * height,
        surfaceArea: 2 * Math.PI * radius * (radius + height),
        lateralArea: 2 * Math.PI * radius * height,
        formulas: {
          hacim: 'π × r² × h',
          yüzeyAlanı: '2 × π × r × (r + h)',
          yanal: '2 × π × r × h'
        }
      })
    },
    cone: {
      name: 'Koni',
      icon: Triangle,
      inputs: [
        { name: 'radius', label: 'Yarıçap (r)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (h)', unit: 'cm' }
      ],
      calculate: ({ radius, height }) => {
        const slantHeight = Math.sqrt(Math.pow(radius, 2) + Math.pow(height, 2));
        return {
          volume: (1 / 3) * Math.PI * Math.pow(radius, 2) * height,
          surfaceArea: Math.PI * radius * (radius + slantHeight),
          lateralArea: Math.PI * radius * slantHeight,
          slantHeight,
          formulas: {
            hacim: '(1/3) × π × r² × h',
            yüzeyAlanı: 'π × r × (r + l)',
            yanal: 'π × r × l',
            yamukluk: '√(r² + h²)'
          }
        };
      }
    },
    rectangularPrism: {
      name: 'Dikdörtgenler Prizması',
      icon: Box,
      inputs: [
        { name: 'length', label: 'Uzunluk (a)', unit: 'cm' },
        { name: 'width', label: 'Genişlik (b)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (c)', unit: 'cm' }
      ],
      calculate: ({ length, width, height }) => ({
        volume: length * width * height,
        surfaceArea: 2 * (length * width + width * height + height * length),
        diagonal: Math.sqrt(Math.pow(length, 2) + Math.pow(width, 2) + Math.pow(height, 2)),
        formulas: {
          hacim: 'a × b × c',
          yüzeyAlanı: '2 × (ab + bc + ca)',
          köşegen: '√(a² + b² + c²)'
        }
      })
    },
    pyramid: {
      name: 'Piramit (Kare Tabanlı)',
      icon: Triangle,
      inputs: [
        { name: 'base', label: 'Taban Kenarı (a)', unit: 'cm' },
        { name: 'height', label: 'Yükseklik (h)', unit: 'cm' }
      ],
      calculate: ({ base, height }) => {
        const slantHeight = Math.sqrt(Math.pow(height, 2) + Math.pow(base / 2, 2));
        return {
          volume: (1 / 3) * Math.pow(base, 2) * height,
          surfaceArea: Math.pow(base, 2) + 2 * base * slantHeight,
          lateralArea: 2 * base * slantHeight,
          slantHeight,
          formulas: {
            hacim: '(1/3) × a² × h',
            yüzeyAlanı: 'a² + 2 × a × l',
            yamukluk: '√(h² + (a/2)²)'
          }
        };
      }
    }
  };

  const handleCalculate = () => {
    const shapeConfig = shapes[shape];
    const allInputs = shapeConfig.inputs.reduce((acc, input) => {
      const value = parseFloat(params[input.name]);
      if (!input.optional && (!value || value <= 0)) {
        return null;
      }
      acc[input.name] = value || 0;
      return acc;
    }, {});

    if (allInputs === null) {
      setResults(null);
      return;
    }

    const calculated = shapeConfig.calculate(allInputs);
    setResults(calculated);
  };

  const updateParam = (name, value) => {
    setParams({ ...params, [name]: value });
  };

  const resetParams = () => {
    setParams({});
    setResults(null);
  };

  const currentShape = shapes[shape];
  const Icon = currentShape.icon;

  const ResultCard = ({ title, value, unit = '', formula = '' }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4">
      <div className="text-sm font-semibold text-gray-600 mb-1">{title}</div>
      <div className="text-3xl font-bold text-blue-700 mb-1">
        {value ? value.toFixed(2) : '-'} {unit}
      </div>
      {formula && <div className="text-xs text-gray-500 font-mono mt-2">{formula}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Shapes className="w-16 h-16" />
            Geometri Hesaplayıcı
          </h1>
          <p className="text-xl text-white/90">Geometrik şekillerin alan, çevre ve hacimlerini hesaplayın</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
          <h2 className="text-2xl font-bold mb-4">Şekil Seç</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">2 Boyutlu Şekiller</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(shapes).filter(([_, s]) => !['sphere', 'cube', 'cylinder', 'cone', 'rectangularPrism', 'pyramid'].includes(_)).map(([key, s]) => {
                const ShapeIcon = s.icon;
                return (
                  <button key={key} onClick={() => { setShape(key); resetParams(); }}
                    className={`p-4 rounded-xl font-semibold transition-all ${shape === key ?
                      'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105' :
                      'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <ShapeIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm">{s.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">3 Boyutlu Şekiller</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(shapes).filter(([key, _]) => ['sphere', 'cube', 'cylinder', 'cone', 'rectangularPrism', 'pyramid'].includes(key)).map(([key, s]) => {
                const ShapeIcon = s.icon;
                return (
                  <button key={key} onClick={() => { setShape(key); resetParams(); }}
                    className={`p-4 rounded-xl font-semibold transition-all ${shape === key ?
                      'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' :
                      'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <ShapeIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm">{s.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Icon className="w-7 h-7 text-blue-600" />
              {currentShape.name}
            </h2>

            <div className="space-y-4">
              {currentShape.inputs.map(input => (
                <div key={input.name}>
                  <label className="block text-sm font-semibold mb-2">
                    {input.label} {input.optional && <span className="text-gray-400">(opsiyonel)</span>}
                  </label>
                  <div className="flex gap-2">
                    <input type="number" step="0.01" min="0"
                      value={params[input.name] || ''}
                      onChange={(e) => updateParam(input.name, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                      placeholder={`${input.label} girin...`}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none" />
                    <span className="bg-gray-100 px-4 py-3 rounded-xl font-semibold text-gray-600 flex items-center">
                      {input.unit}
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button onClick={handleCalculate}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                  Hesapla
                </button>
                <button onClick={resetParams}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold">
                  Sıfırla
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Sonuçlar</h2>
            {results ? (
              <div className="space-y-4">
                {results.area !== undefined && (
                  <ResultCard
                    title="Alan"
                    value={results.area}
                    unit="cm²"
                    formula={results.formulas?.alan}
                  />
                )}
                {results.perimeter !== undefined && results.perimeter !== null && (
                  <ResultCard
                    title="Çevre"
                    value={results.perimeter}
                    unit="cm"
                    formula={results.formulas?.çevre}
                  />
                )}
                {results.volume !== undefined && (
                  <ResultCard
                    title="Hacim"
                    value={results.volume}
                    unit="cm³"
                    formula={results.formulas?.hacim}
                  />
                )}
                {results.surfaceArea !== undefined && (
                  <ResultCard
                    title="Yüzey Alanı"
                    value={results.surfaceArea}
                    unit="cm²"
                    formula={results.formulas?.yüzeyAlanı}
                  />
                )}
                {results.lateralArea !== undefined && (
                  <ResultCard
                    title="Yanal Alan"
                    value={results.lateralArea}
                    unit="cm²"
                    formula={results.formulas?.yanal}
                  />
                )}
                {results.diagonal !== undefined && (
                  <ResultCard
                    title="Köşegen"
                    value={results.diagonal}
                    unit="cm"
                    formula={results.formulas?.köşegen}
                  />
                )}
                {results.diameter !== undefined && (
                  <ResultCard
                    title="Çap"
                    value={results.diameter}
                    unit="cm"
                    formula={results.formulas?.çap}
                  />
                )}
                {results.slantHeight !== undefined && (
                  <ResultCard
                    title="Yamukluk Yüksekliği"
                    value={results.slantHeight}
                    unit="cm"
                    formula={results.formulas?.yamukluk}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <Shapes className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Hesaplama yapmak için değerleri girin</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">📐 Geometri Formülleri</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>2D Şekiller:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Daire Alanı: π × r²</li>
                <li>• Kare Alanı: a²</li>
                <li>• Dikdörtgen Alanı: a × b</li>
                <li>• Üçgen Alanı: (a × h) / 2</li>
                <li>• Düzgün Altıgen: (3√3 × a²) / 2</li>
              </ul>
            </div>
            <div>
              <strong>3D Şekiller:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Küre Hacmi: (4/3) × π × r³</li>
                <li>• Küp Hacmi: a³</li>
                <li>• Silindir Hacmi: π × r² × h</li>
                <li>• Koni Hacmi: (1/3) × π × r² × h</li>
                <li>• Piramit Hacmi: (1/3) × a² × h</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometryCalculator;
