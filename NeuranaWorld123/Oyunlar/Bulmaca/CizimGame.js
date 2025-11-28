import React, { useRef, useState, useEffect } from 'react';
import { Paintbrush, Eraser, Trash2, Download, Undo, Redo, Circle, Square, Minus, Type, Droplet, Save, FolderOpen, Settings, ZoomIn, ZoomOut, Move, Upload, Pipette, Star, Grid3x3, Maximize2 } from 'lucide-react';

export default function CizimTahtasi() {
  const canvasRef = useRef(null);
  const minimapRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush');
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [startPos, setStartPos] = useState(null);
  const [isShapeDrawing, setIsShapeDrawing] = useState(false);
  const [tempCanvas, setTempCanvas] = useState(null);
  const [fillMode, setFillMode] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [isSprayPaint, setIsSprayPaint] = useState(false);
  const [symmetryMode, setSymmetryMode] = useState(false);
  const [symmetryLines, setSymmetryLines] = useState(4);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientColor2, setGradientColor2] = useState('#FF0000');
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(50);
  const [recentColors, setRecentColors] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [showResizeDialog, setShowResizeDialog] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [cursorPreview, setCursorPreview] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blendMode, setBlendMode] = useState('source-over');
  const [autoSave, setAutoSave] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [brushStyleMode, setBrushStyleMode] = useState('round');
  const [shadowBlur, setShadowBlur] = useState(0);

  const brushPresets = [
    { name: '✏️ Kalem', size: 2, opacity: 1, blur: 0 },
    { name: '🖊️ İnce', size: 4, opacity: 0.9, blur: 0 },
    { name: '🖌️ Fırça', size: 8, opacity: 0.8, blur: 1 },
    { name: '🎨 Boya', size: 15, opacity: 0.7, blur: 2 },
    { name: '✨ Yumuşak', size: 25, opacity: 0.4, blur: 8 },
    { name: '💨 Sprey', size: 35, opacity: 0.2, blur: 15 },
    { name: '📏 Marker', size: 10, opacity: 1, blur: 0 },
    { name: '🌟 Işık', size: 30, opacity: 0.3, blur: 25 }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#808080', '#C0C0C0',
    '#FF0000', '#DC143C', '#8B0000', '#FF6B6B', '#FFB6C1', '#FFC0CB',
    '#FF8C00', '#FFA500', '#FF7F50', '#FF6347', '#FFD700',
    '#FFFF00', '#FFD700', '#FFFF99', '#FFFACD', '#F0E68C',
    '#00FF00', '#00FF7F', '#90EE90', '#98FB98', '#3CB371', '#2E8B57',
    '#00FFFF', '#00CED1', '#40E0D0', '#48D1CC', '#20B2AA',
    '#0000FF', '#4169E1', '#1E90FF', '#87CEEB', '#ADD8E6',
    '#800080', '#9370DB', '#8A2BE2', '#9932CC', '#DA70D6',
    '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB',
    '#8B4513', '#A0522D', '#CD853F', '#DEB887'
  ];

  const shortcuts = [
    { key: 'B', desc: 'Fırça' },
    { key: 'E', desc: 'Silgi' },
    { key: 'I', desc: 'Renk Seçici' },
    { key: 'H', desc: 'Taşı' },
    { key: 'L', desc: 'Çizgi' },
    { key: 'C', desc: 'Daire' },
    { key: 'R', desc: 'Dikdörtgen' },
    { key: 'T', desc: 'Metin' },
    { key: '[', desc: 'Boyut -' },
    { key: ']', desc: 'Boyut +' },
    { key: 'Ctrl+Z', desc: 'Geri Al' },
    { key: 'Ctrl+Y', desc: 'İleri Al' },
    { key: 'Ctrl+S', desc: 'Kaydet' },
    { key: '+/-', desc: 'Zoom' },
    { key: 'G', desc: 'Izgara' },
    { key: 'Delete', desc: 'Temizle' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      else if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      else if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveToFile(); }
      else if (e.key === 'b') handleToolChange('brush');
      else if (e.key === 'e') handleToolChange('eraser');
      else if (e.key === 'i') handleToolChange('eyedropper');
      else if (e.key === 'h') handleToolChange('pan');
      else if (e.key === 't') handleToolChange('text');
      else if (e.key === 'l') handleToolChange('line');
      else if (e.key === 'c') handleToolChange('circle');
      else if (e.key === 'r') handleToolChange('rectangle');
      else if (e.key === '[') setBrushSize(Math.max(1, brushSize - 2));
      else if (e.key === ']') setBrushSize(Math.min(200, brushSize + 2));
      else if (e.key === '+') setZoom(Math.min(10, zoom + 0.25));
      else if (e.key === '-') setZoom(Math.max(0.1, zoom - 0.25));
      else if (e.key === 'g') setShowGrid(!showGrid);
      else if (e.key === 'Delete') { if (confirm('Temizle?')) clearCanvas(); }
    };

    window.addEventListener('keydown', handleKeyDown);

    let autoSaveInterval;
    if (autoSave) {
      autoSaveInterval = setInterval(() => {
        localStorage.setItem('autosave', canvas.toDataURL());
      }, 30000);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    };
  }, [brushSize, zoom, showGrid, autoSave]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - canvasOffset.x) / zoom,
      y: (e.clientY - rect.top - canvasOffset.y) / zoom
    };
  };

  const startDrawing = (e) => {
    if (tool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      return;
    }

    if (tool === 'eyedropper') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const coords = getCanvasCoordinates(e);
      const pixel = ctx.getImageData(coords.x, coords.y, 1, 1).data;
      const hexColor = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
      setColor(hexColor);
      addRecentColor(hexColor);
      setTool('brush');
      return;
    }

    const coords = getCanvasCoordinates(e);

    if (textMode) {
      setTextPosition(coords);
      return;
    }

    if (['circle', 'rectangle', 'line', 'star'].includes(tool)) {
      setStartPos(coords);
      setIsShapeDrawing(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      setTempCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (isPanning && panStart) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    const canvas = canvasRef.current;
    let coords = getCanvasCoordinates(e);

    if (snapToGrid && showGrid) {
      coords.x = Math.round(coords.x / gridSize) * gridSize;
      coords.y = Math.round(coords.y / gridSize) * gridSize;
    }

    const ctx = canvas.getContext('2d');

    if (isShapeDrawing && startPos) {
      ctx.putImageData(tempCanvas, 0, 0);
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = color;

      if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2));
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        if (fillMode) ctx.fill();
        ctx.stroke();
      } else if (tool === 'rectangle') {
        const width = coords.x - startPos.x;
        const height = coords.y - startPos.y;
        ctx.beginPath();
        ctx.rect(startPos.x, startPos.y, width, height);
        if (fillMode) ctx.fill();
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (tool === 'star') {
        const radius = Math.sqrt(Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2));
        const spikes = 5;
        const step = Math.PI / spikes;
        ctx.beginPath();
        for (let i = 0; i < 2 * spikes; i++) {
          const r = i % 2 === 0 ? radius : radius / 2;
          const angle = i * step - Math.PI / 2;
          const x = startPos.x + r * Math.cos(angle);
          const y = startPos.y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        if (fillMode) ctx.fill();
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      return;
    }

    if (!isDrawing) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = brushStyleMode;
    ctx.lineJoin = brushStyleMode;
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = blendMode;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = color;

    if (gradientMode) {
      const gradient = ctx.createLinearGradient(coords.x - brushSize, coords.y - brushSize, coords.x + brushSize, coords.y + brushSize);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, gradientColor2);
      ctx.strokeStyle = tool === 'eraser' ? backgroundColor : gradient;
    } else {
      ctx.strokeStyle = tool === 'eraser' ? backgroundColor : color;
    }

    if (isSprayPaint) {
      for (let i = 0; i < 30; i++) {
        const offsetX = (Math.random() - 0.5) * brushSize;
        const offsetY = (Math.random() - 0.5) * brushSize;
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        if (distance < brushSize / 2) {
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity * (1 - distance / (brushSize / 2)) * 0.5;
          ctx.fillRect(coords.x + offsetX, coords.y + offsetY, 1, 1);
        }
      }
    } else if (symmetryMode) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (let i = 0; i < symmetryLines; i++) {
        const angle = (Math.PI * 2 * i) / symmetryLines;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.translate(-centerX, -centerY);
        const dx = coords.x - centerX;
        const dy = coords.y - centerY;
        ctx.lineTo(centerX + dx, centerY + dy);
        ctx.stroke();
        ctx.restore();
      }
    } else {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
    updateMinimap();
  };

  const stopDrawing = () => {
    if (isDrawing || isShapeDrawing) saveToHistory();
    setIsDrawing(false);
    setIsShapeDrawing(false);
    setStartPos(null);
    setTempCanvas(null);
    setIsPanning(false);
    setPanStart(null);
  };

  const updateMinimap = () => {
    if (!showMinimap || !minimapRef.current) return;
    const miniCanvas = minimapRef.current;
    const miniCtx = miniCanvas.getContext('2d');
    const canvas = canvasRef.current;

    miniCanvas.width = 200;
    miniCanvas.height = 150;
    miniCtx.fillStyle = '#f0f0f0';
    miniCtx.fillRect(0, 0, 200, 150);

    const scale = Math.min(200 / canvas.width, 150 / canvas.height);
    const offsetX = (200 - canvas.width * scale) / 2;
    const offsetY = (150 - canvas.height * scale) / 2;

    miniCtx.drawImage(canvas, offsetX, offsetY, canvas.width * scale, canvas.height * scale);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadImage = (format = 'png') => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `cizim-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  const saveToFile = () => {
    const canvas = canvasRef.current;
    const data = {
      image: canvas.toDataURL(),
      history: history,
      historyStep: historyStep,
      backgroundColor: backgroundColor,
      canvasSize: canvasSize
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `cizim-${Date.now()}.cdp`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const loadFromFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (data.canvasSize) {
          setCanvasSize(data.canvasSize);
          canvas.width = data.canvasSize.width;
          canvas.height = data.canvasSize.height;
        }

        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setHistory(data.history || [data.image]);
          setHistoryStep(data.historyStep || 0);
          setBackgroundColor(data.backgroundColor || '#FFFFFF');
        };
        img.src = data.image;
      } catch (error) {
        alert('Dosya yüklenemedi!');
      }
    };
    reader.readAsText(file);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = history[historyStep - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      setHistoryStep(historyStep - 1);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = history[historyStep + 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      setHistoryStep(historyStep + 1);
    }
  };

  const addText = () => {
    if (!textInput || !textPosition) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = `${brushSize * 4}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    setTextInput('');
    setTextPosition(null);
    setTextMode(false);
    saveToHistory();
  };

  const handleToolChange = (newTool) => {
    setTool(newTool);
    setTextMode(newTool === 'text');
  };

  const addRecentColor = (newColor) => {
    if (!recentColors.includes(newColor)) {
      setRecentColors([newColor, ...recentColors].slice(0, 12));
    }
  };

  const applyBrushPreset = (preset) => {
    setBrushSize(preset.size);
    setOpacity(preset.opacity);
  };

  const resizeCanvas = (newWidth, newHeight) => {
    const canvas = canvasRef.current;
    const tempData = canvas.toDataURL();
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, newWidth, newHeight);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      saveToHistory();
    };
    img.src = tempData;
    setCanvasSize({ width: newWidth, height: newHeight });
    setShowResizeDialog(false);
  };

  const rotateCanvas = (angle) => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(tempCanvas, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();
    saveToHistory();
  };

  const flipCanvas = (horizontal) => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if (horizontal) {
      ctx.scale(-1, 1);
      ctx.drawImage(tempCanvas, -canvas.width, 0);
    } else {
      ctx.scale(1, -1);
      ctx.drawImage(tempCanvas, 0, -canvas.height);
    }
    ctx.restore();
    saveToHistory();
  };

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    ctx.putImageData(imageData, 0, 0);
    saveToHistory();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">

      {/* Üst Menü */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎨 Çizim Tahtası Pro
          </h1>

          <div className="flex gap-2">
            <button onClick={() => { if (confirm('Yeni?')) clearCanvas(); }} className="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm">
              📄 Yeni
            </button>
            <button onClick={() => fileInputRef.current.click()} className="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm flex items-center gap-1">
              <FolderOpen size={16} /> Aç
            </button>
            <input ref={fileInputRef} type="file" accept=".json,.cdp" onChange={loadFromFile} className="hidden" />
            <button onClick={saveToFile} className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-500 text-sm flex items-center gap-1">
              <Save size={16} /> Kaydet
            </button>

            <div className="relative group">
              <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm flex items-center gap-1">
                <Download size={16} /> Export
              </button>
              <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-lg border border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={() => downloadImage('png')} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm whitespace-nowrap">PNG</button>
                <button onClick={() => downloadImage('jpg')} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm whitespace-nowrap">JPG</button>
                <button onClick={() => downloadImage('webp')} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm whitespace-nowrap">WebP</button>
              </div>
            </div>

            <button onClick={() => setShowHistory(!showHistory)} className={`px-3 py-1.5 rounded-lg text-sm ${showHistory ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              ⏱️
            </button>
          </div>

          <div className="flex gap-3">
            <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg">
              {canvasSize.width}×{canvasSize.height}
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg">
              {(zoom * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sol Panel */}
        <div className="w-16 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 gap-2 overflow-y-auto">
          <button onClick={() => handleToolChange('brush')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'brush' ? 'bg-blue-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Paintbrush size={20} />
          </button>
          <button onClick={() => handleToolChange('eraser')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'eraser' ? 'bg-blue-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Eraser size={20} />
          </button>
          <button onClick={() => handleToolChange('eyedropper')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'eyedropper' ? 'bg-blue-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Pipette size={20} />
          </button>
          <button onClick={() => handleToolChange('pan')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'pan' ? 'bg-blue-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Move size={20} />
          </button>

          <div className="w-8 h-px bg-gray-700 my-2"></div>

          <button onClick={() => handleToolChange('line')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'line' ? 'bg-purple-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Minus size={20} />
          </button>
          <button onClick={() => handleToolChange('circle')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'circle' ? 'bg-purple-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Circle size={20} />
          </button>
          <button onClick={() => handleToolChange('rectangle')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'rectangle' ? 'bg-purple-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Square size={20} />
          </button>
          <button onClick={() => handleToolChange('star')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'star' ? 'bg-purple-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Star size={20} />
          </button>
          <button onClick={() => handleToolChange('text')} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${tool === 'text' ? 'bg-purple-500 text-white scale-110' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Type size={20} />
          </button>

          <div className="w-8 h-px bg-gray-700 my-2"></div>

          <button onClick={() => setFillMode(!fillMode)} className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${fillMode ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            <Droplet size={20} />
          </button>

          <div className="w-8 h-px bg-gray-700 my-2"></div>

          <button onClick={undo} disabled={historyStep <= 0} className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30">
            <Undo size={20} />
          </button>
          <button onClick={redo} disabled={historyStep >= history.length - 1} className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30">
            <Redo size={20} />
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col bg-gray-800">

          {/* Araç Çubuğu */}
          <div className="bg-gray-900 border-b border-gray-700 px-4 py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Boyut:</span>
                <input type="range" min="1" max="200" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-32" />
                <span className="text-sm text-gray-300">{brushSize}px</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Opaklık:</span>
                <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-32" />
                <span className="text-sm text-gray-300">{(opacity * 100).toFixed(0)}%</span>
              </div>

              <button onClick={() => setIsSprayPaint(!isSprayPaint)} className={`px-3 py-1.5 rounded-lg text-sm ${isSprayPaint ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                💨 Sprey
              </button>
              <button onClick={() => setSymmetryMode(!symmetryMode)} className={`px-3 py-1.5 rounded-lg text-sm ${symmetryMode ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                🔄 Simetri
              </button>
              <button onClick={() => setGradientMode(!gradientMode)} className={`px-3 py-1.5 rounded-lg text-sm ${gradientMode ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                🌈 Gradyan
              </button>
              <button onClick={() => setShowGrid(!showGrid)} className={`px-3 py-1.5 rounded-lg text-sm ${showGrid ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                <Grid3x3 size={14} className="inline" /> Izgara
              </button>

              <div className="relative group">
                <button className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                  🔄 Dönüştür
                </button>
                <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-lg border border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap">
                  <button onClick={() => rotateCanvas(90)} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm">↻ 90° Sağa</button>
                  <button onClick={() => rotateCanvas(-90)} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm">↺ 90° Sola</button>
                  <button onClick={() => flipCanvas(true)} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm">⇄ Yatay</button>
                  <button onClick={() => flipCanvas(false)} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm">⇅ Dikey</button>
                </div>
              </div>

              <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-1.5 rounded-lg text-sm ${showFilters ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                🎨 Filtre
              </button>

              <div className="ml-auto flex gap-2">
                <button onClick={() => setShowShortcuts(!showShortcuts)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                  ⌨️
                </button>
                <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg ${showSettings ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                  <Settings size={18} />
                </button>
                <button onClick={() => setShowResizeDialog(!showResizeDialog)} className="p-2 rounded-lg bg-gray-800 text-gray-300">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Alan */}
          <div className="flex-1 relative overflow-hidden bg-gray-700">

            {/* Cetveller */}
            {showRulers && (
              <>
                <div className="absolute top-0 left-8 right-0 h-6 bg-gray-800 border-b border-gray-600 z-20 flex items-center overflow-hidden">
                  {Array.from({ length: Math.ceil(canvasSize.width / 50) }).map((_, i) => (
                    <div key={i} className="relative" style={{ width: '50px' }}>
                      <div className="absolute bottom-0 left-0 w-px h-2 bg-gray-500"></div>
                      <span className="absolute bottom-0 left-1 text-xs text-gray-400">{i * 50}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-6 left-0 bottom-0 w-8 bg-gray-800 border-r border-gray-600 z-20 overflow-hidden">
                  {Array.from({ length: Math.ceil(canvasSize.height / 50) }).map((_, i) => (
                    <div key={i} className="relative" style={{ height: '50px' }}>
                      <div className="absolute right-0 top-0 h-px w-2 bg-gray-500"></div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 left-0 w-8 h-6 bg-gray-900 z-20 flex items-center justify-center">
                  <span className="text-xs">📐</span>
                </div>
              </>
            )}

            {/* Canvas Container */}
            <div className="w-full h-full flex items-center justify-center" style={{
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
              transformOrigin: 'center',
              paddingTop: showRulers ? '24px' : '0',
              paddingLeft: showRulers ? '32px' : '0'
            }}>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="bg-white shadow-2xl"
                  style={{ cursor: tool === 'pan' ? 'move' : cursorPreview ? 'none' : 'crosshair' }}
                />

                {/* Özel Fırça İmleci */}
                {cursorPreview && tool !== 'pan' && (
                  <div
                    className="pointer-events-none absolute rounded-full border-2 border-blue-500"
                    style={{
                      width: `${brushSize}px`,
                      height: `${brushSize}px`,
                      transform: 'translate(-50%, -50%)',
                      opacity: 0.5,
                      backgroundColor: tool === 'eraser' ? 'rgba(255,255,255,0.3)' : `${color}30`,
                      boxShadow: `0 0 ${shadowBlur}px ${color}`,
                      position: 'fixed',
                      pointerEvents: 'none',
                      zIndex: 9999
                    }}
                  />
                )}

                {/* Izgara Overlay */}
                {showGrid && (
                  <svg className="absolute inset-0 pointer-events-none" width={canvasSize.width} height={canvasSize.height}>
                    <defs>
                      <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                        <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="rgba(100,100,255,0.2)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                )}
              </div>
            </div>

            {/* Mini Harita - Geliştirilmiş */}
            {showMinimap && (
              <div className="absolute bottom-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-lg border-2 border-gray-600 p-2 shadow-2xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-gray-400">Mini Harita</div>
                  <div className="text-xs text-gray-500">{(zoom * 100).toFixed(0)}%</div>
                </div>
                <canvas ref={minimapRef} width="200" height="150" className="border border-gray-700 rounded" />
              </div>
            )}

            {textPosition && (
              <div className="absolute bg-gray-900 border-2 border-blue-500 rounded-lg p-3 shadow-2xl z-40" style={{ left: textPosition.x * zoom + canvasOffset.x, top: textPosition.y * zoom + canvasOffset.y }}>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addText()}
                  placeholder="Metin girin..."
                  className="border-2 border-gray-700 rounded-lg px-3 py-2 mr-2 bg-gray-800 text-gray-200 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button onClick={addText} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">Ekle</button>
                <button onClick={() => { setTextPosition(null); setTextInput(''); setTextMode(false); }} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all ml-2">İptal</button>
              </div>
            )}

            {/* Bilgi Tooltip'leri */}
            {isSprayPaint && (
              <div className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                💨 Sprey Modu Aktif
              </div>
            )}
            {symmetryMode && (
              <div className="absolute top-4 left-4 bg-pink-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                🔄 Simetri: {symmetryLines} Eksen
              </div>
            )}
            {gradientMode && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                🌈 Gradyan Modu
              </div>
            )}
            {snapToGrid && showGrid && (
              <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                🧲 Izgaraya Yapış
              </div>
            )}
          </div>

          {/* Alt Durum */}
          <div className="bg-gray-900 border-t border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex gap-4">
                <span>{canvasSize.width}×{canvasSize.height}px</span>
                <span>🎨 {tool}</span>
                <span>🖌️ {brushSize}px</span>
              </div>
              <span>⏱️ {historyStep + 1}/{history.length}</span>
            </div>
          </div>
        </div>

        {/* Sağ Panel */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="text-sm font-bold text-gray-200 mb-3">🎨 RENKLER</div>

            <div className="bg-gray-800 p-3 rounded-lg mb-3">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-16 h-16 rounded-lg border-4 border-gray-700 shadow-lg" style={{ backgroundColor: color }}></div>
                <div className="flex-1">
                  <input type="color" value={color} onChange={(e) => { setColor(e.target.value); addRecentColor(e.target.value); }} className="w-full h-10 rounded-lg cursor-pointer mb-1" />
                  <span className="text-xs font-mono text-gray-400 block text-center bg-gray-700 px-2 py-1 rounded">{color.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {recentColors.length > 0 && (
              <div className="mb-3 pb-3 border-b border-gray-700">
                <span className="text-xs text-gray-500 block mb-2">SON KULLANILANLAR</span>
                <div className="flex gap-1 flex-wrap">
                  {recentColors.map((c, idx) => (
                    <button key={idx} onClick={() => setColor(c)} className="w-8 h-8 rounded border-2 border-gray-700 hover:scale-110 hover:border-blue-500 transition-all" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 mb-2">PALET</div>
            <div className="max-h-48 overflow-y-auto pr-2">
              <div className="grid grid-cols-8 gap-1">
                {colors.map((c, i) => (
                  <button key={i} onClick={() => { setColor(c); addRecentColor(c); }} className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${color === c ? 'border-white scale-110 ring-2 ring-blue-400' : 'border-gray-700'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-700 overflow-y-auto flex-1">
            <div className="text-sm font-bold text-gray-200 mb-3">🖌️ FIRÇALAR</div>
            <div className="grid grid-cols-2 gap-2">
              {brushPresets.map((preset, idx) => (
                <button key={idx} onClick={() => applyBrushPreset(preset)} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-sm text-gray-300">
                  {preset.name}
                </button>
              ))}
            </div>

            {showSettings && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer text-sm">
                    <input type="checkbox" checked={cursorPreview} onChange={(e) => setCursorPreview(e.target.checked)} className="w-4 h-4" />
                    👁️ Fırça Önizleme
                  </label>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer text-sm">
                    <input type="checkbox" checked={showMinimap} onChange={(e) => setShowMinimap(e.target.checked)} className="w-4 h-4" />
                    🗺️ Mini Harita
                  </label>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer text-sm">
                    <input type="checkbox" checked={showRulers} onChange={(e) => setShowRulers(e.target.checked)} className="w-4 h-4" />
                    📏 Cetveller
                  </label>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer text-sm">
                    <input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} className="w-4 h-4" />
                    💾 Oto Kayıt (30sn)
                  </label>
                </div>
                {showGrid && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer text-sm">
                      <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} className="w-4 h-4" />
                      🧲 Izgaraya Yapış
                    </label>
                  </div>
                )}
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="text-xs text-gray-400 block mb-2">Gölge Efekti: {shadowBlur}px</label>
                  <input type="range" min="0" max="50" value={shadowBlur} onChange={(e) => setShadowBlur(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="text-xs text-gray-400 block mb-2">Fırça Stili</label>
                  <select value={brushStyleMode} onChange={(e) => setBrushStyleMode(e.target.value)} className="w-full bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm">
                    <option value="round">Yuvarlak</option>
                    <option value="square">Kare</option>
                    <option value="butt">Düz</option>
                  </select>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="text-xs text-gray-400 block mb-2">Karışım Modu</label>
                  <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)} className="w-full bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm">
                    <option value="source-over">Normal</option>
                    <option value="multiply">Çarpma</option>
                    <option value="screen">Ekran</option>
                    <option value="overlay">Kaplama</option>
                    <option value="darken">Koyulaştır</option>
                    <option value="lighten">Açıklaştır</option>
                    <option value="color-dodge">Renk Dodge</option>
                    <option value="color-burn">Renk Burn</option>
                  </select>
                </div>
                {symmetryMode && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <label className="text-xs text-gray-400 block mb-2">Simetri Ekseni: {symmetryLines}</label>
                    <input type="range" min="2" max="24" value={symmetryLines} onChange={(e) => setSymmetryLines(parseInt(e.target.value))} className="w-full" />
                  </div>
                )}
                {gradientMode && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <label className="text-xs text-gray-400 block mb-2">Gradyan Renk 2</label>
                    <div className="flex gap-2">
                      <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
                      <span className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-2 rounded flex items-center">{gradientColor2}</span>
                    </div>
                  </div>
                )}
                {showGrid && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <label className="text-xs text-gray-400 block mb-2">Izgara Boyutu: {gridSize}px</label>
                    <input type="range" min="10" max="200" step="10" value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))} className="w-full" />
                  </div>
                )}
                <div className="p-3 bg-gray-800 rounded-lg">
                  <label className="text-xs text-gray-400 block mb-2">Arka Plan Rengi</label>
                  <div className="flex gap-2">
                    <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
                    <span className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-2 rounded flex items-center">{backgroundColor}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">ZOOM</span>
              <span className="text-sm font-mono text-gray-300">{(zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setZoom(Math.max(0.1, zoom - 0.25))} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
                <ZoomOut size={16} className="mx-auto" />
              </button>
              <button onClick={() => { setZoom(1); setCanvasOffset({ x: 0, y: 0 }); }} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm">
                100%
              </button>
              <button onClick={() => setZoom(Math.min(10, zoom + 0.25))} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
                <ZoomIn size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFilters && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-200">🎨 Filtreler</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Parlaklık</label>
                  <span className="text-sm text-gray-400">{brightness}%</span>
                </div>
                <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Kontrast</label>
                  <span className="text-sm text-gray-400">{contrast}%</span>
                </div>
                <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Doygunluk</label>
                  <span className="text-sm text-gray-400">{saturation}%</span>
                </div>
                <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(parseInt(e.target.value))} className="w-full" />
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={applyFilters} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Uygula</button>
                <button onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }} className="flex-1 bg-gray-700 text-gray-200 py-2 rounded-lg">Sıfırla</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShortcuts && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-200">⌨️ Kısayollar</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {shortcuts.map((sc, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                  <kbd className="bg-gray-700 text-blue-400 px-3 py-1 rounded text-sm font-mono">{sc.key}</kbd>
                  <span className="text-sm text-gray-300">{sc.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-200">⏱️ Geçmiş</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((item, idx) => (
                <button key={idx} onClick={() => { const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); const img = new Image(); img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); setHistoryStep(idx); }; img.src = item; }} className={`w-full p-3 rounded-lg text-left transition-all ${historyStep === idx ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <img src={item} className="w-16 h-12 object-cover rounded border border-gray-700" alt="" />
                    <div className="text-sm">Adım {idx + 1}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResizeDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-200">📐 Canvas Boyutu</h3>
              <button onClick={() => setShowResizeDialog(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Standart Boyutlar</h4>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => resizeCanvas(800, 600)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">800×600</div>
                  <div className="text-xs text-gray-500">SVGA</div>
                </button>
                <button onClick={() => resizeCanvas(1024, 768)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">1024×768</div>
                  <div className="text-xs text-gray-500">XGA</div>
                </button>
                <button onClick={() => resizeCanvas(1920, 1080)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">1920×1080</div>
                  <div className="text-xs text-gray-500">Full HD</div>
                </button>
                <button onClick={() => resizeCanvas(3840, 2160)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">3840×2160</div>
                  <div className="text-xs text-gray-500">4K</div>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Sosyal Medya</h4>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => resizeCanvas(1080, 1080)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">1080×1080</div>
                  <div className="text-xs text-gray-500">Instagram</div>
                </button>
                <button onClick={() => resizeCanvas(1080, 1920)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">1080×1920</div>
                  <div className="text-xs text-gray-500">Story</div>
                </button>
                <button onClick={() => resizeCanvas(1200, 630)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">1200×630</div>
                  <div className="text-xs text-gray-500">Facebook</div>
                </button>
                <button onClick={() => resizeCanvas(1000, 1500)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">1000×1500</div>
                  <div className="text-xs text-gray-500">Pinterest</div>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Baskı (300 DPI)</h4>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => resizeCanvas(2480, 3508)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">2480×3508</div>
                  <div className="text-xs text-gray-500">A4</div>
                </button>
                <button onClick={() => resizeCanvas(3508, 4961)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">3508×4961</div>
                  <div className="text-xs text-gray-500">A3</div>
                </button>
                <button onClick={() => resizeCanvas(2550, 3300)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center">
                  <div className="text-sm text-gray-200">2550×3300</div>
                  <div className="text-xs text-gray-500">Letter</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
