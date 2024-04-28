import { Tetromino } from "./Tetromino.mjs";

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

  moveDown() {
    this.position.row += 1;
  }

  hasMarker(row, col) {
    return this.piece.hasMarker(row, col);
  }
}

class Block {
  piece;
  dimension = 1;
  marker;

  constructor(piece) {
    this.piece = piece;
    this.marker = piece;
  }

  hasMarker(row, col) {
    return true;
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
  currentCoordinate;
  movingPiece;
  newMovingPiece;

  SENTINEL_MARKER = ".";

  constructor(width, height) {
    this.grid = createEmptyGrid(width, height, this.SENTINEL_MARKER);
  }

  get width() {
    return this.grid[0].length;
  }

  get height() {
    return this.grid.length;
  }

  tick() {
    if (this._hasFallen()) {
      this.movingPiece = undefined;
      return;
    }

    this._movePiece();
  }

  drop(piece) {
    if (this.hasFalling()) {
      throw new Error("already falling");
    }

    this.movingPiece = piece;
    this.newMovingPiece = createMovingPiece(piece, this.width);

    this._addPiece();
  }

  hasFalling() {
    return this.movingPiece !== undefined && this.newMovingPiece !== undefined;
  }

  toString() {
    return this.grid.map((row) => `${row.join("")}\n`).join("");
  }

  _hasFallen() {
    if (!(this.movingPiece instanceof Tetromino)) {
      return (
        this.newMovingPiece.row + 1 >= this.height ||
        this.grid[this.newMovingPiece.row + 1][this.newMovingPiece.col] != this.SENTINEL_MARKER
      );
    }

    return this.newMovingPiece.row + this.newMovingPiece.dimension > this.height || this._hasTetrominoBelow();
  }

  _movePiece() {
    this._removeExistingPiece();
    this.newMovingPiece.moveDown();
    this._addPiece();
  }

  _removeExistingPiece() {
    for (let row = 0; row < this.newMovingPiece.dimension; row++) {
      for (let col = 0; col < this.newMovingPiece.dimension; col++) {
        this.grid[row + this.newMovingPiece.row][col + this.newMovingPiece.col] = this.SENTINEL_MARKER;
      }
    }
  }

  _addPiece() {
    for (let row = 0; row < this.newMovingPiece.dimension; row++) {
      for (let col = 0; col < this.newMovingPiece.dimension; col++) {
        if (this.newMovingPiece.hasMarker(row, col)) {
          this.grid[row + this.newMovingPiece.row][col + this.newMovingPiece.col] = this.newMovingPiece.marker;
        }
      }
    }
  }

  _hasTetrominoBelow() {
    let lastRow = this.newMovingPiece.row + this.newMovingPiece.dimension - 1;
    let startColumn = this.newMovingPiece.col;
    let endColumn = this.newMovingPiece.col + this.newMovingPiece.dimension;

    for (let col = startColumn; col < endColumn; col++) {
      if (this.grid[lastRow][col] !== this.SENTINEL_MARKER) {
        return true;
      }
    }

    return false;
  }
}
