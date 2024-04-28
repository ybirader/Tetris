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
}

export class Board {
  grid;
  currentCoordinate;
  movingPiece;

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

    this._moveTetromino();
  }

  drop(piece) {
    if (this.hasFalling()) {
      throw new Error("already falling");
    }

    this.movingPiece = piece;
    let initialRow = 0;
    let initialCol = Math.floor(this.width / 2);
    this.currentCoordinate = { row: initialRow, col: initialCol };

    if (!(piece instanceof Tetromino)) {
      this.grid[initialRow][initialCol] = piece;
      return;
    }

    initialCol = Math.floor((this.width - piece.dimension) / 2);
    this.currentCoordinate.col = initialCol;

    this._addTetromino();
  }

  hasFalling() {
    return this.movingPiece != undefined;
  }

  toString() {
    return this.grid.map((row) => `${row.join("")}\n`).join("");
  }

  _hasFallen() {
    if (!(this.movingPiece instanceof Tetromino)) {
      return (
        this.currentCoordinate.row + 1 >= this.height ||
        this.grid[this.currentCoordinate.row + 1][this.currentCoordinate.col] != this.SENTINEL_MARKER
      );
    }

    return this.currentCoordinate.row + this.movingPiece.dimension > this.height || this._hasTetrominoBelow();
  }

  _moveTetromino() {
    this._removeExistingTetromino();
    this.currentCoordinate.row += 1;
    this._addTetromino();
  }

  _removeExistingTetromino() {
    if (!(this.movingPiece instanceof Tetromino)) {
      this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.SENTINEL_MARKER;
      return;
    }

    for (let row = 0; row < this.movingPiece.dimension; row++) {
      for (let col = 0; col < this.movingPiece.dimension; col++) {
        this.grid[row + this.currentCoordinate.row][col + this.currentCoordinate.col] = this.SENTINEL_MARKER;
      }
    }
  }

  _addTetromino() {
    if (!(this.movingPiece instanceof Tetromino)) {
      this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.movingPiece;
      return;
    }

    for (let row = 0; row < this.movingPiece.dimension; row++) {
      for (let col = 0; col < this.movingPiece.dimension; col++) {
        if (this.movingPiece.hasMarker(row, col)) {
          this.grid[row + this.currentCoordinate.row][col + this.currentCoordinate.col] = this.movingPiece.marker;
        }
      }
    }
  }

  _hasTetrominoBelow() {
    let lastRow = this.currentCoordinate.row + this.movingPiece.dimension - 1;
    let startColumn = this.currentCoordinate.col;
    let endColumn = this.currentCoordinate.col + this.movingPiece.dimension;

    for (let col = startColumn; col < endColumn; col++) {
      if (this.grid[lastRow][col] !== this.SENTINEL_MARKER) {
        return true;
      }
    }

    return false;
  }
}
