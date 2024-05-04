import { describe, test } from "vitest";
import { expect } from "chai";
import { ShuffleBag } from "../src/ShuffleBag.mjs";

describe("Random", () => {
  test("should return a random piece", () => {
    const pieces = ["#", "*", "$", "@"];
    const shuffleBag = new ShuffleBag(pieces);

    let output;
    let samples = new Set();

    for (let i = 0; i < 5; i++) {
      let sample = [];
      for (let j = 0; j < 5; j++) {
        output = shuffleBag.random();
        expect(output).to.contain.oneOf(pieces);
        sample.push(output);
      }

      expect(samples.has(sample.join(""))).to.be.false;
      samples.add(sample.join(""));
    }
  });
});
