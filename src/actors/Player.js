import Actor from "./Actor";
import { CELL_SIZE } from "../constants/common";

export class Player extends Actor {
  constructor({ scene, x, y, playerInfo }) {
    super({
      scene,
      x,
      y,
      health: playerInfo.health,
      asset: "pokemon",
      name: "Hero"
    });

    this.playerInfo = playerInfo;
  }
}
