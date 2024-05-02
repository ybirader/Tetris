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
    board.drop("#");
    board.tick();

    board.moveLeft();

    expect(board.toString()).to.equalShape(
      `..........
      ...#......
      ..........
      ..........
      ..........
      ..........`
    );
  });

  test("can be moved right", () => {
    board.drop("#");
    board.tick();

    board.moveRight();

    expect(board.toString()).to.equalShape(
      `..........
      .....#....
      ..........
      ..........
      ..........
      ..........`
    );
  });

  test("can be moved down", () => {
    board.drop("#");

    board.moveDown();

    expect(board.toString()).to.equalShape(
      `..........
      ....#.....
      ..........
      ..........
      ..........
      ..........`
    );
  });

  test("cannot be moved left beyond the board", () => {
    board.drop("#");

    moveToFarLeft(board);

    expect(board.toString()).to.equalShape(
      `#.........
      ..........
      ..........
      ..........
      ..........
      ..........`
    );
  });

  test("cannot be moved right beyond the board", () => {
    board.drop("#");

    moveToFarRight(board);

    expect(board.toString()).to.equalShape(
      `.........#
      ..........
      ..........
      ..........
      ..........
      ..........`
    );
  });

  test("cannot be moved down beyond the board and stops falling", () => {
    board.drop("#");

    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ..........
      ..........
      ..........
      ....#.....`
    );
    expect(board.hasFalling()).to.be.false;
  });

  test("cannot be moved right through other blocks", () => {
    board.drop("#");

    moveToFarRight(board);
    fallToBottom(board);

    board.drop("#");
    moveDownBy(board, board.height - 1);
    moveToFarRight(board);

    expect(board.hasFalling()).to.be.true;
    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ..........
      ..........
      ..........
      ........##`
    );
  });

  test("cannot be moved left through other blocks", () => {
    board.drop("#");

    moveToFarLeft(board);
    fallToBottom(board);

    board.drop("#");
    moveDownBy(board, board.height - 1);
    moveToFarLeft(board);

    expect(board.hasFalling()).to.be.true
    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ..........
      ..........
      ..........
      ##........`
    );
  });

  test("cannot be moved down through other blocks", () => {
    board.drop("#");
    fallToBottom(board);

    board.drop("#");
    fallToBottom(board);

    expect(board.toString()).to.equalShape(
      `..........
      ..........
      ..........
      ..........
      ....#.....
      ....#.....`
    );
  });

  test("can be rotated right", () => {
    board.drop(Tetromino.T_SHAPE);
    board.moveDown();

    board.rotateRight();

    expect(board.toString()).to.equalShape(
      `..........
       ....T.....
       ...TT.....
       ....T.....
       ..........
       ..........`
    );
  });

  test("can be rotated left", () => {
    board.drop(Tetromino.T_SHAPE);
    board.moveDown();

    board.rotateLeft();

    expect(board.toString()).to.equalShape(
      `..........
       ....T.....
       ....TT....
       ....T.....
       ..........
       ..........`
    );
  });

  test("cannot be rotated right when there is no room", () => {
    board.drop(Tetromino.I_SHAPE);

    board.rotateRight();
    moveToFarLeft(board);
    board.rotateRight();

    expect(board.toString()).to.equalShape(
      `I.........
       I.........
       I.........
       I.........
       ..........
       ..........`
    );
  });

  test("cannot be rotated left when there is no room", () => {
    board.drop(Tetromino.I_SHAPE);

    board.rotateRight();
    moveToFarLeft(board);
    board.rotateLeft();

    expect(board.toString()).to.equalShape(
      `I.........
       I.........
       I.........
       I.........
       ..........
       ..........`
    );
  });

  test("wall kicks for right rotation", () => {
    board.drop(Tetromino.I_SHAPE);

    board.rotateRight();
    moveToFarLeft(board);
    board.moveRight();
    board.rotateRight();

    expect(board.toString()).to.equalShape(
      `..........
       IIII......
       ..........
       ..........
       ..........
       ..........`
    );
  });

  test("wall kicks for left rotation", () => {
    board.drop(Tetromino.I_SHAPE);

    board.rotateRight();
    moveToFarRight(board);
    board.rotateLeft();

    expect(board.toString()).to.equalShape(
      `..........
       ......IIII
       ..........
       ..........
       ..........
       ..........`
    );
  });
});
