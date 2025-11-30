/**
 * Geçmiş Yöneticisi
 * Undo/Redo işlemleri için history stack yönetimi
 */

export class HistoryManager {
  constructor() {
    this.history = [];
    this.historyStep = -1;
  }

  // Geçmişe yeni durum ekle
  saveState(dataURL) {
    const newHistory = this.history.slice(0, this.historyStep + 1);
    newHistory.push(dataURL);
    this.history = newHistory;
    this.historyStep = newHistory.length - 1;
  }

  // Geri al
  undo() {
    if (this.historyStep > 0) {
      this.historyStep--;
      return this.history[this.historyStep];
    }
    return null;
  }

  // İleri al
  redo() {
    if (this.historyStep < this.history.length - 1) {
      this.historyStep++;
      return this.history[this.historyStep];
    }
    return null;
  }

  // Geçmişi temizle
  clear() {
    this.history = [];
    this.historyStep = -1;
  }

  // Belirli bir adıma git
  goToStep(step) {
    if (step >= 0 && step < this.history.length) {
      this.historyStep = step;
      return this.history[step];
    }
    return null;
  }

  // Durum bilgisi
  canUndo() {
    return this.historyStep > 0;
  }

  canRedo() {
    return this.historyStep < this.history.length - 1;
  }

  getInfo() {
    return {
      current: this.historyStep + 1,
      total: this.history.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }

  // Tüm geçmişi al (save için)
  getAllHistory() {
    return {
      history: this.history,
      historyStep: this.historyStep
    };
  }

  // Geçmişi yükle (load için)
  loadHistory(data) {
    this.history = data.history || [];
    this.historyStep = data.historyStep || 0;
  }
}
