export class Board {
  width;
  height;
  grid;

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = []
    for (let i = 0; i < width; i++) {
      let row = []
      for (let j = 0; j < height; j++) {
        row.push(".")
      }
      this.grid.push(row)
    }
  }

  toString() {
    return this.grid.map(row => `${row.join("")}\n`).reduce((result, rowString) => result += rowString, "")
  }
}
