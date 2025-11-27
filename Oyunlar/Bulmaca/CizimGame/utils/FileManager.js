/**
 * Dosya Yöneticisi
 * Save/Load işlemleri (.cdp formatı)
 */

export class FileManager {
  constructor(canvasRef) {
    this.canvasRef = canvasRef;
  }

  // Projeyi kaydet (.cdp formatı)
  saveProject(historyData, settings) {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const data = {
      image: canvas.toDataURL(),
      history: historyData.history,
      historyStep: historyData.historyStep,
      backgroundColor: settings.backgroundColor,
      canvasSize: settings.canvasSize,
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `cizim-${Date.now()}.cdp`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  // Projeyi yükle (.cdp formatı)
  async loadProject(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Dosya yüklenemedi! Geçersiz format.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Dosya okunamadı!'));
      };

      reader.readAsText(file);
    });
  }

  // Canvas'a resim yükle
  loadImageToCanvas(imageDataURL, canvasSize = null) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx) return Promise.reject('Canvas bulunamadı');

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // Canvas boyutunu ayarla
        if (canvasSize) {
          canvas.width = canvasSize.width;
          canvas.height = canvasSize.height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve();
      };

      img.onerror = () => {
        reject(new Error('Resim yüklenemedi!'));
      };

      img.src = imageDataURL;
    });
  }

  // Otomatik kaydetme (localStorage)
  autoSave() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    try {
      localStorage.setItem('autosave', canvas.toDataURL());
      localStorage.setItem('autosave-time', Date.now().toString());
    } catch (error) {
      console.warn('Otomatik kayıt başarısız:', error);
    }
  }

  // Otomatik kaydı geri yükle
  loadAutoSave() {
    try {
      const savedImage = localStorage.getItem('autosave');
      const savedTime = localStorage.getItem('autosave-time');

      if (savedImage && savedTime) {
        const timeDiff = Date.now() - parseInt(savedTime);
        // Son 24 saat içinde kaydedilmişse yükle
        if (timeDiff < 24 * 60 * 60 * 1000) {
          return savedImage;
        }
      }
    } catch (error) {
      console.warn('Otomatik kayıt yüklenemedi:', error);
    }

    return null;
  }
}
