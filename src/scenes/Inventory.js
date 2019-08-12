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

    //this.add.sprite(528, 432, "inventory");

    const background = this.add.graphics();
    background.fillStyle(0xffffff, 1);
    background.fillRect(
      X,
      Y,
      COLUMNS * CELL_SIZE + (COLUMNS + 1) * BORDER_WIDTH,
      ROWS * CELL_SIZE + (ROWS + 1) * BORDER_WIDTH
    );

    for (var i = 0; i < COLUMNS; i++) {
      for (var j = 0; j < ROWS; j++) {
        const x = X + CELL_SIZE * i + BORDER_WIDTH * (i + 1);
        const y = Y + CELL_SIZE * j + BORDER_WIDTH * (j + 1);

        const cell = this.add.graphics();
        cell.columnIndex = i;
        cell.rowIndex = j;
        cell.fillStyle(0x838383, 1);
        cell.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        cell.setInteractive(
          new Phaser.Geom.Rectangle(x, y, CELL_SIZE, CELL_SIZE),
          Phaser.Geom.Rectangle.Contains,
          true
        );
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
      console.log("move");
      dropZone.fillStyle(0x777676, 1);
    });

    this.input.on("dragleave", function(pointer, gameObject, dropZone) {
      //dropZone.fillStyle(0x838383, 1);
    });

    this.input.on("drop", function(pointer, gameObject, dropZone) {
      gameObject.x =
        X +
        dropZone.columnIndex * CELL_SIZE +
        (dropZone.columnIndex + 1) * BORDER_WIDTH +
        CELL_SIZE / 2;
      gameObject.y =
        Y +
        dropZone.rowIndex * CELL_SIZE +
        (dropZone.rowIndex + 1) * BORDER_WIDTH +
        CELL_SIZE / 2;

      console.log(dropZone);
      //zone.clearTint();
    });
  }
}
