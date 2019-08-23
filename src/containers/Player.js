import Actor from "./Actor";
import { CELL_SIZE } from "../constants/common";

export class Player extends Actor {
  constructor({ scene, x, y, playerInfo, onDead }) {
    super({
      scene,
      x,
      y,
      health: playerInfo.health,
      asset: "knight-idle",
      name: "Knight",
      onDead
    });

    this.playerInfo = playerInfo;
  }

  play(key) {
    this.sprite.play(key);
    if (key == "knight-attack") {
      this.sprite.anims.chain("knight-idle");
    }
  }
}
