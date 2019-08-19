import Phaser from "phaser";
import Item from "../containers/Item";
import ItemsContainer from "../containers/ItemsContainer";

const X = 200;
const Y = 400;

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "InventoryScene" });
  }
  init(data) {
    this.customData = data;
  }
  preload() {}

  create() {
    const { inventory } = this.customData;
    this.cameras.main.setBackgroundColor(0x34c70e);

    const battlefield = this.add
      .sprite(150, 50, "battlefield")
      .setInteractive();
    battlefield.on("pointerdown", () => {
      this.scene.stop("InventoryScene");
      this.scene.run("GameScene", this.customData);
    });

    const itemsContainer = new ItemsContainer({
      scene: this,
      x: X,
      y: Y,
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

    this.add.existing(itemsContainer);

    inventory.Items.forEach(i => {
      const x = itemsContainer.getItemX(i.columnIndex);
      const y = itemsContainer.getItemY(i.rowIndex);
      const itemObject = new Item({ scene: this, x, y, itemInfo: i });

      this.input.setDraggable(itemObject);
    });
  }
}