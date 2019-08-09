export default class {
  constructor() {
    this.regenerates = [];
    this.regenerateEndTime = 0;
    this.currentRegenerate = null;
    this.regenerateSpeed = 0;
  }

  get isRegenerate() {
    return this.currentRegenerate;
  }

  add(health, interval) {
    this.regenerates.push({ health, interval });
  }

  reset() {
    this.regenerates = [];
    this.currentRegenerate = null;
    this.regenerateSpeed = 0;
    this.regenerateEndTime = 0;
  }

  process(time) {
    if (this.regenerates.length > 0 && !this.currentRegenerate) {
      this.currentRegenerate = this.regenerates.shift();
      this.regenerateSpeed =
        this.currentRegenerate.health / this.currentRegenerate.interval;
      this.regenerateEndTime = time + this.currentRegenerate.interval;
    }

    if (this.isRegenerate) {
      if (time >= this.regenerateEndTime) {
        this.reset();
      }
    }

    return this.regenerateSpeed;
  }
}
