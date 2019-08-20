import Phaser from "phaser";
import ItemsContainer from "../containers/ItemsContainer";

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

    const playerContainer = new ItemsContainer({
      scene: this,
      x: X,
      y: 500,
      rows: inventory.rowsCount,
      columns: inventory.columnsCount,
      onDrop: (gameObject, dropZone) => {
        inventory.moveTo(
          gameObject.itemInfo,
          dropZone.rowIndex,
          dropZone.columnIndex
        );
      }
    });
    this.add.existing(playerContainer);

    const traderContainer = new ItemsContainer({
      scene: this,
      x: X,
      y: 150,
      rows: traderInventory.rowsCount,
      columns: traderInventory.columnsCount,
      isDraggable: false
    });
    this.add.existing(traderContainer);

    const playerItems = playerContainer.fill(inventory.Items);

    traderContainer.fill(traderInventory.Items, item => {
      inventory.add(item.itemInfo);
      traderInventory.remove(item.itemInfo);
    });
  }
}
