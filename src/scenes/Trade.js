import Phaser from "phaser";
import ItemsContainer from "../containers/items/ItemsContainer";

const X = 200;
const Y = 400;

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "TradeScene" });
  }
  init(data) {
    this.customData = data;
  }
  preload() {}

  create() {
    const { inventory, traderInventory } = this.customData;
    this.cameras.main.setBackgroundColor(0x34c70e);

    const castle = this.add.sprite(150, 50, "castle").setInteractive();
    castle.on("pointerdown", () => {
      this.scene.start("CastleScene");
    });

    const onTraderItemClick = item => {
      inventory.add(item.itemInfo);
      traderInventory.remove(item.itemInfo);
    };

    const onPlayerItemClick = item => {
      inventory.remove(item.itemInfo);
      traderInventory.add(item.itemInfo);
    };

    const playerContainer = new ItemsContainer({
      scene: this,
      x: X,
      y: 500,
      rows: inventory.rowsCount,
      columns: inventory.columnsCount,
      onItemClick: onPlayerItemClick,
      showSellPrice: true
    });
    this.add.existing(playerContainer);

    const traderContainer = new ItemsContainer({
      scene: this,
      x: X,
      y: 150,
      rows: traderInventory.rowsCount,
      columns: traderInventory.columnsCount,
      onItemClick: onTraderItemClick,
      isDraggable: false,
      showCost: true
    });
    this.add.existing(traderContainer);

    inventory.addContainer(playerContainer);
    traderInventory.addContainer(traderContainer);

    this.events.on("shutdown", () => {
      inventory.removeContainer(playerContainer);
      traderInventory.removeContainer(traderContainer);
    });
  }
}
