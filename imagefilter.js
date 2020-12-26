export class FilterBuffer {
  constructor() {
    this._buffer = Array(0);
  }

  setBufferSize(size) {
    if(this._buffer.length < size) {
      this._buffer = Array(size);
    }
  }

  get buffer() {
    return this._buffer;
  }

}