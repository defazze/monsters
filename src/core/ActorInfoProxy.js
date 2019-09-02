import { CELL_SIZE } from "../constants/common";
import { observableObject } from "../utils/Observable";

export const proxy = (actorInfo, actorObject) => {
  return new Proxy(actorInfo, new proxyObject(actorObject));
};

class proxyObject extends observableObject {
  constructor(actorObject) {
    super();
    this.actorObject = actorObject;
  }

  get(target, prop) {
    if (prop == "lineIndex") {
      return Math.round(this.actorObject.x / CELL_SIZE - 1.5);
    }

    if (prop == "rowIndex") {
      return Math.round(this.actorObject.y / CELL_SIZE - 1.5);
    }

    if (prop == "x") {
      return this.actorObject.x;
    }

    if (prop == "y") {
      return this.actorObject.y;
    }

    return super.get(target, prop);
  }
}
