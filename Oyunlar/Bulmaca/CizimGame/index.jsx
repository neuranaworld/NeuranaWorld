import React, { useRef, useState, useEffect } from 'react';
import {
  Paintbrush, Eraser, Trash2, Download, Undo, Redo, Circle, Square, Minus,
  Type, Droplet, Save, FolderOpen, Settings, ZoomIn, ZoomOut, Move, Pipette,
  Star, Grid3x3, Maximize2, ArrowLeft
} from 'lucide-react';

// Modülleri import et
import { CanvasEngine } from './core/CanvasEngine';
import { HistoryManager } from './core/HistoryManager';
import { CoordinateSystem } from './core/CoordinateSystem';
import { DrawingTools } from './tools/DrawingTools';
import { ShapeTools } from './tools/ShapeTools';
import { ExportSystem } from './utils/ExportSystem';
import { FileManager } from './utils/FileManager';
import { KeyboardManager } from './utils/KeyboardManager';
import { BRUSH_PRESETS, COLOR_PALETTE, KEYBOARD_SHORTCUTS, CANVAS_PRESETS, DEFAULT_CANVAS_SIZE } from './utils/Presets';

export default function CizimTahtasi() {
  const canvasRef = useRef(null);
  const minimapRef = useRef(null);
  const fileInputRef = useRef(null);

  // Motorları başlat
  const [engines] = useState(() => ({
    canvas: null,
    history: new HistoryManager(),
    coordinate: null,
    drawing: null,
    shape: null,
    export: null,
    file: null,
    keyboard: new KeyboardManager()
  }));

  // Temel state'ler
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);

  // Çizim state'leri
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShapeDrawing, setIsShapeDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);

  // Özellik state'leri
  const [fillMode, setFillMode] = useState(false);
  const [isSprayPaint, setIsSprayPaint] = useState(false);
  const [symmetryMode, setSymmetryMode] = useState(false);
  const [symmetryLines, setSymmetryLines] = useState(4);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientColor2, setGradientColor2] = useState('#FF0000');
  const [shadowBlur, setShadowBlur] = useState(0);
  const [brushStyleMode, setBrushStyleMode] = useState('round');
  const [blendMode, setBlendMode] = useState('source-over');

  // UI state'leri
  const [showGrid, setShowGrid] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showResizeDialog, setShowResizeDialog] = useState(false);
  const [recentColors, setRecentColors] = useState([]);

  // Filtre state'leri
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Metin state'leri
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState(null);

  // Motorları initialize et
  useEffect(() => {
    if (!canvasRef.current) return;

    engines.canvas = new CanvasEngine(canvasRef, backgroundColor);
    engines.coordinate = new CoordinateSystem(canvasRef);
    engines.drawing = new DrawingTools(canvasRef);
    engines.shape = new ShapeTools(canvasRef);
    engines.export = new ExportSystem(canvasRef);
    engines.file = new FileManager(canvasRef);

    // Canvas'ı başlat
    const canvas = canvasRef.current;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    engines.canvas.clear();
    engines.history.saveState(canvas.toDataURL());

    // Klavye kısayollarını ayarla
    engines.keyboard.setupDefaultShortcuts({
      setTool: handleToolChange,
      adjustBrushSize: (delta) => setBrushSize(prev => Math.max(1, Math.min(200, prev + delta))),
      adjustZoom: (delta) => engines.coordinate?.adjustZoom(delta),
      toggleGrid: () => setShowGrid(prev => !prev),
      clearCanvas: () => { if (confirm('Temizle?')) clearCanvas(); },
      undo,
      redo,
      save: () => engines.file?.saveProject(engines.history.getAllHistory(), { backgroundColor, canvasSize })
    });
    engines.keyboard.start();

    return () => {
      engines.keyboard.stop();
    };
  }, []);

  const handleToolChange = (newTool) => {
    setTool(newTool);
    setTextMode(newTool === 'text');
  };

  const clearCanvas = () => {
    engines.canvas?.clear();
    engines.history.saveState(canvasRef.current.toDataURL());
  };

  const undo = () => {
    const prevState = engines.history.undo();
    if (prevState) loadImageState(prevState);
  };

  const redo = () => {
    const nextState = engines.history.redo();
    if (nextState) loadImageState(nextState);
  };

  const loadImageState = (dataURL) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  };

  const startDrawing = (e) => {
    if (tool === 'pan') {
      setIsPanning(true);
      const state = engines.coordinate.getState();
      setPanStart({ x: e.clientX - state.offset.x, y: e.clientY - state.offset.y });
      return;
    }

    if (tool === 'eyedropper') {
      const coords = engines.coordinate.getCanvasCoordinates(e);
      const pickedColor = engines.canvas.pickColor(coords.x, coords.y);
      if (pickedColor) {
        setColor(pickedColor);
        addRecentColor(pickedColor);
        setTool('brush');
      }
      return;
    }

    const coords = engines.coordinate.getCanvasCoordinates(e);

    if (textMode) {
      setTextPosition(coords);
      return;
    }

    if (['circle', 'rectangle', 'line', 'star'].includes(tool)) {
      setStartPos(coords);
      setIsShapeDrawing(true);
      engines.shape.startShape();
      return;
    }

    engines.drawing.beginPath(coords);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (isPanning && panStart) {
      engines.coordinate.setOffset(e.clientX - panStart.x, e.clientY - panStart.y);
      return;
    }

    const coords = engines.coordinate.getCanvasCoordinates(e);
    const settings = {
      brushSize, opacity, color, backgroundColor, shadowBlur, brushStyle: brushStyleMode,
      blendMode, gradientColor2
    };

    if (isShapeDrawing && startPos) {
      if (tool === 'line') engines.shape.drawLine(startPos, coords, settings);
      else if (tool === 'circle') engines.shape.drawCircle(startPos, coords, settings, fillMode);
      else if (tool === 'rectangle') engines.shape.drawRectangle(startPos, coords, settings, fillMode);
      else if (tool === 'star') engines.shape.drawStar(startPos, coords, settings, fillMode);
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;

    if (isSprayPaint) {
      engines.drawing.drawSpray(coords, settings);
    } else if (symmetryMode) {
      engines.drawing.drawSymmetry(coords, canvas.width / 2, canvas.height / 2, symmetryLines, settings);
    } else if (gradientMode) {
      engines.drawing.drawGradient(coords, settings);
    } else if (tool === 'eraser') {
      engines.drawing.drawEraser(coords, settings);
    } else {
      engines.drawing.drawBrush(coords, settings);
    }
  };

  const stopDrawing = () => {
    if (isDrawing || isShapeDrawing) {
      engines.history.saveState(canvasRef.current.toDataURL());
      engines.drawing.endPath();
      engines.shape.clearTemp();
    }
    setIsDrawing(false);
    setIsShapeDrawing(false);
    setStartPos(null);
    setIsPanning(false);
    setPanStart(null);
  };

  const addRecentColor = (newColor) => {
    if (!recentColors.includes(newColor)) {
      setRecentColors([newColor, ...recentColors].slice(0, 12));
    }
  };

  const applyBrushPreset = (preset) => {
    setBrushSize(preset.size);
    setOpacity(preset.opacity);
    setShadowBlur(preset.blur);
  };

  const addText = () => {
    if (!textInput || !textPosition) return;
    engines.canvas.addText(textInput, textPosition.x, textPosition.y, brushSize * 4, color);
    setTextInput('');
    setTextPosition(null);
    setTextMode(false);
    engines.history.saveState(canvasRef.current.toDataURL());
  };

  const loadFromFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await engines.file.loadProject(file);
      if (data.canvasSize) setCanvasSize(data.canvasSize);
      if (data.backgroundColor) setBackgroundColor(data.backgroundColor);
      await engines.file.loadImageToCanvas(data.image, data.canvasSize);
      if (data.history) engines.history.loadHistory(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const historyInfo = engines.history?.getInfo() || { current: 1, total: 1 };
  const coordinateState = engines.coordinate?.getState() || { zoom: 1, offset: { x: 0, y: 0 } };

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
            <button onClick={() => engines.file?.saveProject(engines.history.getAllHistory(), { backgroundColor, canvasSize })} className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-500 text-sm flex items-center gap-1">
              <Save size={16} /> Kaydet
            </button>

            <div className="relative group">
              <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm flex items-center gap-1">
                <Download size={16} /> Export
              </button>
              <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-lg border border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={() => engines.export?.export('png')} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm whitespace-nowrap">PNG</button>
                <button onClick={() => engines.export?.export('jpg')} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm whitespace-nowrap">JPG</button>
                <button onClick={() => engines.export?.export('webp')} className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-200 text-sm whitespace-nowrap">WebP</button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg">
              {canvasSize.width}×{canvasSize.height}
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg">
              {(coordinateState.zoom * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sol Panel - Araçlar */}
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

          <button onClick={undo} disabled={!historyInfo.canUndo} className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30">
            <Undo size={20} />
          </button>
          <button onClick={redo} disabled={!historyInfo.canRedo} className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30">
            <Redo size={20} />
          </button>
        </div>

        {/* Canvas Alanı */}
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

              <div className="ml-auto flex gap-2">
                <button onClick={() => setShowShortcuts(!showShortcuts)} className="px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                  ⌨️
                </button>
                <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg ${showSettings ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden bg-gray-700">
            <div className="w-full h-full flex items-center justify-center" style={{
              transform: `translate(${coordinateState.offset.x}px, ${coordinateState.offset.y}px) scale(${coordinateState.zoom})`,
              transformOrigin: 'center'
            }}>
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="bg-white shadow-2xl"
                style={{ cursor: tool === 'pan' ? 'move' : 'crosshair' }}
              />
            </div>

            {textPosition && (
              <div className="absolute bg-gray-900 border-2 border-blue-500 rounded-lg p-3 shadow-2xl z-40" style={{ left: textPosition.x, top: textPosition.y }}>
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
          </div>

          {/* Alt Durum */}
          <div className="bg-gray-900 border-t border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex gap-4">
                <span>{canvasSize.width}×{canvasSize.height}px</span>
                <span>🎨 {tool}</span>
                <span>🖌️ {brushSize}px</span>
              </div>
              <span>⏱️ {historyInfo.current}/{historyInfo.total}</span>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Renkler */}
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
                {COLOR_PALETTE.map((c, i) => (
                  <button key={i} onClick={() => { setColor(c); addRecentColor(c); }} className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${color === c ? 'border-white scale-110 ring-2 ring-blue-400' : 'border-gray-700'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-700 overflow-y-auto flex-1">
            <div className="text-sm font-bold text-gray-200 mb-3">🖌️ FIRÇALAR</div>
            <div className="grid grid-cols-2 gap-2">
              {BRUSH_PRESETS.map((preset, idx) => (
                <button key={idx} onClick={() => applyBrushPreset(preset)} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-sm text-gray-300">
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">ZOOM</span>
              <span className="text-sm font-mono text-gray-300">{(coordinateState.zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => engines.coordinate?.adjustZoom(-0.25)} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
                <ZoomOut size={16} className="mx-auto" />
              </button>
              <button onClick={() => engines.coordinate?.resetZoom()} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm">
                100%
              </button>
              <button onClick={() => engines.coordinate?.adjustZoom(0.25)} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
                <ZoomIn size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kısayollar Modal */}
      {showShortcuts && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-200">⌨️ Kısayollar</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {KEYBOARD_SHORTCUTS.map((sc, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                  <kbd className="bg-gray-700 text-blue-400 px-3 py-1 rounded text-sm font-mono">{sc.key}</kbd>
                  <span className="text-sm text-gray-300">{sc.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
