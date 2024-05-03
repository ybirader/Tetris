import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";
import { fallToBottom, moveToFarRight } from "./utils.mjs";

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

  test("rows above shift downwards by number of rows cleared", () => {
    const board = new Board(5, 5);
    board.drop(Tetromino.I_SHAPE);
    fallToBottom(board);

    board.drop(Tetromino.I_SHAPE);
    board.rotateRight();
    moveToFarRight(board);
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `.....
      .....
      ....I
      ....I
      ....I`
    );
  });

  test("does not clear full row that is still falling", () => {
    const board = new Board(4, 4);
    board.drop(Tetromino.I_SHAPE);
    board.tick();

    expect(board.hasFalling()).to.be.true;
    expect(board.toString()).to.equalShape(
      `....
      ....
      IIII
      ....`
    );
  });

  test("rows below cleared row stay the same", () => {
    const board = new Board(4, 5);
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);

    board.drop(Tetromino.I_SHAPE);
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `....
      ....
      ....
      TTT.
      .T..`
    );
  });
});
