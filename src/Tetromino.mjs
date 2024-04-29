import { RotatingShape } from "./RotatingShape.mjs";

export class Tetromino {
  static get T_SHAPE() {
    return Tetromino.fromString(
      `
    .T.
    TTT
    ...
    `,
      4,
      3,
      "T"
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
      2,
      5,
      "I"
    );
  }

  static get O_SHAPE() {
    return Tetromino.fromString(
      `
    .OO
    .OO
    ...
    `,
      1,
      3,
      "O"
    );
  }

  static fromString(shapeString, numberOfOrientations, dimension, marker) {
    const rotatingShape = RotatingShape.fromString(shapeString);
    const orientations = [
      rotatingShape,
      rotatingShape.rotateRight(),
      rotatingShape.rotateRight().rotateRight(),
      rotatingShape.rotateRight().rotateRight().rotateRight(),
    ].slice(0, numberOfOrientations);

    return new Tetromino(orientations, 0, dimension, marker);
  }

  orientations;
  currentOrientation;
  dimension;
  marker;

  constructor(orientations, currentOrientation, dimension, marker) {
    this.orientations = orientations;
    this.currentOrientation = (currentOrientation + orientations.length) % orientations.length;
    this.dimension = dimension
    this.marker = marker
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

  blockAt(row, col) {
    return this.orientations[this.currentOrientation].at(row, col)
  }
}
