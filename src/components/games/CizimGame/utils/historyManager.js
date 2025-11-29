// History (Undo/Redo) Yönetimi
export class HistoryManager {
  constructor(maxSteps = 50) {
    this.history = [];
    this.currentStep = -1;
    this.maxSteps = maxSteps;
  }

  addState(state) {
    // Remove any states after current step
    this.history = this.history.slice(0, this.currentStep + 1);

    // Add new state
    this.history.push(state);

    // Limit history size
    if (this.history.length > this.maxSteps) {
      this.history.shift();
    } else {
      this.currentStep++;
    }
  }

  canUndo() {
    return this.currentStep > 0;
  }

  canRedo() {
    return this.currentStep < this.history.length - 1;
  }

  undo() {
    if (this.canUndo()) {
      this.currentStep--;
      return this.history[this.currentStep];
    }
    return null;
  }

  redo() {
    if (this.canRedo()) {
      this.currentStep++;
      return this.history[this.currentStep];
    }
    return null;
  }

  getCurrentState() {
    return this.history[this.currentStep];
  }

  clear() {
    this.history = [];
    this.currentStep = -1;
  }
}
