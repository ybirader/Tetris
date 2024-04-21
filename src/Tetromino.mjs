import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino {
  static get T_SHAPE() {
    return Tetromino.fromString(
      `
    .T.
    TTT
    ...
    `,
      4
    );
  }

  static get I_SHAPE() {
    return Tetromino.fromString(
      `
    .....
    .....
    IIII.
    .....
    .....
    `,
      2
    );
  }

  static get O_SHAPE() {
    return Tetromino.fromString(
      `
    .OO
    .OO
    ...
    `,
      1
    );
  }

  static fromString(shapeString, numberOfOrientations) {
    const rotatingShape = RotatingShape.fromString(shapeString);
    const orientations = [
      rotatingShape,
      rotatingShape.rotateRight(),
      rotatingShape.rotateRight().rotateRight(),
      rotatingShape.rotateRight().rotateRight().rotateRight(),
    ].slice(0, numberOfOrientations);

    return new Tetromino(orientations, 0);
  }

  orientations;
  currentOrientation;

  constructor(orientations, currentOrientation) {
    this.orientations = orientations;
    this.currentOrientation = (currentOrientation + orientations.length) % orientations.length;
  }

  rotateRight() {
    return new Tetromino(this.orientations, this.currentOrientation + 1);
  }

  rotateLeft() {
    return new Tetromino(this.orientations, this.currentOrientation - 1);
  }

  toString() {
    return this.orientations[this.currentOrientation].toString();
  }
}
