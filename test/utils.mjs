export function fallToBottom(board) {
  for (let i = 0; i < 10; i++) {
    board.tick();
  }
}

export function moveToFarLeft(board) {
  for (let i = 0; i < board.width; i++) {
    board.moveLeft()
  }
}

export function moveToFarRight(board) {
  for (let i = 0; i < board.width; i++) {
    board.moveRight()
  }
}

export function moveDownBy(board, steps) {
  for (let i = 0; i < steps; i++) {
    board.moveDown();
  }
}
