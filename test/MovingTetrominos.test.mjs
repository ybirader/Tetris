import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";
import { fallToBottom, moveToFarLeft, moveToFarRight, moveDownBy } from "./utils.mjs";

describe("Falling tetrominos", () => {
  let board;
  beforeEach(() => {
    board = new Board(10, 6);
  });

  test("can be moved left", () => {
    board.drop(Tetromino.T_SHAPE);
    board.tick();

    board.moveLeft();

    expect(board.toString()).to.equalShape(
      `..........
      ...T......
      ..TTT.....
      ..........
      ..........
      ..........`
    );
  });

  test("can be moved right", () => {
    board.drop(Tetromino.T_SHAPE);
    board.tick();

    board.moveRight();

    expect(board.toString()).to.equalShape(
      `..........
      .....T....
      ....TTT...
      ..........
      ..........
      ..........`
    );
  });

  test("can be moved down", () => {
    board.drop(Tetromino.T_SHAPE);

    board.moveDown();

    expect(board.toString()).to.equalShape(
      `..........
      ....T.....
      ...TTT....
      ..........
      ..........
      ..........`
    );
  });

  test("cannot be moved left beyond the board", () => {
    board.drop(Tetromino.T_SHAPE);

    moveToFarLeft(board);

    expect(board.toString()).to.equalShape(
      `.T........
      TTT.......
      ..........
      ..........
      ..........
      ..........`
    );
  });

  test("cannot be moved right beyond the board", () => {
    board.drop(Tetromino.T_SHAPE);

    moveToFarRight(board);

    expect(board.toString()).to.equalShape(
      `........T.
      .......TTT
      ..........
      ..........
      ..........
      ..........`
    );
  });

  test("cannot be moved down beyond the board and stops falling", () => {
    board.drop(Tetromino.T_SHAPE);

    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ..........
      ..........
      ....T.....
      ...TTT....`
    );
    expect(board.hasFalling()).to.be.false;
  });

  test("cannot be moved right through other blocks", () => {
    board.drop(Tetromino.T_SHAPE);

    moveToFarRight(board);
    fallToBottom(board);

    board.drop(Tetromino.T_SHAPE);
    moveDownBy(board, 3);
    moveToFarRight(board);

    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ..........
      ......T...
      .....TTTT.
      .......TTT`
    );
  });

  test("cannot be moved left through other blocks", () => {
    board.drop(Tetromino.T_SHAPE);

    moveToFarLeft(board);
    fallToBottom(board);

    board.drop(Tetromino.T_SHAPE);
    moveDownBy(board, 3);
    moveToFarLeft(board);

    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ..........
      ...T......
      .TTTT.....
      TTT.......`
    );
  });

  test("cannot be moved down through other blocks", () => {
    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);

    board.drop(Tetromino.T_SHAPE);
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ....T.....
      ...TTT....
      ....T.....
      ...TTT....`
    );
  });
});
