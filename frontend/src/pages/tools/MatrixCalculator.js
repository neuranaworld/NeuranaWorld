import React, { useState } from 'react';
import { Calculator, Plus, Minus, X, Grid3x3, Shuffle, RotateCcw } from 'lucide-react';

const MatrixCalculator = () => {
  const [rows1, setRows1] = useState(3);
  const [cols1, setCols1] = useState(3);
  const [rows2, setRows2] = useState(3);
  const [cols2, setCols2] = useState(3);
  const [matrix1, setMatrix1] = useState(Array(3).fill().map(() => Array(3).fill(0)));
  const [matrix2, setMatrix2] = useState(Array(3).fill().map(() => Array(3).fill(0)));
  const [result, setResult] = useState(null);
  const [operation, setOperation] = useState('add');
  const [error, setError] = useState('');

  const resizeMatrix = (matrix, newRows, newCols) => {
    const newMatrix = Array(newRows).fill().map(() => Array(newCols).fill(0));
    for (let i = 0; i < Math.min(matrix.length, newRows); i++) {
      for (let j = 0; j < Math.min(matrix[0].length, newCols); j++) {
        newMatrix[i][j] = matrix[i][j];
      }
    }
    return newMatrix;
  };

  const updateMatrix1Size = (newRows, newCols) => {
    setRows1(newRows);
    setCols1(newCols);
    setMatrix1(resizeMatrix(matrix1, newRows, newCols));
  };

  const updateMatrix2Size = (newRows, newCols) => {
    setRows2(newRows);
    setCols2(newCols);
    setMatrix2(resizeMatrix(matrix2, newRows, newCols));
  };

  const updateCell = (matrixNum, row, col, value) => {
    const val = parseFloat(value) || 0;
    if (matrixNum === 1) {
      const newMatrix = [...matrix1];
      newMatrix[row][col] = val;
      setMatrix1(newMatrix);
    } else {
      const newMatrix = [...matrix2];
      newMatrix[row][col] = val;
      setMatrix2(newMatrix);
    }
  };

  const addMatrices = (m1, m2) => {
    if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
      throw new Error('Matrisler aynı boyutta olmalı!');
    }
    return m1.map((row, i) => row.map((val, j) => val + m2[i][j]));
  };

  const subtractMatrices = (m1, m2) => {
    if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
      throw new Error('Matrisler aynı boyutta olmalı!');
    }
    return m1.map((row, i) => row.map((val, j) => val - m2[i][j]));
  };

  const multiplyMatrices = (m1, m2) => {
    if (m1[0].length !== m2.length) {
      throw new Error('İlk matrisin sütun sayısı, ikinci matrisin satır sayısına eşit olmalı!');
    }
    const result = Array(m1.length).fill().map(() => Array(m2[0].length).fill(0));
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2[0].length; j++) {
        for (let k = 0; k < m2.length; k++) {
          result[i][j] += m1[i][k] * m2[k][j];
        }
      }
    }
    return result;
  };

  const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };

  const determinant = (matrix) => {
    const n = matrix.length;
    if (n !== matrix[0].length) {
      throw new Error('Determinant sadece kare matrisler için hesaplanabilir!');
    }
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = matrix.slice(1).map(row => row.filter((_, i) => i !== j));
      det += Math.pow(-1, j) * matrix[0][j] * determinant(minor);
    }
    return det;
  };

  const scalarMultiply = (matrix, scalar) => {
    return matrix.map(row => row.map(val => val * scalar));
  };

  const inverse = (matrix) => {
    const n = matrix.length;
    if (n !== matrix[0].length) {
      throw new Error('Ters matris sadece kare matrisler için hesaplanabilir!');
    }

    const det = determinant(matrix);
    if (Math.abs(det) < 1e-10) {
      throw new Error('Matris tekil (determinant 0), tersi alınamaz!');
    }

    if (n === 2) {
      return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det]
      ];
    }

    // Kofaktör yöntemi ile ters alma
    const cofactors = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const minor = matrix.filter((_, row) => row !== i).map(row => row.filter((_, col) => col !== j));
        cofactors[i][j] = Math.pow(-1, i + j) * determinant(minor);
      }
    }
    const adjugate = transpose(cofactors);
    return scalarMultiply(adjugate, 1 / det);
  };

  const calculate = () => {
    setError('');
    try {
      let res;
      switch (operation) {
        case 'add':
          res = addMatrices(matrix1, matrix2);
          break;
        case 'subtract':
          res = subtractMatrices(matrix1, matrix2);
          break;
        case 'multiply':
          res = multiplyMatrices(matrix1, matrix2);
          break;
        case 'transpose1':
          res = transpose(matrix1);
          break;
        case 'transpose2':
          res = transpose(matrix2);
          break;
        case 'determinant1':
          res = [[determinant(matrix1)]];
          break;
        case 'determinant2':
          res = [[determinant(matrix2)]];
          break;
        case 'inverse1':
          res = inverse(matrix1);
          break;
        case 'inverse2':
          res = inverse(matrix2);
          break;
        default:
          res = matrix1;
      }
      setResult(res);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const fillRandom = (matrixNum) => {
    const fill = (matrix) => matrix.map(row => row.map(() => Math.floor(Math.random() * 20) - 10));
    if (matrixNum === 1) {
      setMatrix1(fill(matrix1));
    } else {
      setMatrix2(fill(matrix2));
    }
  };

  const fillIdentity = (matrixNum) => {
    const size = matrixNum === 1 ? Math.min(rows1, cols1) : Math.min(rows2, cols2);
    const identity = Array(size).fill().map((_, i) => Array(size).fill(0).map((_, j) => i === j ? 1 : 0));
    if (matrixNum === 1) {
      updateMatrix1Size(size, size);
      setMatrix1(identity);
    } else {
      updateMatrix2Size(size, size);
      setMatrix2(identity);
    }
  };

  const clearMatrix = (matrixNum) => {
    if (matrixNum === 1) {
      setMatrix1(Array(rows1).fill().map(() => Array(cols1).fill(0)));
    } else {
      setMatrix2(Array(rows2).fill().map(() => Array(cols2).fill(0)));
    }
  };

  const MatrixDisplay = ({ matrix, title, matrixNum }) => (
    <div className="bg-white rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => fillRandom(matrixNum)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <Shuffle className="w-4 h-4" /> Rastgele
          </button>
          <button onClick={() => fillIdentity(matrixNum)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <Grid3x3 className="w-4 h-4" /> Birim
          </button>
          <button onClick={() => clearMatrix(matrixNum)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> Temizle
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Satır</label>
          <input type="number" min="1" max="6" value={matrixNum === 1 ? rows1 : rows2}
            onChange={(e) => matrixNum === 1 ? updateMatrix1Size(parseInt(e.target.value), cols1) : updateMatrix2Size(parseInt(e.target.value), cols2)}
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Sütun</label>
          <input type="number" min="1" max="6" value={matrixNum === 1 ? cols1 : cols2}
            onChange={(e) => matrixNum === 1 ? updateMatrix1Size(rows1, parseInt(e.target.value)) : updateMatrix2Size(rows2, parseInt(e.target.value))}
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j} className="p-1">
                    <input type="number" step="0.1" value={val}
                      onChange={(e) => updateCell(matrixNum, i, j, e.target.value)}
                      className="w-16 px-2 py-1 text-center border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ResultDisplay = ({ matrix }) => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
      <h2 className="text-xl font-bold mb-4 text-green-800">Sonuç</h2>
      <div className="overflow-x-auto">
        <table className="border-collapse mx-auto">
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j} className="p-2">
                    <div className="w-20 px-3 py-2 text-center bg-white rounded-lg font-mono font-bold text-green-700 border-2 border-green-300">
                      {typeof val === 'number' ? val.toFixed(2) : val}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-16 h-16" />
            Matris Hesaplayıcı
          </h1>
          <p className="text-xl text-white/90">Matris işlemlerini kolayca hesaplayın</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6">
          <h2 className="text-xl font-bold mb-4">İşlem Seç</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: 'add', name: 'Toplama', icon: Plus, color: 'green' },
              { id: 'subtract', name: 'Çıkarma', icon: Minus, color: 'orange' },
              { id: 'multiply', name: 'Çarpma', icon: X, color: 'blue' },
              { id: 'transpose1', name: 'Devrik (M1)', icon: Shuffle, color: 'purple' },
              { id: 'transpose2', name: 'Devrik (M2)', icon: Shuffle, color: 'purple' },
              { id: 'determinant1', name: 'Determinant (M1)', icon: Grid3x3, color: 'red' },
              { id: 'determinant2', name: 'Determinant (M2)', icon: Grid3x3, color: 'red' },
              { id: 'inverse1', name: 'Ters (M1)', icon: RotateCcw, color: 'pink' },
              { id: 'inverse2', name: 'Ters (M2)', icon: RotateCcw, color: 'pink' },
            ].map(op => (
              <button key={op.id} onClick={() => setOperation(op.id)}
                className={`p-3 rounded-xl font-semibold transition-all ${operation === op.id ?
                  `bg-${op.color}-500 text-white shadow-lg scale-105` :
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <op.icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs">{op.name}</div>
              </button>
            ))}
          </div>
          <button onClick={calculate}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 shadow-lg">
            Hesapla
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <MatrixDisplay matrix={matrix1} title="Matris 1" matrixNum={1} />
          {!operation.includes('transpose1') && !operation.includes('determinant1') && !operation.includes('inverse1') && (
            <MatrixDisplay matrix={matrix2} title="Matris 2" matrixNum={2} />
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6">
            <strong>Hata:</strong> {error}
          </div>
        )}

        {result && !error && <ResultDisplay matrix={result} />}

        <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">📚 Matris İşlemleri</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Toplama/Çıkarma:</strong> Matrisler aynı boyutta olmalı
            </div>
            <div>
              <strong>Çarpma:</strong> M1'in sütun sayısı = M2'nin satır sayısı
            </div>
            <div>
              <strong>Devrik:</strong> Satır ve sütunları yer değiştirir
            </div>
            <div>
              <strong>Determinant:</strong> Sadece kare matrisler için
            </div>
            <div>
              <strong>Ters Matris:</strong> Determinant 0 olmamalı
            </div>
            <div>
              <strong>Birim Matris:</strong> Köşegen elemanları 1, diğerleri 0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixCalculator;
