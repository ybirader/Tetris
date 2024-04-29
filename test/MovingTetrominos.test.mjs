import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

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

    board.moveDown()

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

    for (let i = 0; i < board.width; i++) {
      board.moveLeft()
    }

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

    for (let i = 0; i < board.width; i++) {
      board.moveRight()
    }

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

    for (let i = 0; i < 2*board.height; i++) {
      board.moveDown()
    }

    expect(board.toString()).to.equalShape(
     `..........
      ..........
      ..........
      ..........
      ....T.....
      ...TTT....`
    );
  });


  test("cannot be moved right through other blocks", () => {
    board.drop(Tetromino.T_SHAPE);

    for (let i = 0; i < board.width; i++) {
      board.moveRight()
    }
    for (let i = 0; i < 2*board.height; i++) {
      board.moveDown()
    }

    board.drop(Tetromino.T_SHAPE)

    for (let i = 0; i < 3; i++) {
      board.moveDown()
    }
    for (let i = 0; i < board.width; i++) {
      board.moveRight()
    }


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

    for (let i = 0; i < board.width; i++) {
      board.moveLeft()
    }
    for (let i = 0; i < 2*board.height; i++) {
      board.moveDown()
    }

    board.drop(Tetromino.T_SHAPE)

    for (let i = 0; i < 3; i++) {
      board.moveDown()
    }
    for (let i = 0; i < board.width; i++) {
      board.moveLeft()
    }


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

    for (let i = 0; i < 2*board.height; i++) {
      board.moveDown()
    }

    board.drop(Tetromino.T_SHAPE)

    for (let i = 0; i < 3; i++) {
      board.moveDown()
    }

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
