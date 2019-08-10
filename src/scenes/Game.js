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
import Battlefield from "../core/FieldController.js";

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

    this.anims.create({
      key: "flip",
      frames: this.anims.generateFrameNumbers("coin"),
      frameRate: 20,
      repeat: 1,
      hideOnComplete: true
    });

    const castle = this.add.sprite(150, 50, "castle").setInteractive();
    castle.on("pointerdown", () => this.scene.switch("CastleScene"));

    this.setHeader(1);

    this.input.keyboard.on("keydown", this.onKeyPressed);

    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x0f0f0f);
    graphics.strokeRect(CELL_SIZE, CELL_SIZE, CELL_SIZE * 9, CELL_SIZE * 7);

    this.battlefield = new Battlefield();
    this.generator = new Generator(this.battlefield);
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

    this.player.update(time, delta);
  }

  onMonsterClick = monster => {
    const damage = this.сalculator.toMonster(
      this.playerInfo,
      monster.monsterInfo
    );
    monster.hit(damage);
    if (monster.isDead) {
      monster.destroy();
      this.battlefield.removeMonster(
        monster.monsterInfo.lineIndex,
        monster.monsterInfo.rowIndex
      );

      const coin = this.add.sprite(
        monster.x + CELL_SIZE / 2,
        monster.y + CELL_SIZE / 2,
        "coin"
      );
      coin.anims.play("flip");
      coin.once("animationcomplete", () => {
        coin.destroy();
      });

      if (this.battlefield.isEmpty(monster.monsterInfo.lineIndex)) {
        console.log(this.monsters);
        const monsters = this.monsters.filter(
          m =>
            m.monsterInfo.lineIndex > monster.monsterInfo.lineIndex && !m.isDead
        );
        console.log(monsters);
        monsters.forEach(m => m.moveForward());
      }
    }

    if (this.monsters.every(m => m.isDead)) {
      this.wave++;
      if (this.wave > 10) {
        this.scene.start("GameOverScene");
      } else {
        this.mustSpawn = true;

        this.setHeader(this.wave);
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

  setHeader(wave) {
    if (this.header) {
      this.header.destroy();
    }

    this.header = this.add.text(400, 10, "Wave " + wave, {
      font: "64px Bangers",
      fill: "#666666"
    });
  }

  monstersGenerate() {
    const monstersInfo = this.generator.generate(this.wave);

    this.monsters = monstersInfo.map(monsterInfo => {
      const monster = new Monster({
        scene: this,
        x: monsterInfo.coords.x,
        y: monsterInfo.coords.y,
        monsterInfo: monsterInfo,
        health: monsterInfo.health,
        onClick: this.onMonsterClick,
        onAttack: this.onMosterAttack
      });

      this.add.existing(monster);

      return monster;
    });
  }
}
