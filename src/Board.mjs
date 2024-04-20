export class Board {
  width;
  height;
  grid;
  currentCoordinate;
  currentBlock;

  SENTINEL_MARKER = ".";

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this._resetGrid();
  }

  tick() {
    if (this._hasFallen()) {
      this.currentBlock = undefined;
      return;
    }

    this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.SENTINEL_MARKER;
    this.currentCoordinate.row += 1;
    this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.currentBlock;
  }

  drop(block) {
    if (this.hasFalling()) {
      throw new Error("already falling");
    }

    this.currentBlock = block;
    this._initializeBlockPosition()
  }

  hasFalling() {
    return this.currentBlock != undefined;
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
    return (
      this.currentCoordinate.row + 1 >= this.height ||
      this.grid[this.currentCoordinate.row + 1][this.currentCoordinate.col] != this.SENTINEL_MARKER
    );
  }

  _initializeBlockPosition() {
    const initialCol = Math.floor(this.width / 2);
    this.currentCoordinate = { row: 0, col: initialCol };
    this.grid[0][initialCol] = this.currentBlock;
  }
}
