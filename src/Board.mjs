import { Tetromino } from "./Tetromino.mjs";

function createEmptyGrid(width, height, sentinelMarker) {
  const result = [];

  for (let i = 0; i < height; i++) {
    const row = Array(width).fill(sentinelMarker);
    result.push(row);
  }

  return result;
}

export class Board {
  width;
  height;
  grid;
  currentCoordinate;
  fallingTetromino;

  SENTINEL_MARKER = ".";

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = createEmptyGrid(width, height, this.SENTINEL_MARKER);
  }

  tick() {
    if (this._hasFallen()) {
      this.fallingTetromino = undefined;
      return;
    }

    this.moveTetromino();
  }

  moveTetromino() {
    this.removeExistingTetromino();
    this.currentCoordinate.row += 1;
    this.addTetromino();
  }

  removeExistingTetromino() {
    if (!(this.fallingTetromino instanceof Tetromino)) {
      this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.SENTINEL_MARKER;
      return;
    }

    for (let row = 0; row < this.fallingTetromino.dimension; row++) {
      for (let col = 0; col < this.fallingTetromino.dimension; col++) {
        this.grid[row + this.currentCoordinate.row][col + this.currentCoordinate.col] = this.SENTINEL_MARKER;
      }
    }
  }

  addTetromino() {
    if (!(this.fallingTetromino instanceof Tetromino)) {
      this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.fallingTetromino;
      return;
    }

    for (let row = 0; row < this.fallingTetromino.dimension; row++) {
      for (let col = 0; col < this.fallingTetromino.dimension; col++) {
        if (this.fallingTetromino.hasMarker(row, col)) {
          this.grid[row + this.currentCoordinate.row][col + this.currentCoordinate.col] = this.fallingTetromino.marker;
        }
      }
    }
  }

  drop(tetromino) {
    if (this.hasFalling()) {
      throw new Error("already falling");
    }

    this.fallingTetromino = tetromino;
    let initialRow = 0;
    let initialCol = Math.floor(this.width / 2);
    this.currentCoordinate = { row: initialRow, col: initialCol };

    if (!(tetromino instanceof Tetromino)) {
      this.grid[initialRow][initialCol] = tetromino;
      return;
    }

    initialCol = Math.floor((this.width - tetromino.dimension) / 2);
    this.currentCoordinate.col = initialCol;

    this.addTetromino();
  }

  hasFalling() {
    return this.fallingTetromino != undefined;
  }

  toString() {
    return this.grid.map((row) => `${row.join("")}\n`).join("");
  }

  _hasFallen() {
    if (!(this.fallingTetromino instanceof Tetromino)) {
      return (
        this.currentCoordinate.row + 1 >= this.height ||
        this.grid[this.currentCoordinate.row + 1][this.currentCoordinate.col] != this.SENTINEL_MARKER
      );
    }

    return this.currentCoordinate.row + this.fallingTetromino.dimension > this.height || this.hasTetrominoBelow();
  }

  hasTetrominoBelow() {
    let lastRow = this.currentCoordinate.row + this.fallingTetromino.dimension - 1
    let startColumn = this.currentCoordinate.col
    let endColumn = this.currentCoordinate.col + this.fallingTetromino.dimension

    for (let col = startColumn; col < endColumn; col++) {
      if (this.grid[lastRow][col] !== this.SENTINEL_MARKER) {
        return true
      }
    }

    return false
  }
}
