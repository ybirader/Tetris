export class ShuffleBag {
  collection;
  _currentPosition = -1;

  constructor(collection) {
    this.collection = collection;
  }

  random() {
    if (this._currentPosition < 0) {
      this._shuffle();
      this._currentPosition = this.collection.length - 1;
    }

    return this.collection[this._currentPosition--];
  }

  _shuffle() {
    let randomIdx;

    for (let i = this.collection.length - 1; i >= 0; i--) {
      randomIdx = Math.floor(Math.random() * (i + 1));
      [this.collection[i], this.collection[randomIdx]] = [this.collection[randomIdx], this.collection[i]];
    }
  }
}
