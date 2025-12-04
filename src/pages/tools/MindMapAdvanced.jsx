import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MindMapAdvanced() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([
    { 
      id: 1, 
      text: 'Ana Konu', 
      x: 500, 
      y: 300, 
      level: 0, 
      parent: null, 
      color: '#667eea',
      collapsed: false,
      notes: '',
      tags: [],
      priority: 'normal'
    }
  ]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [newNodeText, setNewNodeText] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('tree'); // tree, radial, mindmap
  const [autoLayout, setAutoLayout] = useState(true);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const colors = [
    { name: 'Mor', value: '#667eea' },
    { name: 'Yeşil', value: '#4CAF50' },
    { name: 'Turuncu', value: '#FF9800' },
    { name: 'Kırmızı', value: '#f44336' },
    { name: 'Mavi', value: '#2196F3' },
    { name: 'Pembe', value: '#E91E63' },
    { name: 'Turkuaz', value: '#00BCD4' },
    { name: 'Sarı', value: '#FFC107' }
  ];

  const priorities = {
    high: { color: '#f44336', label: 'Yüksek' },
    normal: { color: '#4CAF50', label: 'Normal' },
    low: { color: '#9E9E9E', label: 'Düşük' }
  };

  useEffect(() => {
    drawMindMap();
  }, [nodes, zoom, pan, viewMode]);

  useEffect(() => {
    // Auto-save to localStorage
    const timer = setTimeout(() => {
      localStorage.setItem('mindmap_data', JSON.stringify({
        nodes,
        zoom,
        pan,
        viewMode
      }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [nodes, zoom, pan, viewMode]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('mindmap_data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.nodes && data.nodes.length > 0) {
        setNodes(data.nodes);
        setZoom(data.zoom || 1);
        setPan(data.pan || { x: 0, y: 0 });
        setViewMode(data.viewMode || 'tree');
      }
    }
  }, []);

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(nodes));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNodes(JSON.parse(history[historyIndex - 1]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNodes(JSON.parse(history[historyIndex + 1]));
    }
  };

  const calculateNodePosition = (parentNode, childIndex, totalChildren) => {
    if (viewMode === 'radial') {
      const angleStep = (2 * Math.PI) / totalChildren;
      const angle = angleStep * childIndex;
      const distance = 200;
      return {
        x: parentNode.x + Math.cos(angle) * distance,
        y: parentNode.y + Math.sin(angle) * distance
      };
    } else if (viewMode === 'mindmap') {
      const side = childIndex % 2 === 0 ? 1 : -1;
      const yOffset = Math.floor(childIndex / 2) * 100 - (totalChildren * 25);
      return {
        x: parentNode.x + side * 250,
        y: parentNode.y + yOffset
      };
    } else {
      // Tree layout
      const yOffset = childIndex * 120 - (totalChildren * 60);
      return {
        x: parentNode.x + 300,
        y: parentNode.y + yOffset
      };
    }
  };

  const drawMindMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw connections
    nodes.forEach(node => {
      if (node.parent !== null && !node.collapsed) {
        const parent = nodes.find(n => n.id === node.parent);
        if (parent && !parent.collapsed) {
          ctx.beginPath();
          ctx.moveTo(parent.x, parent.y);
          
          // Bezier curve for smoother connections
          const midX = (parent.x + node.x) / 2;
          ctx.quadraticCurveTo(midX, parent.y, node.x, node.y);
          
          ctx.strokeStyle = node.color;
          ctx.lineWidth = selectedNode === node.id ? 4 : 3;
          ctx.stroke();

          // Draw arrow
          const angle = Math.atan2(node.y - parent.y, node.x - parent.x);
          const arrowSize = 10;
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(
            node.x - arrowSize * Math.cos(angle - Math.PI / 6),
            node.y - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            node.x - arrowSize * Math.cos(angle + Math.PI / 6),
            node.y - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      if (node.parent !== null) {
        const parent = nodes.find(n => n.id === node.parent);
        if (parent && parent.collapsed) return;
      }

      const radius = node.level === 0 ? 70 : 60 - (node.level * 5);
      
      // Priority ring
      if (node.priority === 'high') {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = priorities.high.color;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      // Gradient
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, node.color + 'cc');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.strokeStyle = selectedNode === node.id ? '#FFD700' : '#fff';
      ctx.lineWidth = selectedNode === node.id ? 5 : 3;
      ctx.stroke();

      // Collapse indicator
      if (nodes.some(n => n.parent === node.id)) {
        const indicatorX = node.x + radius - 15;
        const indicatorY = node.y + radius - 15;
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = node.collapsed ? '#FF9800' : '#4CAF50';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.collapsed ? '+' : '-', indicatorX, indicatorY);
      }

      // Text
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${18 - node.level * 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const words = node.text.split(' ');
      const lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > radius * 1.6 && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      lines.forEach((line, i) => {
        ctx.fillText(line, node.x, node.y - (lines.length - 1) * 10 + i * 20);
      });

      // Tags
      if (node.tags && node.tags.length > 0) {
        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText(`#${node.tags[0]}`, node.x, node.y + radius - 10);
      }
    });

    ctx.restore();
  };

  const addNode = () => {
    if (!newNodeText.trim() || selectedNode === null) return;

    saveToHistory();
    const parent = nodes.find(n => n.id === selectedNode);
    const siblings = nodes.filter(n => n.parent === selectedNode);
    const position = calculateNodePosition(parent, siblings.length, siblings.length + 1);

    const newNode = {
      id: Date.now(),
      text: newNodeText,
      x: position.x,
      y: position.y,
      level: parent.level + 1,
      parent: selectedNode,
      color: colors[Math.floor(Math.random() * colors.length)].value,
      collapsed: false,
      notes: '',
      tags: [],
      priority: 'normal'
    };

    setNodes([...nodes, newNode]);
    setNewNodeText('');
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    let clickedNode = null;
    nodes.forEach(node => {
      if (node.parent !== null) {
        const parent = nodes.find(n => n.id === node.parent);
        if (parent && parent.collapsed) return;
      }

      const radius = node.level === 0 ? 70 : 60 - (node.level * 5);
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      
      if (distance < radius) {
        clickedNode = node;
      }
    });

    if (clickedNode) {
      if (e.shiftKey) {
        setDraggingNode(clickedNode.id);
      } else {
        setSelectedNode(clickedNode.id);
      }
    } else if (e.shiftKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (draggingNode) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      setNodes(prev => prev.map(n => 
        n.id === draggingNode ? { ...n, x, y } : n
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggingNode(null);
  };

  const handleCanvasDoubleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    nodes.forEach(node => {
      const radius = node.level === 0 ? 70 : 60 - (node.level * 5);
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      
      if (distance < radius) {
        setEditingNode(node);
        setShowNodeEditor(true);
      }
    });
  };

  const toggleCollapse = () => {
    if (selectedNode === null) return;
    saveToHistory();
    setNodes(prev => prev.map(n => 
      n.id === selectedNode ? { ...n, collapsed: !n.collapsed } : n
    ));
  };

  const deleteNode = () => {
    if (selectedNode === null || selectedNode === 1) return;
    saveToHistory();
    
    const deleteRecursive = (nodeId) => {
      const children = nodes.filter(n => n.parent === nodeId);
      children.forEach(child => deleteRecursive(child.id));
      setNodes(prev => prev.filter(n => n.id !== nodeId));
    };
    
    deleteRecursive(selectedNode);
    setSelectedNode(null);
  };

  const exportData = () => {
    const data = JSON.stringify({ nodes, viewMode }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap_${Date.now()}.json`;
    a.click();
  };

  const searchNodes = () => {
    if (!searchQuery) return;
    const found = nodes.find(n => n.text.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setSelectedNode(found.id);
      // Center on found node
      setPan({
        x: 500 - found.x * zoom,
        y: 300 - found.y * zoom
      });
    }
  };

  const filteredNodes = searchQuery 
    ? nodes.filter(n => n.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : nodes;

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">&larr; Ana Menu</button>
      
      <div className="header-gradient">
        <h1 className="title">Mind Map Pro</h1>
        <p className="subtitle">Gelismis 3D zihin haritasi - Tam ozellıklı</p>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNode()}
            placeholder="Yeni dugum..."
            disabled={selectedNode === null}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button onClick={addNode} disabled={!newNodeText.trim() || selectedNode === null} style={{ padding: '12px 24px', background: selectedNode === null ? '#ccc' : '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: selectedNode === null ? 'not-allowed' : 'pointer' }}>+ Ekle</button>
          <button onClick={toggleCollapse} disabled={selectedNode === null} style={{ padding: '12px 24px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Kapat/Ac</button>
          <button onClick={deleteNode} disabled={selectedNode === null || selectedNode === 1} style={{ padding: '12px 24px', background: (selectedNode === null || selectedNode === 1) ? '#ccc' : '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (selectedNode === null || selectedNode === 1) ? 'not-allowed' : 'pointer' }}>Sil</button>
          <button onClick={undo} disabled={historyIndex <= 0} style={{ padding: '12px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Geri</button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} style={{ padding: '12px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Ileri</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchNodes()}
            placeholder="Ara..."
            style={{ padding: '8px 12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          />
          <button onClick={searchNodes} style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ara</button>
          
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} style={{ padding: '8px 12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px' }}>
            <option value="tree">Agac</option>
            <option value="radial">Dairesel</option>
            <option value="mindmap">Zihin Haritasi</option>
          </select>
          
          <button onClick={() => setZoom(prev => Math.max(0.3, prev - 0.1))} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>-</button>
          <span style={{ fontWeight: 'bold' }}>{(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(prev => Math.min(3, prev + 0.1))} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Sifirla</button>
          <button onClick={exportData} style={{ padding: '8px 16px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Export</button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={1200}
        height={700}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onDoubleClick={handleCanvasDoubleClick}
        style={{
          width: '100%',
          maxWidth: '1200px',
          border: '3px solid #667eea',
          borderRadius: '12px',
          cursor: isDragging ? 'grabbing' : draggingNode ? 'move' : 'pointer',
          background: '#f8f9fa'
        }}
      />

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Klavye Kisayollari & Ipuclari</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px', columns: 2, columnGap: '40px' }}>
          <li><strong>Tikla:</strong> Dugum sec</li>
          <li><strong>Cift tikla:</strong> Duzenle</li>
          <li><strong>Shift + Tikla:</strong> Dugumu tasi</li>
          <li><strong>Shift + Surukle:</strong> Haritayi kaydir</li>
          <li><strong>Mouse tekerlek:</strong> Zoom</li>
          <li><strong>Enter:</strong> Dugum ekle</li>
          <li><strong>Agac modu:</strong> Hiyerarşik yapi</li>
          <li><strong>Dairesel:</strong> Merkez odakli</li>
          <li><strong>Zihin Haritasi:</strong> Iki yonlu dal</li>
          <li><strong>Kapat/Ac:</strong> Alt dalları gizle</li>
          <li><strong>Ara:</strong> Dugum bul</li>
          <li><strong>Export:</strong> JSON olarak kaydet</li>
        </ul>
      </div>

      {/* Node Editor Modal */}
      {showNodeEditor && editingNode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }} onClick={() => setShowNodeEditor(false)}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px' }}>Dugumu Duzenle</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Metin</label>
              <input
                type="text"
                value={editingNode.text}
                onChange={(e) => setEditingNode({ ...editingNode, text: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Renk</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {colors.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setEditingNode({ ...editingNode, color: c.value })}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: c.value,
                      border: editingNode.color === c.value ? '3px solid #000' : '2px solid #ddd',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Oncelik</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {Object.entries(priorities).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setEditingNode({ ...editingNode, priority: key })}
                    style={{
                      padding: '10px 20px',
                      background: editingNode.priority === key ? p.color : '#f5f5f5',
                      color: editingNode.priority === key ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  saveToHistory();
                  setNodes(prev => prev.map(n => n.id === editingNode.id ? editingNode : n));
                  setShowNodeEditor(false);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Kaydet
              </button>
              <button
                onClick={() => setShowNodeEditor(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Iptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
