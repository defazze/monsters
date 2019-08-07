/* globals __DEV__ */
import Phaser from "phaser";

import Actor from "../actors/Actor";
import { Monster } from "../actors/Monster";
import Generator from "../core/MonsterGenerator";

import { CELL_SIZE } from "../constants/common";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {}
  preload() {}

  create() {
    this.health = 1000;

    this.cameras.main.setBackgroundColor(0x8ee5ee);

    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x0f0f0f);
    graphics.strokeRect(CELL_SIZE, CELL_SIZE, CELL_SIZE * 9, CELL_SIZE * 7);

    this.onMosterAttack = this.onMosterAttack.bind(this);
    this.onMonsterClick = this.onMonsterClick.bind(this);

    this.generator = new Generator();
    this.wave = 1;

    this.monstersGenerate();

    this.player = new Actor({
      scene: this,
      x: CELL_SIZE * 4,
      y: CELL_SIZE * 4,
      asset: "pokemon",
      name: "Player",
      health: 1000
    });
    this.add.existing(this.player);
  }

  update(time, delta) {
    this.monsters.forEach(m => m.update(time));
  }

  onMonsterClick(monster) {
    monster.hit(1);
    if (monster.isDead) {
      monster.destroy();
      if (this.monsters.every(m => m.isDead)) {
        if (this.wave == 10) {
          this.scene.start("GameOverScene");
        } else {
          this.wave++;
          this.monstersGenerate();
        }
      }
    }
  }

  onMosterAttack(monster) {
    this.player.hit(monster.damage);
    if (this.player.currentHealth <= 0) {
      this.scene.start("GameOverScene");
    }
  }

  monstersGenerate() {
    const generatedMonsters = this.generator.generate(this.wave);

    this.monsters = generatedMonsters.map(generatedMonster => {
      const monster = new Monster({
        scene: this,
        x: generatedMonster.coords.x,
        y: generatedMonster.coords.y,
        monsterInfo: generatedMonster.monsterInfo,
        health: generatedMonster.health,
        onClick: this.onMonsterClick,
        onAttack: this.onMosterAttack
      });

      this.add.existing(monster);

      return monster;
    });
  }
}
