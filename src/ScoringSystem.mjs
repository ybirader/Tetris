import { RowClearedEvent } from "./const.mjs";

export class ScoringSystem {
  score;

  constructor(eventBus) {
    this.score = 0;
    this.eventBus = eventBus;

    this.eventBus.on(RowClearedEvent, this._handleRowCleared.bind(this));
  }

  currentScore() {
    return this.score;
  }

  _handleRowCleared(rowsCleared) {
    if (rowsCleared === 4) {
      this.score += 1200;
    } else if (rowsCleared === 3) {
      this.score += 300;
    } else if (rowsCleared === 2) {
      this.score += 100;
    } else {
      this.score += 40;
    }
  }
}
