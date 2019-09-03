/* globals __DEV__ */
import Phaser from "phaser";

import { createMonster } from "../containers/Monster";
import BattlefieldController from "../core/BattlefieldController";

import { CELL_SIZE } from "../constants/common";

import { Player } from "../containers/Player";
import Gold from "../containers/Gold";
import DropAnimator from "../utils/DropAnimator";
import BoundContainer from "../containers/items/BoundContainer";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(gameData) {
    this.gameData = gameData;
  }

  preload() {}

  create() {
    this.monsters = [];
    this.inventory = this.gameData.inventory;
    this.dropAnimator = new DropAnimator(this);

    this.cameras.main.setBackgroundColor(0x8ee5ee);
    this.physics.world.setBounds(
      CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE * 9,
      CELL_SIZE * 7
    );
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.physics.world.on("worldbounds", g => {
      if (g.gameObject.isArrow) {
        g.gameObject.destroy();
      }
    });

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

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

    this.battlefieldController = new BattlefieldController(this, this.gameData);

    const player = new Player({
      scene: this,
      x: CELL_SIZE * 4.5,
      y: CELL_SIZE * 4.5,
      playerInfo: this.gameData.playerInfo,
      onDead: this.onPlayerDead
    });

    this.playerInfo = player.actorInfo;
    this.player = this.add.existing(player);
    this.physics.world.enable(this.player);
    this.player.body.setCollideWorldBounds(true);
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
      this.events.off("onGenerateMonsters");
      this.events.off("onMonsterAttack");
      this.events.off("onPlayerAttack");
    });

    this.events.emit("onGenerateMonsters");
  }

  update(time, delta) {
    const { body } = this.player;
    if (this.keyW.isDown) {
      body.setVelocityY(-200);
    } else if (this.keyS.isDown) {
      body.setVelocityY(200);
    } else {
      body.setVelocityY(0);
    }

    if (this.monsters) {
      this.monsters.forEach(m => m.update(time, delta));
    }

    this.player.update(time, delta);
  }

  onMonsterClick = monster => {
    this.player.attack();
    const { monsterInfo } = monster;
    this.events.emit("onPlayerAttack", monsterInfo, this.playerInfo);
  };

  dropAnimate(drops, monsterInfo) {
    this.dropAnimator.animate(drops, monsterInfo.x, monsterInfo.y);
  }

  win() {
    this.scene.start("WinScene");
  }

  loose() {
    this.gameData.knight = {
      x: this.player.x + this.player.sprite.x,
      y: this.player.y + this.player.sprite.y
    };
    this.scene.pause("GameScene");
    this.scene.launch("TransitionScene", this.gameData);
  }

  walkPlayer(shift) {
    this.player.walk();
    this.tweens.add({
      targets: this.background,
      tilePositionX: this.background.tilePositionX + shift,
      ease: "Sine.easeInOut",
      duration: (Math.abs(shift) / CELL_SIZE / 2.5) * 1000,
      onComplete: () => this.player.idle()
    });
  }

  walkMonsters(monstersInfo, shift) {
    this.monsters
      .filter(m => monstersInfo.includes(m.monsterInfo))
      .forEach(m => {
        this.tweens.add({
          targets: m,
          x: m.x + shift,
          ease: "Sine.easeInOut",
          duration: (Math.abs(shift) / CELL_SIZE / 2.5) * 1000
        });
      });
  }

  hurtPlayer() {
    this.player.hurt();
  }

  onMosterAttack = monster => {
    const { monsterInfo } = monster;
    this.events.emit("onMonsterAttack", monsterInfo, this.playerInfo);
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

  addMonsters(monstersInfo) {
    this.monsters = this.monsters.filter(m => !m.isDead);

    const newMonsters = monstersInfo.map(monsterInfo => {
      const monster = createMonster({
        scene: this,
        monsterInfo,
        onMonsterClick: this.onMonsterClick,
        onMonsterAttack: this.onMosterAttack,
        player: this.player
      });
      this.add.existing(monster);
      return monster;
    });

    this.monsters.push(...newMonsters);
    return newMonsters.map(m => m.monsterInfo);
  }
}
