export class Tetromino {
  static get T_SHAPE() {
    const orientations = [
      [
        [".", ".", ".", "."],
        ["T", "T", "T", "."],
        [".", "T", ".", "."],
        [".", ".", ".", "."],
      ],
      [
        [".", "T", ".", "."],
        ["T", "T", ".", "."],
        [".", "T", ".", "."],
        [".", ".", ".", "."],
      ],
      [
        [".", ".", ".", "."],
        [".", "T", ".", "."],
        ["T", "T", "T", "."],
        [".", ".", ".", "."],
      ],
      [
        [".", "T", ".", "."],
        [".", "T", "T", "."],
        [".", "T", ".", "."],
        [".", ".", ".", "."],
      ],
    ];

    return new Tetromino(orientations, 0, 4, "T");
  }

  static get I_SHAPE() {
    const orientations = [
      [
        [".", ".", ".", "."],
        ["I", "I", "I", "I"],
        [".", ".", ".", "."],
        [".", ".", ".", "."],
      ],
      [
        [".", ".", "I", "."],
        [".", ".", "I", "."],
        [".", ".", "I", "."],
        [".", ".", "I", "."],
      ],
    ];

    return new Tetromino(orientations, 0, 4, "I");
  }

  static get O_SHAPE() {
    const orientations = [
      [
        [".", ".", ".", "."],
        [".", "O", "O", "."],
        [".", "O", "O", "."],
        [".", ".", ".", "."],
      ],
    ];

    return new Tetromino(orientations, 0, 4, "O");
  }

  orientations;
  currentOrientation;
  dimension;
  marker;

  constructor(orientations, currentOrientation, dimension, marker) {
    this.orientations = orientations;
    this.currentOrientation = (currentOrientation + orientations.length) % orientations.length;
    this.dimension = dimension;
    this.marker = marker;
  }

  rotateRight() {
    return new Tetromino(this.orientations, this.currentOrientation + 1, this.dimension, this.marker);
  }

  rotateLeft() {
    return new Tetromino(this.orientations, this.currentOrientation - 1, this.dimension, this.marker);
  }

  toString() {
    return this.orientations[this.currentOrientation].map((row) => `${row.join("")}\n`).join("");
  }

  blockAt(row, col) {
    return this.orientations[this.currentOrientation][row][col];
  }
}
