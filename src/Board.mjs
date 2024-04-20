export class Board {
  width;
  height;
  grid;

  SENTINEL_MARKER = ".";

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this._resetGrid();
  }

  toString() {
    return this.grid
    .map((row) => `${row.join("")}\n`)
    .reduce((result, rowString) => (result += rowString), "");
  }

  _resetGrid() {
    const row = Array(this.width).fill(this.SENTINEL_MARKER);
    return Array(this.height).fill(row);
  }
}
