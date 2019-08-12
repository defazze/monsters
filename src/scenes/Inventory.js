import Phaser from "phaser";

const CELL_SIZE = 48;
const BORDER_WIDTH = 4;
const COLUMNS = 12;
const ROWS = 6;
const X = 200;
const Y = 400;

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "InventoryScene" });
  }
  init() {}
  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0x34c70e);

    const battlefield = this.add
      .sprite(150, 50, "battlefield")
      .setInteractive();
    battlefield.on("pointerdown", () => this.scene.switch("GameScene"));

    const backgroundWidth = COLUMNS * CELL_SIZE + (COLUMNS + 1) * BORDER_WIDTH;
    const backgroundHeight = ROWS * CELL_SIZE + (ROWS + 1) * BORDER_WIDTH;

    const background = this.add.rectangle(
      X + backgroundWidth / 2,
      Y + backgroundHeight / 2,
      backgroundWidth,
      backgroundHeight,
      0xffffff
    );

    for (var i = 0; i < COLUMNS; i++) {
      for (var j = 0; j < ROWS; j++) {
        const x = X + CELL_SIZE * (i + 0.5) + BORDER_WIDTH * (i + 1);
        const y = Y + CELL_SIZE * (j + 0.5) + BORDER_WIDTH * (j + 1);

        const cell = this.add.rectangle(x, y, CELL_SIZE, CELL_SIZE, 0x838383);
        cell.setInteractive(undefined, undefined, true);

        cell.columnIndex = i;
        cell.rowIndex = j;
      }
    }

    const potion = this.add
      .image(
        X + BORDER_WIDTH + CELL_SIZE / 2,
        Y + BORDER_WIDTH + CELL_SIZE / 2,
        "hp-potion"
      )
      .setInteractive();

    this.input.setDraggable(potion);

    this.input.on("drag", function(pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragenter", function(pointer, gameObject, dropZone) {
      dropZone.setFillStyle(0x777676, 1);
    });

    this.input.on("dragleave", function(pointer, gameObject, dropZone) {
      dropZone.setFillStyle(0x838383, 1);
    });

    this.input.on("drop", function(pointer, gameObject, dropZone) {
      gameObject.x = dropZone.x;
      gameObject.y = dropZone.y;

      dropZone.setFillStyle(0x838383, 1);
    });

    this.input.on("dragend", function(pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });
  }
}
