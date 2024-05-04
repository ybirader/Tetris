import { Block } from "./Block.mjs";
import { RowClearedEvent } from "./const.mjs";

const SENTINEL_MARKER = ".";

function createEmptyGrid(width, height, sentinelMarker) {
  const result = [];

  for (let i = 0; i < height; i++) {
    const row = Array(width).fill(sentinelMarker);
    result.push(row);
  }

  return result;
}

class MovingPiece {
  piece;
  position;

  constructor(piece, initialRow, initialCol) {
    this.piece = piece;
    this.position = { row: initialRow, col: initialCol };
  }

  get row() {
    return this.position.row;
  }

  get col() {
    return this.position.col;
  }

  get dimension() {
    return this.piece.dimension;
  }

  get marker() {
    return this.piece.marker;
  }

  blockAt(gridRow, gridCol) {
    if (
      gridRow >= this.row &&
      gridCol >= this.col &&
      gridRow < this.row + this.dimension &&
      gridCol < this.col + this.dimension
    ) {
      return this.piece.blockAt(gridRow - this.row, gridCol - this.col);
    }

    return SENTINEL_MARKER;
  }

  moveDown() {
    this.position.row += 1;
  }

  moveUp() {
    this.position.row -= 1;
  }

  moveLeft() {
    this.position.col -= 1;
  }

  moveRight() {
    this.position.col += 1;
  }

  rotateRight() {
    this.piece = this.piece.rotateRight();
  }

  rotateLeft() {
    this.piece = this.piece.rotateLeft();
  }
}

function createMovingPiece(piece, width) {
  if (typeof piece === "string") {
    piece = new Block(piece);
  }

  return new MovingPiece(piece, 0, Math.floor((width - piece.dimension) / 2));
}

export class Board {
  grid;
  movingPiece;
  eventBus;

  constructor(width, height, eventBus) {
    this.grid = createEmptyGrid(width, height, SENTINEL_MARKER);
    this.eventBus = eventBus;
  }

  get width() {
    return this.grid[0].length;
  }

  get height() {
    return this.grid.length;
  }

  drop(piece) {
    if (this.hasFalling()) {
      throw new Error("already falling");
    }

    this.movingPiece = createMovingPiece(piece, this.width);
  }

  tick() {
    if (!this.hasFalling()) {
      return;
    }

    this._attemptWithRollback(this.movingPiece.moveDown.bind(this.movingPiece), () => {
      this._undoMove();
      this._stopFalling();
      this._clearFullRows();
    });
  }

  moveLeft() {
    this._attemptWithRollback(this.movingPiece.moveLeft.bind(this.movingPiece), this.moveRight.bind(this));
  }

  moveRight() {
    this._attemptWithRollback(this.movingPiece.moveRight.bind(this.movingPiece), this.moveLeft.bind(this));
  }

  moveDown() {
    this.tick();
  }

  rotateRight() {
    let succeeded = this._attemptWithRollback(
      this.movingPiece.rotateRight.bind(this.movingPiece),
      this.rotateLeft.bind(this)
    );
    if (succeeded) {
      return;
    }

    succeeded = this._attemptWithRollback(this.movingPiece.moveRight.bind(this.movingPiece), this.moveLeft.bind(this));
    if (succeeded) {
      succeeded = this._attemptWithRollback(
        this.movingPiece.rotateRight.bind(this.movingPiece),
        this.rotateLeft.bind(this)
      );
      if (succeeded) {
        return;
      }

      this.movingPiece.moveLeft();
    }

    succeeded = this._attemptWithRollback(this.movingPiece.moveLeft.bind(this.movingPiece), this.moveRight.bind(this));
    if (succeeded) {
      succeeded = this._attemptWithRollback(
        this.movingPiece.rotateRight.bind(this.movingPiece),
        this.rotateLeft.bind(this)
      );
      if (succeeded) {
        return;
      }

      this.movingPiece.moveRight();
    }
  }

  rotateLeft() {
    let successful = this._attemptWithRollback(
      this.movingPiece.rotateLeft.bind(this.movingPiece),
      this.rotateRight.bind(this)
    );
    if (successful) {
      return;
    }

    successful = this._attemptWithRollback(this.movingPiece.moveRight.bind(this.movingPiece), this.moveLeft.bind(this));
    if (successful) {
      successful = this._attemptWithRollback(
        this.movingPiece.rotateLeft.bind(this.movingPiece),
        this.rotateRight.bind(this)
      );
      if (successful) {
        return;
      }

      this.moveLeft();
    }

    successful = this._attemptWithRollback(this.movingPiece.moveLeft.bind(this.movingPiece), this.moveRight.bind(this));
    if (successful) {
      successful = this._attemptWithRollback(
        this.movingPiece.rotateLeft.bind(this.movingPiece),
        this.rotateRight.bind(this)
      );
      if (successful) {
        return;
      }

      this.moveRight();
    }
  }

  hasFalling() {
    return this.movingPiece !== undefined;
  }

  toString() {
    let result = "";

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        result += this._blockAt(row, col);
      }
      result += "\n";
    }

    return result;
  }

  _attemptWithRollback(actionFn, rollbackFn) {
    actionFn();
    if (this._invalidMove()) {
      rollbackFn();
      return false;
    }

    return true;
  }

  _blockAt(row, col) {
    if (this.hasFalling()) {
      const block = this.movingPiece.blockAt(row, col);
      if (block !== SENTINEL_MARKER) {
        return block;
      }
    }

    return this.grid[row][col];
  }

  _invalidMove() {
    for (let row = this.movingPiece.row; row < this.movingPiece.row + this.movingPiece.dimension; row++) {
      for (let col = this.movingPiece.col; col < this.movingPiece.col + this.movingPiece.dimension; col++) {
        if (this._outOfBounds(row, col) || this._hasCollided(row, col)) {
          return true;
        }
      }
    }

    return false;
  }

  _outOfBounds(row, col) {
    return this.movingPiece.blockAt(row, col) !== SENTINEL_MARKER && row >= this.height;
  }

  _hasCollided(row, col) {
    return this.movingPiece.blockAt(row, col) !== SENTINEL_MARKER && this.grid[row][col] !== SENTINEL_MARKER;
  }

  _undoMove() {
    this.movingPiece.moveUp();
  }

  _stopFalling() {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.grid[row][col] = this._blockAt(row, col);
      }
    }

    this.movingPiece = undefined;
  }

  _clearFullRows() {
    let clearedRows = 0;

    for (let row = 0; row < this.height; row++) {
      let isRowFull = true;
      for (let col = 0; col < this.width; col++) {
        if (this.grid[row][col] === SENTINEL_MARKER) {
          isRowFull = false;
          break;
        }
      }

      if (isRowFull) {
        this._clearRow(row);
        clearedRows += 1;
      }
    }

    if (clearedRows !== 0) {
      this.eventBus?.emit(RowClearedEvent, clearedRows);
    }
  }

  _clearRow(row) {
    for (let col = 0; col < this.width; col++) {
      this.grid[row][col] = SENTINEL_MARKER;
    }

    this._shiftRowsAboveDown(row);
  }

  _shiftRowsAboveDown(initialRow) {
    for (let col = 0; col < this.width; col++) {
      for (let row = initialRow; row > 0; row--) {
        this.grid[row][col] = this.grid[row - 1][col];
        this.grid[row - 1][col] = SENTINEL_MARKER;
      }
    }
  }
}
