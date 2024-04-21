import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino {

  static get T_SHAPE() {
    return new Tetromino([
      [".", "T", "."],
      ["T", "T", "T"],
      [".", ".", "."],
    ]);
  }

  static get I_SHAPE() {
    return new Tetromino([
      [".", ".", ".", ".", "."],
      [".", ".", ".", ".", "."],
      ["I", "I", "I", "I", "."],
      [".", ".", ".", ".", "."],
      [".", ".", ".", ".", "."],
    ])
  }

  static get O_SHAPE() {
    return new Tetromino([
      [".", "O", "O"],
      [".", "O", "O"],
      [".", ".", "."],
    ])
  }

  rotatingShape;

  constructor(shape) {
    this.rotatingShape = new RotatingShape(shape)
  }

  rotateRight() {
    return this.rotatingShape.rotateRight()
  }

  rotateLeft() {
    return this.rotatingShape.rotateLeft()
  }

  toString() {
    return this.rotatingShape.toString()
  }
}
