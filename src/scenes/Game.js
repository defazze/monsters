/* globals __DEV__ */
import Phaser from "phaser";

import { Monster } from "../containers/Monster";
import Generator from "../core/MonsterGenerator";
import Builder from "../core/PlayerBuilder";
import Calculator from "../core/DamageCalculator";
import { CELL_SIZE, SPAWN_DELAY } from "../constants/common";
import { Player } from "../containers/Player";
import Battlefield from "../core/FieldController.js";
import Item from "../containers/Item";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.customData = data;
  }

  preload() {}

  create() {
    this.inventory = this.customData.inventory;

    this.spawnTime = 0;
    this.spawnDelayRun = false;

    this.cameras.main.setBackgroundColor(0x8ee5ee);

    this.background = this.add.tileSprite(
      CELL_SIZE + (CELL_SIZE * 9) / 2,
      CELL_SIZE + (CELL_SIZE * 7) / 2,
      CELL_SIZE * 9,
      CELL_SIZE * 7,
      "grass"
    );

    this.anims.create({
      key: "flip",
      frames: this.anims.generateFrameNumbers("coin"),
      frameRate: 30,
      repeat: 1,
      hideOnComplete: true
    });

    const castleIcon = this.add.sprite(150, 50, "castle").setInteractive();
    castleIcon.on("pointerdown", () =>
      this.scene.start("CastleScene", this.customData)
    );

    const inventoryIcon = this.add
      .sprite(229, 50, "inventory-icon")
      .setInteractive();
    inventoryIcon.on("pointerdown", () => {
      this.scene.sleep("GameScene");
      this.scene.run("InventoryScene", this.customData);
    });

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
      playerInfo: this.playerInfo,
      onDead: this.onPlayerDead
    });
    this.add.existing(this.player);

    this.hpPotion = new Item({
      scene: this,
      x: CELL_SIZE * 1.5,
      y: CELL_SIZE * 8.5,
      itemInfo: this.inventory.itemsInfo[0],
      onClick: this.onPotionClick
    });
  }

  update(time, delta) {
    if (this.monsters) {
      this.monsters.forEach(m => m.update(time, delta));
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
    const { monsterInfo } = monster;
    const damage = this.сalculator.toMonster(this.playerInfo, monsterInfo);
    monster.hit(damage);
  };

  onMonsterDead = monster => {
    const { monsterInfo } = monster;

    monster.destroy();
    this.battlefield.removeMonster(monsterInfo.lineIndex, monsterInfo.rowIndex);

    this.coinAnimate(monster);

    if (this.battlefield.isEmpty(monsterInfo.lineIndex)) {
      const monsters = this.monsters.filter(
        m => m.monsterInfo.lineIndex > monsterInfo.lineIndex && !m.isDead
      );

      monsters.forEach(m => m.moveForward());
      if (monsters.some(m => !m.isDead)) {
        this.tweens.add({
          targets: this.background,
          tilePositionX: this.background.tilePositionX + CELL_SIZE,
          ease: "Sine.easeInOut",
          duration: 1000
        });
      }
    }

    if (this.monsters.every(m => m.isDead || m.monsterInfo.isPermanent)) {
      this.wave++;
      if (this.wave > 10) {
        this.scene.start("WinScene");
      } else {
        this.mustSpawn = true;
        this.setHeader(this.wave);
      }
    }
  };

  onPlayerDead = () => {
    this.scene.start("GameOverScene");
  };

  onMosterAttack = monster => {
    const { monsterInfo } = monster;
    const damage = this.сalculator.toPlayer(monsterInfo, this.playerInfo);
    this.player.hit(damage);
  };

  onPotionClick = potion => {
    const { itemInfo } = potion;
    if (itemInfo && itemInfo.count > 0) {
      this.inventory.remove(itemInfo);
      //potion.refresh();
      this.player.regenerate(itemInfo.recoveryCount, itemInfo.recoveryTime);
    }
  };

  onKeyPressed = event => {
    if (event.key == "1") {
      this.onPotionClick(this.hpPotion);
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
        onAttack: this.onMosterAttack,
        onDead: this.onMonsterDead,
        battlefield: this.battlefield,
        player: this.player
      });

      this.add.existing(monster);
      return monster;
    });
  }

  coinAnimate(monster) {
    const coin = this.add.sprite(
      monster.x + CELL_SIZE / 2,
      monster.y + CELL_SIZE / 2,
      "coin"
    );
    coin.anims.play("flip");
    coin.once("animationcomplete", () => {
      coin.destroy();
    });

    this.tweens.add({
      targets: coin,
      y: monster.y + CELL_SIZE / 2 - 30,
      /*alpha: 0.5,*/
      ease: "Sine.easeInOut",
      duration: 400
    });
  }
}
