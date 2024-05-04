import { RowClearedEvent } from "./const.mjs";

export class ScoringSystem {
  score;

  constructor(eventBus) {
    this.score = 0;
    this.eventBus = eventBus;

    this.eventBus.on(RowClearedEvent, () => {
      this.score += 40;
    });
  }

  currentScore() {
    return this.score;
  }
}
