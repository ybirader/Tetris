export class Block {
  piece;
  dimension = 1;

  constructor(piece) {
    this.piece = piece;
  }

  blockAt(gridRow, gridCol) {
    return this.piece;
  }
}
