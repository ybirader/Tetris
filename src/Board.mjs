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
    return this.position.row
  }

  get col() {
    return this.position.col
  }

  get dimension() {
    return this.piece.dimension
  }

  get marker() {
    return this.piece.marker
  }

  moveDown() {
    this.position.row += 1
  }
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

    this.newMovingPiece = new MovingPiece(piece, initialRow, Math.floor((this.width - piece.dimension) / 2))

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

    return this.newMovingPiece.row + this.newMovingPiece.dimension > this.height || this._hasTetrominoBelow();
  }

  _moveTetromino() {
    this._removeExistingTetromino();
    this.currentCoordinate.row += 1;
    if (this.newMovingPiece) {
      this.newMovingPiece.moveDown()
    }
    this._addTetromino();
  }

  _removeExistingTetromino() {
    if (!(this.movingPiece instanceof Tetromino)) {
      this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.SENTINEL_MARKER;
      return;
    }

    for (let row = 0; row < this.newMovingPiece.dimension; row++) {
      for (let col = 0; col < this.newMovingPiece.dimension; col++) {
        this.grid[row + this.newMovingPiece.row][col + this.newMovingPiece.col] = this.SENTINEL_MARKER;
      }
    }
  }

  _addTetromino() {
    if (!(this.movingPiece instanceof Tetromino)) {
      this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.movingPiece;
      return;
    }

    for (let row = 0; row < this.newMovingPiece.dimension; row++) {
      for (let col = 0; col < this.newMovingPiece.dimension; col++) {
        if (this.movingPiece.hasMarker(row, col)) {
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
