import Actor from "./Actor";
import { CELL_SIZE } from "../constants/common";

export class Player extends Actor {
  constructor({ scene, x, y, playerInfo, onDead }) {
    super({
      scene,
      x,
      y,
      health: playerInfo.health,
      asset: "hero",
      name: "Hero",
      onDead
    });

    this.playerInfo = playerInfo;
  }
}
