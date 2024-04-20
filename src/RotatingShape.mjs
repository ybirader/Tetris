import { normalize, transpose } from "./utils/utils.mjs";

export class RotatingShape {
  static fromString(string) {
    return new RotatingShape(this._parse(normalize(string)));
  }

  static _parse(string) {
    return string
      .trim()
      .split("\n")
      .reduce((result, row) => {
        result.push(row.split(""));
        return result;
      }, []);
  }

  _shapeData;

  constructor(shapeData) {
    this._shapeData = shapeData;
  }

  rotateRight() {
    const transposed = transpose(this._shapeData);
    return new RotatingShape(transposed.map((row) => row.toReversed()));
  }

  rotateLeft() {
    return new RotatingShape(transpose(this._shapeData.map((row) => row.toReversed())));
  }

  toString() {
    return this._shapeData.map((row) => `${row.join("")}\n`).join("");
  }
}
