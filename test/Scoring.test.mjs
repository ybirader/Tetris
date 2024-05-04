import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { ScoringSystem } from "../src/ScoringSystem.mjs";
import EventEmitter from "node:events";
import { fallToBottom } from "./utils.mjs";

describe("Player", () => {
  test("scores 40 points for clearing one line", () => {
    const eventBus = new EventEmitter();
    const board = new Board(1, 2, eventBus);
    const scoringSystem = new ScoringSystem(eventBus);

    board.drop("#");
    fallToBottom(board);

    expect(scoringSystem.currentScore()).to.equal(40);
  });
});
