import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MindMap() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([
    { id: 1, text: 'Ana Konu', x: 400, y: 300, level: 0, parent: null, color: '#667eea' }
  ]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newNodeText, setNewNodeText] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const colors = ['#667eea', '#4CAF50', '#FF9800', '#f44336', '#2196F3', '#9C27B0'];

  useEffect(() => {
    drawMindMap();
  }, [nodes, zoom, pan]);

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

    // Bağlantıları çiz
    nodes.forEach(node => {
      if (node.parent !== null) {
        const parent = nodes.find(n => n.id === node.parent);
        if (parent) {
          ctx.beginPath();
          ctx.moveTo(parent.x, parent.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    });

    // Node'ları çiz
    nodes.forEach(node => {
      const radius = 60 - (node.level * 10);
      
      // Dış halka
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = selectedNode === node.id ? '#FFD700' : '#fff';
      ctx.lineWidth = selectedNode === node.id ? 4 : 2;
      ctx.stroke();

      // Text
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${16 - node.level * 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const words = node.text.split(' ');
      const lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > radius * 1.5 && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      lines.forEach((line, i) => {
        ctx.fillText(line, node.x, node.y - (lines.length - 1) * 8 + i * 16);
      });
    });

    ctx.restore();
  };

  const addNode = () => {
    if (!newNodeText.trim() || selectedNode === null) return;

    const parent = nodes.find(n => n.id === selectedNode);
    const angle = Math.random() * Math.PI * 2;
    const distance = 150;

    const newNode = {
      id: Date.now(),
      text: newNodeText,
      x: parent.x + Math.cos(angle) * distance,
      y: parent.y + Math.sin(angle) * distance,
      level: parent.level + 1,
      parent: selectedNode,
      color: colors[(parent.level + 1) % colors.length]
    };

    setNodes([...nodes, newNode]);
    setNewNodeText('');
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    let clicked = null;
    nodes.forEach(node => {
      const radius = 60 - (node.level * 10);
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance < radius) {
        clicked = node.id;
      }
    });

    setSelectedNode(clicked);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e) => {
    if (e.button === 0 && e.shiftKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const deleteNode = () => {
    if (selectedNode === null || selectedNode === 1) return;
    
    const deleteRecursive = (nodeId) => {
      const children = nodes.filter(n => n.parent === nodeId);
      children.forEach(child => deleteRecursive(child.id));
      setNodes(prev => prev.filter(n => n.id !== nodeId));
    };
    
    deleteRecursive(selectedNode);
    setSelectedNode(null);
  };

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">← Ana Menü</button>
      
      <div className="header-gradient">
        <h1 className="title">🗺️ Zihin Haritası</h1>
        <p className="subtitle">3D yakınlaştırmalı interaktif harita</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNode()}
            placeholder="Yeni düğüm metni..."
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
          <button
            onClick={addNode}
            disabled={!newNodeText.trim() || selectedNode === null}
            style={{
              padding: '12px 24px',
              background: selectedNode === null ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: selectedNode === null ? 'not-allowed' : 'pointer'
            }}
          >
            ➕ Ekle
          </button>
          <button
            onClick={deleteNode}
            disabled={selectedNode === null || selectedNode === 1}
            style={{
              padding: '12px 24px',
              background: (selectedNode === null || selectedNode === 1) ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: (selectedNode === null || selectedNode === 1) ? 'not-allowed' : 'pointer'
            }}
          >
            🗑️ Sil
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => setZoom(prev => Math.max(0.3, prev - 0.1))} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔍-</button>
          <button onClick={() => setZoom(1)} style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🎯 Sıfırla</button>
          <button onClick={() => setZoom(prev => Math.min(3, prev + 0.1))} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔍+</button>
          <span style={{ padding: '8px 16px', background: '#f0f0f0', borderRadius: '6px', fontWeight: 'bold' }}>Zoom: {(zoom * 100).toFixed(0)}%</span>
        </div>

        <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
          💡 Bir düğüme tıklayarak seçin, alt düğüm ekleyin. Shift + Sürükle ile kaydırın. Mouse tekerleği ile yakınlaştırın.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          maxWidth: '1000px',
          border: '3px solid #667eea',
          borderRadius: '12px',
          cursor: isDragging ? 'grabbing' : 'pointer',
          background: '#f8f9fa'
        }}
      />

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>💡 Nasıl Kullanılır?</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li>🖱️ Bir düğüme tıklayarak seçin (altın renk çerçeve)</li>
          <li>➕ Seçili düğüme alt düğüm ekleyin</li>
          <li>🗑️ Seçili düğümü ve tüm alt düğümlerini silin</li>
          <li>🔍 Mouse tekerleği ile yakınlaştırın/uzaklaştırın</li>
          <li>↔️ Shift basılı tutup sürükleyerek haritayı kaydırın</li>
          <li>🎯 Sıfırla butonu ile zoom ve konumu sıfırlayın</li>
        </ul>
      </div>
    </div>
  );
}
