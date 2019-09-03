import Player from "../../data/player.json";
import { SUPERHERO } from "../constants/cheats";
import { runInThisContext } from "vm";

export default class {
  constructor() {
    this.playerInfo = Player;
  }

  build() {
    if (SUPERHERO) {
      this.playerInfo.health = 100000;
      this.playerInfo.baseMinDamage = 1000;
      this.playerInfo.baseMaxDamage = 1000;
    }
    return this.playerInfo;
  }
}
