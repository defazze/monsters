/* globals __DEV__ */
import Phaser from "phaser";

import Actor from "../actors/Actor";
import { Monster } from "../actors/Monster";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }
  init() {}
  preload() {}

  create() {
    this.currentLife = 1000;
    this.cameras.main.setBackgroundColor(0xf0f8ff);

    const monster = new Monster({
      scene: this,
      x: 550,
      y: 300,
      asset: "mushroom",
      name: "Mushroom",
      totalLife: 1000,
      onClick: this.onClick
    });
    this.add.existing(monster);

    const player = new Actor({
      scene: this,
      x: 150,
      y: 300,
      asset: "pokemon",
      name: "Player",
      totalLife: 1000
    });
    this.add.existing(player);
  }

  update() {}

  onClick(monster) {
    monster.hit(66);
  }
}
