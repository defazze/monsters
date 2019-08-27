import { CELL_SIZE } from "../constants/common";

export const proxy = target => {
  return new Proxy(target, new proxyObject());
};

class proxyObject {
  get(target, prop) {
    if (prop == "lineIndex") {
      return Math.round(target.x / CELL_SIZE - 1.5);
    }

    if (prop == "rowIndex") {
      return Math.round(target.y / CELL_SIZE - 1.5);
    }
    return target[prop];
  }

  set(target, prop, val) {
    if (prop == "lineIndex") {
      target.x = (val + 1.5) * CELL_SIZE;
    } else if (prop == "rowIndex") {
      target.y = (val + 1.5) * CELL_SIZE;
    } else {
      target[prop] = val;
    }

    return true;
  }
}
