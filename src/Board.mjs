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

  hasFalling() {
    return this.currentBlock != undefined
  }

  tick() {
    this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.SENTINEL_MARKER
    this.currentCoordinate.row += 1
    this.grid[this.currentCoordinate.row][this.currentCoordinate.col] = this.currentBlock
  }

  drop(block) {
    if (this.currentBlock) {
      throw new Error("already falling")
    }

    this.currentBlock = block
    const initialCol = Math.floor(this.width / 2)
    this.currentCoordinate = { row: 0, col: initialCol }
    this.grid[0][initialCol] = block
  }

  toString() {
    return this.grid
    .map((row) => `${row.join("")}\n`)
    .reduce((result, rowString) => (result += rowString), "");
  }

  _resetGrid() {
    const result = []

    for (let i = 0; i < this.height; i++) {
      const row = Array(this.width).fill(this.SENTINEL_MARKER)
      result.push(row)
    }

    return result
  }
}
