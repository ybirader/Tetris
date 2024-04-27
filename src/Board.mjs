import { Tetromino } from "./Tetromino.mjs";

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
    this.grid = this._resetGrid();
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

  _resetGrid() {
    const result = [];

    for (let i = 0; i < this.height; i++) {
      const row = Array(this.width).fill(this.SENTINEL_MARKER);
      result.push(row);
    }

    return result;
  }

  _hasFallen() {
    if (!(this.fallingTetromino instanceof Tetromino)) {
      return (
        this.currentCoordinate.row + 1 >= this.height ||
        this.grid[this.currentCoordinate.row + 1][this.currentCoordinate.col] != this.SENTINEL_MARKER
      );
    }
  }
}

/*


- currentRow + 1 out of bounds || currentRow + tetromino width out of bounds



*/
