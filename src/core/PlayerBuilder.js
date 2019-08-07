import Phaser from "phaser";
import Data from "../../data/player.json";

export default class {
  constructor() {
    this.playerInfo = Data;
  }

  build() {
    return this.playerInfo;
  }
}
