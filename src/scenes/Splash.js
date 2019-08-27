import Phaser from "phaser";
import InventoryController from "../core/InventoryController";
import { INVENTORY_COLUMNS, INVENTORY_ROWS } from "../constants/inventory";
import ItemsData from "../../data/items.json";
import Treasures from "../../data/treasures.json";
import Builder from "../core/PlayerBuilder";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "SplashScene" });
  }

  preload() {
    //
    // load your assets
    //
    this.load.image("approve", "assets/images/approve.png");
    this.load.image("decline", "assets/images/decline.png");
    this.load.image("mushroom", "assets/images/mushroom2.png");
    this.load.image("pokemon", "assets/images/Pokemon2.jpg");
    this.load.image("bat", "assets/images/bat1.png");
    this.load.image("hedgehog", "assets/images/hedgehog2.png");
    this.load.image("undead_archer", "assets/images/undead_archer.png");
    this.load.image("arrow", "assets/images/arrow.png");
    this.load.image("chest", "assets/images/chest.png");
    this.load.image("hero", "assets/images/hero.png");
    this.load.image("hp-potion", "assets/images/hp-potion2.png");
    this.load.image("mana-potion", "assets/images/mana-potion2.png");
    this.load.image("castle", "assets/images/castle.png");
    this.load.image("castle-big", "assets/images/castle-big.png");
    this.load.image("battlefield", "assets/images/battlefield.png");
    this.load.image("inventory", "assets/images/inventory.png");
    this.load.image("inventory-icon", "assets/images/inventory-icon.png");
    this.load.image("grass", "assets/images/grass2.png");
    this.load.image("store", "assets/images/store.png");
    this.load.image("coins", "assets/images/coins.png");
    this.load.spritesheet("coin", "assets/images/coin2.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("knight-idle", "assets/images/knight_idle.png", {
      frameWidth: 45,
      frameHeight: 64
    });
    this.load.spritesheet("knight-attack", "assets/images/knight-attack.png", {
      frameWidth: 124,
      frameHeight: 64
    });
    this.load.spritesheet("knight-walk", "assets/images/knight_walk.png", {
      frameWidth: 51,
      frameHeight: 64
    });
    this.load.spritesheet("knight-hurt", "assets/images/knight_hurt.png", {
      frameWidth: 51,
      frameHeight: 64
    });

    this.load.atlas(
      "knight",
      "assets/images/knight-atlas.png",
      "assets/atlas/knight-atlas.json"
    );
  }

  create() {
    this.anims.create({
      key: "knight-attack",
      frames: this.anims.generateFrameNames("knight", {
        prefix: "attack",
        end: 6,
        zeroPad: 2
      }),
      repeat: 0
    });
    this.anims.create({
      key: "knight-idle",
      frames: this.anims.generateFrameNames("knight", {
        prefix: "idle",
        end: 6,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "knight-walk",
      frames: this.anims.generateFrameNames("knight", {
        prefix: "walk",
        end: 6,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "knight-hurt",
      frames: this.anims.generateFrameNames("knight", {
        prefix: "hurt",
        end: 2,
        zeroPad: 2
      }),
      frameRate: 10,
      repeat: 0
    });

    const playerInventory = new InventoryController({
      rowsCount: INVENTORY_ROWS,
      columnsCount: INVENTORY_COLUMNS,
      itemsData: ItemsData
    });

    const traderInventory = new InventoryController({
      rowsCount: INVENTORY_ROWS,
      columnsCount: INVENTORY_COLUMNS,
      itemsData: ItemsData
    });

    const hpPotion = ItemsData.find(i => i.code == "hpPotion0");
    const manaPotion = ItemsData.find(i => i.code == "manaPotion0");

    playerInventory.add(hpPotion, 2);
    traderInventory.add(hpPotion, 100);
    traderInventory.add(manaPotion, 100);
    traderInventory.addGold(5000);

    const builder = new Builder();
    const playerInfo = builder.build();

    this.scene.start("GameScene", {
      inventory: playerInventory,
      traderInventory,
      treasures: Treasures,
      items: ItemsData,
      playerInfo,
      currentZone: "tutorial",
      currentWave: 1
    });
  }

  update() {}
}
