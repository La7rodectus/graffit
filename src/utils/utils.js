

class Range {
  #start;
  #stop;
  #step;

  constructor(start, stop = start, step = 1) {
    this.#start = start;
    this.#stop = stop;
    this.#step = step;
    this.r = this.#fillRange();
  }

  #fillRange() {
    if ((this.#step > 0 && this.#start >= this.#stop) ||
     (this.#step < 0 && this.#start <= this.#stop)) {
      return [];
    }
    const res = [];
    for (let i = this.#start; this.#step > 0 ? i <= this.#stop : i >= this.#stop; i += this.#step) {
      res.push(i);
    }
    return res;
  }

  valueOf() {
    return this.r;
  }

  inRange(num) {
    return this.r.includes(num);
  }
}

module.exports = {
  Range,
};
