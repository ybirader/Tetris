import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino {

  static get T_SHAPE() {
    return new Tetromino([
      [".", "T", "."],
      ["T", "T", "T"],
      [".", ".", "."],
    ]);
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
