import Data from "../../data/player.json";
import { SUPERHERO } from "../constants/cheats";

export default class {
  constructor() {
    this.playerInfo = Data;
  }

  build() {
    if (SUPERHERO) {
      this.playerInfo.health = 10000;
      this.playerInfo.baseMinDamage = 1000;
      this.playerInfo.baseMaxDamage = 1000;
    }
    return this.playerInfo;
  }
}
