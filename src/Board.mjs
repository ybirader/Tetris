const SENTINEL_MARKER = "."

function createEmptyGrid(width, height, sentinelMarker) {
  const result = [];

  for (let i = 0; i < height; i++) {
    const row = Array(width).fill(sentinelMarker);
    result.push(row);
  }

  return result;
}

class MovingPiece {
  piece;
  position;

  constructor(piece, initialRow, initialCol) {
    this.piece = piece;
    this.position = { row: initialRow, col: initialCol };
  }

  get row() {
    return this.position.row;
  }

  get col() {
    return this.position.col;
  }

  get dimension() {
    return this.piece.dimension;
  }

  get marker() {
    return this.piece.marker;
  }

  blockAt(gridRow, gridCol) {
    if (
      gridRow >= this.row &&
      gridCol >= this.col &&
      gridRow < this.row + this.dimension &&
      gridCol < this.col + this.dimension
    ) {
      return this.piece.blockAt(gridRow - this.row, gridCol - this.col);
    }

    return SENTINEL_MARKER;
  }

  moveDown() {
    this.position.row += 1;
  }

  moveUp() {
    this.position.row -= 1;
  }
}

class Block {
  piece;
  dimension = 1;

  constructor(piece) {
    this.piece = piece;
  }

  blockAt(gridRow, gridCol) {
    return this.piece;
  }
}

function createMovingPiece(piece, width) {
  if (typeof piece === "string") {
    piece = new Block(piece);
  }

  return new MovingPiece(piece, 0, Math.floor((width - piece.dimension) / 2));
}

export class Board {
  grid;
  movingPiece;

  constructor(width, height) {
    this.grid = createEmptyGrid(width, height, SENTINEL_MARKER);
  }

  get width() {
    return this.grid[0].length;
  }

  get height() {
    return this.grid.length;
  }

  drop(piece) {
    if (this.hasFalling()) {
      throw new Error("already falling");
    }

    this.movingPiece = createMovingPiece(piece, this.width);
  }

  tick() {
    if (!this.hasFalling()) {
      return;
    }

    this._movePiece();
    if (this._invalidMove()) {
      this._undoMove();
      this._stopFalling();
    }
  }

  hasFalling() {
    return this.movingPiece !== undefined && this.movingPiece !== undefined;
  }

  toString() {
    let result = "";

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        result += this._blockAt(row, col);
      }
      result += "\n";
    }

    return result;
  }

  _movePiece() {
    this.movingPiece.moveDown();
  }

  _blockAt(row, col) {
    if (this.hasFalling()) {
      const block = this.movingPiece.blockAt(row, col);
      if (block !== SENTINEL_MARKER) {
        return block;
      }
    }

    return this.grid[row][col];
  }

  _invalidMove() {
    for (let row = this.movingPiece.row; row < this.movingPiece.row + this.movingPiece.dimension; row++) {
      for (let col = this.movingPiece.col; col < this.movingPiece.col + this.movingPiece.dimension; col++) {
        if (this._outOfBounds(row, col) || this._hasCollided(row, col)) {
          return true;
        }
      }
    }

    return false;
  }

  _outOfBounds(row, col) {
    return this.movingPiece.blockAt(row, col) !== SENTINEL_MARKER && row >= this.height;
  }

  _hasCollided(row, col) {
    return this.movingPiece.blockAt(row, col) !== SENTINEL_MARKER && this.grid[row][col] !== SENTINEL_MARKER;
  }

  _undoMove() {
    this.movingPiece.moveUp();
  }

  _stopFalling() {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.grid[row][col] = this._blockAt(row, col);
      }
    }

    this.movingPiece = undefined;
  }
}
