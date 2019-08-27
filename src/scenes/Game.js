/* globals __DEV__ */
import Phaser from "phaser";

import { Monster } from "../containers/Monster";
import Generator from "../core/MonsterGenerator";
import Calculator from "../core/DamageCalculator";

import {
  CELL_SIZE,
  SPAWN_DELAY,
  MONSTER_AREA,
  FIRST_MONSTER_LINE
} from "../constants/common";
import { GOLD } from "../constants/drop";

import { Player } from "../containers/Player";
import Battlefield from "../core/FieldController.js";
import Gold from "../containers/Gold";
import DropController from "../core/DropController";
import DropAnimator from "../utils/DropAnimator";
import BoundContainer from "../containers/items/BoundContainer";

import Zones from "../../data/zones.json";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.gameData = data;
  }

  preload() {}

  create() {
    this.monsters = [];
    this.inventory = this.gameData.inventory;
    const { treasures, items } = this.gameData;
    this.dropController = new DropController(treasures, items);
    this.dropAnimator = new DropAnimator(this);

    this.spawnTime = 0;
    this.spawnDelayRun = false;

    this.cameras.main.setBackgroundColor(0x8ee5ee);

    this.background = this.add.tileSprite(
      CELL_SIZE + (CELL_SIZE * 9) / 2,
      CELL_SIZE + (CELL_SIZE * 7) / 2,
      CELL_SIZE * 11,
      CELL_SIZE * 7,
      "grass"
    );

    const castleIcon = this.add.sprite(150, 50, "castle").setInteractive();
    castleIcon.on("pointerdown", () =>
      this.scene.start("CastleScene", this.gameData)
    );

    const inventoryIcon = this.add
      .sprite(229, 50, "inventory-icon")
      .setInteractive();
    inventoryIcon.on("pointerdown", () => {
      this.scene.sleep("GameScene");
      this.scene.run("InventoryScene", this.gameData);
    });

    this.input.keyboard.on("keydown", this.onKeyPressed);

    this.battlefield = new Battlefield();
    this.generator = new Generator(this.battlefield);
    this.сalculator = new Calculator();

    this.mustSpawn = true;

    this.playerInfo = this.gameData.playerInfo;
    this.player = new Player({
      scene: this,
      x: CELL_SIZE * 4,
      y: CELL_SIZE * 4,
      playerInfo: this.playerInfo,
      onDead: this.onPlayerDead
    });
    this.add.existing(this.player);
    this.player.idle();

    const gold = new Gold({
      scene: this,
      x: 700,
      y: 50,
      goldObject: this.inventory.gold
    });

    this.fastItems = new BoundContainer({
      scene: this,
      x: CELL_SIZE * 1,
      y: CELL_SIZE * 8.25,
      onItemClick: this.onPotionClick,
      boundItemsTypes: ["hpPotion0", "manaPotion0"]
    });
    this.add.existing(this.fastItems);
    this.inventory.addContainer(this.fastItems);
    this.events.on("shutdown", () => {
      this.inventory.removeContainer(this.fastItems);
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
    this.player.attack();
    const { monsterInfo } = monster;
    const damage = this.сalculator.toMonster(this.playerInfo, monsterInfo);
    monster.hit(damage);
  };

  onMonsterDead = monster => {
    const { monsterInfo } = monster;
    const { lineIndex } = monsterInfo;
    const drops = this.dropController.calculate(monsterInfo);
    this.dropAnimator.animate(drops, monster.x, monster.y);
    drops.forEach(d =>
      d.code == GOLD ? this.inventory.addGold(d.count) : this.inventory.add(d)
    );

    monster.destroy();
    this.battlefield.removeMonster(lineIndex, monsterInfo.rowIndex);

    if (this.monsters.every(m => m.isDead || m.monsterInfo.isPermanent)) {
      this.gameData.currentWave++;
      if (this.gameData.currentWave > Zones[0].min.length) {
        this.scene.start("WinScene");
      } else {
        this.mustSpawn = true;
      }
    } else {
      if (this.battlefield.isEmpty(lineIndex)) {
        if (lineIndex == FIRST_MONSTER_LINE) {
          const monsters = this.monsters.filter(m => !m.isDead);
          monsters.forEach(m => m.moveForward());
          this.player.walk();
          this.tweens.add({
            targets: this.background,
            tilePositionX: this.background.tilePositionX + CELL_SIZE,
            ease: "Sine.easeInOut",
            duration: 1000,
            onComplete: () => this.player.idle()
          });
        } else {
          const monsters = this.monsters.filter(
            m =>
              m.monsterInfo.lineIndex > lineIndex &&
              !m.isDead &&
              !m.monsterInfo.isPermanent
          );
          monsters.forEach(m => m.moveForward());
        }
      }
    }
  };

  onPlayerDead = () => {
    this.scene.start("GameOverScene");
  };

  onMosterAttack = monster => {
    const { monsterInfo } = monster;
    const damage = this.сalculator.toPlayer(monsterInfo, this.playerInfo);

    if (damage > 0) {
      this.player.hit(damage);
      this.player.hurt();
    }
  };

  onPotionClick = potion => {
    const { itemInfo } = potion;
    if (itemInfo && itemInfo.count > 0) {
      this.inventory.remove(itemInfo);
      this.player.regenerate(itemInfo.recoveryCount, itemInfo.recoveryTime);
    }
  };

  onKeyPressed = event => {
    this.fastItems.keyPress(event.key);
  };

  monstersGenerate() {
    const monstersInfo = this.generator.generate(this.gameData.currentWave);

    this.monsters = this.monsters.filter(m => !m.isDead);

    this.monsters = this.monsters.concat(
      monstersInfo.map(monsterInfo => {
        const monster = new Monster({
          scene: this,
          x: monsterInfo.x,
          y: monsterInfo.y,
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
      })
    );

    this.monsters.forEach(m => {
      m.monsterInfo.x -= MONSTER_AREA * CELL_SIZE;
      this.tweens.add({
        targets: m,
        x: m.monsterInfo.x,
        ease: "Sine.easeInOut",
        duration: 2000
      });
    });

    this.tweens.add({
      targets: this.background,
      tilePositionX: this.background.tilePositionX + MONSTER_AREA * CELL_SIZE,
      ease: "Sine.easeInOut",
      duration: 2000,
      onComplete: () => {
        this.player.idle();
      }
    });

    this.player.setDepth(1);
    this.player.walk();
  }
}
