import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";
import { fallToBottom } from "./utils.mjs";

describe("Filling board", () => {
  test("clears row when it becomes full", () => {
    const board = new Board(4, 5);
    board.drop(Tetromino.I_SHAPE);
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `....
      ....
      ....
      ....
      ....`
    );
  });
});
