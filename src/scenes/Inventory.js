import Phaser from "phaser";
import { INVENTORY_COLUMNS, INVENTORY_ROWS } from "../constants/inventory";
import Item from "../graphics/Item";

const CELL_SIZE = 48;
const BORDER_WIDTH = 4;
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
    this.cameras.main.setBackgroundColor(0x34c70e);

    const battlefield = this.add
      .sprite(150, 50, "battlefield")
      .setInteractive();
    battlefield.on("pointerdown", () => {
      this.scene.stop("InventoryScene");
      this.scene.start("GameScene", this.customData);
    });

    const backgroundWidth =
      INVENTORY_COLUMNS * CELL_SIZE + (INVENTORY_COLUMNS + 1) * BORDER_WIDTH;
    const backgroundHeight =
      INVENTORY_ROWS * CELL_SIZE + (INVENTORY_ROWS + 1) * BORDER_WIDTH;

    const background = this.add.rectangle(
      X + backgroundWidth / 2,
      Y + backgroundHeight / 2,
      backgroundWidth,
      backgroundHeight,
      0xffffff
    );

    for (var i = 0; i < INVENTORY_COLUMNS; i++) {
      for (var j = 0; j < INVENTORY_ROWS; j++) {
        const x = X + CELL_SIZE * (i + 0.5) + BORDER_WIDTH * (i + 1);
        const y = Y + CELL_SIZE * (j + 0.5) + BORDER_WIDTH * (j + 1);

        const cell = this.add.rectangle(x, y, CELL_SIZE, CELL_SIZE, 0x838383);
        cell.setInteractive(undefined, undefined, true);

        cell.columnIndex = i;
        cell.rowIndex = j;
      }
    }

    this.customData.inventory.Items.forEach(i => {
      const x =
        X + BORDER_WIDTH * (i.column + 1) + CELL_SIZE * (i.column + 0.5);
      const y = Y + BORDER_WIDTH * (i.row + 1) + CELL_SIZE * (i.row + 0.5);
      const itemObject = new Item({ scene: this, x, y, itemInfo: i });

      this.input.setDraggable(itemObject);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragenter", (pointer, gameObject, dropZone) => {
      dropZone.setFillStyle(0x777676, 1);
    });

    this.input.on("dragleave", (pointer, gameObject, dropZone) => {
      dropZone.setFillStyle(0x838383, 1);
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      gameObject.x = dropZone.x;
      gameObject.y = dropZone.y;

      dropZone.setFillStyle(0x838383, 1);
    });

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }
}
