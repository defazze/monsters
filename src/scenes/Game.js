/* globals __DEV__ */
import Phaser from "phaser";

import Actor from "../actors/Actor";
import { Monster } from "../actors/Monster";
import Generator from "../core/MonsterGenerator";
import Builder from "../core/PlayerBuilder";
import Calculator from "../core/DamageCalculator";
import { CELL_SIZE, SPAWN_DELAY } from "../constants/common";
import { Player } from "../actors/Player";
import Potion from "../sprites/HpPotion";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {}
  preload() {}

  create() {
    this.spawnTime = 0;
    this.spawnDelayRun = false;

    this.cameras.main.setBackgroundColor(0x8ee5ee);

    this.header = this.add.text(200, 10, "Wave 1", {
      font: "64px Bangers",
      fill: "#666666"
    });

    this.input.keyboard.on("keydown", this.onKeyPressed);

    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x0f0f0f);
    graphics.strokeRect(CELL_SIZE, CELL_SIZE, CELL_SIZE * 9, CELL_SIZE * 7);

    this.generator = new Generator();
    this.сalculator = new Calculator();
    this.builder = new Builder();

    this.wave = 1;
    this.mustSpawn = true;

    this.playerInfo = this.builder.build();
    this.player = new Player({
      scene: this,
      x: CELL_SIZE * 4,
      y: CELL_SIZE * 4,
      playerInfo: this.playerInfo
    });
    this.add.existing(this.player);

    const potion = new Potion({
      scene: this,
      x: CELL_SIZE * 1.5,
      y: CELL_SIZE * 8.5,
      onClick: this.onPotionClick
    });
    this.add.existing(potion);
  }

  update(time, delta) {
    if (this.monsters) {
      this.monsters.forEach(m => m.update(time));
    }

    if (this.mustSpawn) {
      if (!this.spawnDelayRun) {
        this.spawnDelayRun = true;
        this.spawnTime = time + SPAWN_DELAY;
      } else {
        if (time >= this.spawnTime) {
          this.mustSpawn = false;
          this.spawnDelayRun = false;
          this.monstersGenerate();
        }
      }
    }

    this.player.update(time);
  }

  onMonsterClick = monster => {
    const damage = this.сalculator.toMonster(
      this.playerInfo,
      monster.monsterInfo
    );
    monster.hit(damage);
    if (monster.isDead) {
      monster.destroy();
    }

    if (this.monsters.every(m => m.isDead)) {
      this.wave++;
      if (this.wave > 10) {
        this.scene.start("GameOverScene");
      } else {
        this.mustSpawn = true;

        this.header.destroy();
        this.header = this.add.text(200, 10, "Wave " + this.wave, {
          font: "64px Bangers",
          fill: "#666666"
        });
      }
    }
  };

  onMosterAttack = monsterInfo => {
    const damage = this.сalculator.toPlayer(monsterInfo, this.playerInfo);
    this.player.hit(damage);
    if (this.player.currentHealth <= 0) {
      this.scene.start("GameOverScene");
    }
  };

  onPotionClick = () => {
    this.player.regenerate(10, 2000);
  };

  onKeyPressed = event => {
    if (event.key == "1") {
      this.player.regenerate(10, 2000);
    }
  };
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
