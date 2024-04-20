import { normalize } from "./utils/utils.mjs"

export class RotatingShape {
  static fromString(string) {
    return new RotatingShape(string);
  }

  _shapeData;

  constructor(string) {
    this._shapeData = this._parse(normalize(string));
  }

  _parse(string) {
    return string
      .split("\n")
      .reduce((result, row) => {
        result.push(row.split(""));
        return result;
      }, []);
  }

  toString() {
    return this._shapeData.map((row) => `${row.join("")}\n`).join("");
  }
}
