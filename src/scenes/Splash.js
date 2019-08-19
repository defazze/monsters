import Phaser from "phaser";
import InventoryController from "../core/InventoryController";
import { INVENTORY_COLUMNS, INVENTORY_ROWS } from "../constants/inventory";
import ItemsData from "../../data/items.json";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "SplashScene" });
  }

  preload() {
    //
    // load your assets
    //
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
    this.load.spritesheet("coin", "assets/images/coin2.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
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

    const hpPotion = ItemsData.find(
      i => i.type == "potion" && i.resource == "health" && i.grade == 0
    );
    const manaPotion = ItemsData.find(
      i => i.type == "potion" && i.resource == "mana" && i.grade == 0
    );

    playerInventory.add(hpPotion, 2);
    traderInventory.add(hpPotion, 100);
    traderInventory.add(manaPotion, 100);

    playerInventory.add;
    this.scene.start("GameScene", {
      inventory: playerInventory,
      traderInventory
    });
  }

  update() {}
}
