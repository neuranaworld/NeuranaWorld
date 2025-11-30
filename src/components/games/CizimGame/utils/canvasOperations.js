// Canvas İşlemleri
export function clearCanvas(canvas, backgroundColor = '#FFFFFF') {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function saveCanvasState(canvas) {
  return canvas.toDataURL();
}

export function loadCanvasState(canvas, dataURL) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.src = dataURL;
  });
}

export function downloadCanvas(canvas, filename = 'cizim.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

export function getCanvasPoint(canvas, clientX, clientY, zoom, offset) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - offset.x) / zoom,
    y: (clientY - rect.top - offset.y) / zoom
  };
}

export function drawLine(ctx, from, to, color, size, opacity, blur) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.globalAlpha = opacity;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

export function drawCircle(ctx, center, radius, color, size, fill, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;

  if (fill) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawRectangle(ctx, start, end, color, size, fill, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const width = end.x - start.x;
  const height = end.y - start.y;

  if (fill) {
    ctx.fillStyle = color;
    ctx.fillRect(start.x, start.y, width, height);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.strokeRect(start.x, start.y, width, height);
  }
  ctx.restore();
}

export function floodFill(ctx, startX, startY, fillColor) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const pixels = imageData.data;
  const startPos = (Math.floor(startY) * ctx.canvas.width + Math.floor(startX)) * 4;
  const startR = pixels[startPos];
  const startG = pixels[startPos + 1];
  const startB = pixels[startPos + 2];

  const fillRGB = hexToRgb(fillColor);

  if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b) {
    return;
  }

  const stack = [[Math.floor(startX), Math.floor(startY)]];

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    const pos = (y * ctx.canvas.width + x) * 4;

    if (x < 0 || x >= ctx.canvas.width || y < 0 || y >= ctx.canvas.height) continue;
    if (pixels[pos] !== startR || pixels[pos + 1] !== startG || pixels[pos + 2] !== startB) continue;

    pixels[pos] = fillRGB.r;
    pixels[pos + 1] = fillRGB.g;
    pixels[pos + 2] = fillRGB.b;
    pixels[pos + 3] = 255;

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function applyFilters(ctx, brightness, contrast, saturation) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  const brightnessFactor = brightness / 100;
  const contrastFactor = (contrast / 100) * 2;
  const saturationFactor = saturation / 100;

  for (let i = 0; i < data.length; i += 4) {
    // Brightness
    data[i] *= brightnessFactor;
    data[i + 1] *= brightnessFactor;
    data[i + 2] *= brightnessFactor;

    // Contrast
    data[i] = ((data[i] / 255 - 0.5) * contrastFactor + 0.5) * 255;
    data[i + 1] = ((data[i + 1] / 255 - 0.5) * contrastFactor + 0.5) * 255;
    data[i + 2] = ((data[i + 2] / 255 - 0.5) * contrastFactor + 0.5) * 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
