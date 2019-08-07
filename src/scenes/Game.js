/* globals __DEV__ */
import Phaser from "phaser";

import Actor from "../actors/Actor";
import { Monster } from "../actors/Monster";
import Data from "../../data/monsters.json";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }
  init() {}
  preload() {}

  create() {
    this.currentLife = 1000;
    this.cameras.main.setBackgroundColor(0x8ee5ee);

    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x0f0f0f);
    graphics.strokeRect(96, 96, 864, 672);

    this.onMosterAttack = this.onMosterAttack.bind(this);

    console.log(Data);

    this.monster = new Monster({
      scene: this,
      x: 550,
      y: 300,
      asset: "mushroom",
      name: "Mushroom",
      totalLife: 1000,
      onClick: this.onMonsterClick,
      onAttack: this.onMosterAttack
    });
    this.add.existing(this.monster);

    this.player = new Actor({
      scene: this,
      x: 150,
      y: 300,
      asset: "pokemon",
      name: "Player",
      totalLife: 1000
    });
    this.add.existing(this.player);
  }

  update(time, delta) {
    this.monster.update(time);
  }

  onMonsterClick(monster) {
    monster.hit(66);
    if (monster.isDead) {
      monster.destroy();
    }
  }

  onMosterAttack(monster) {
    this.player.hit(monster.damage);
    if (this.player.currentLife <= 0) {
      this.scene.start("GameOverScene");
    }
  }
}
