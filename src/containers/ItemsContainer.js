import Phaser from "phaser";
import { CELL_SIZE, BORDER_WIDTH } from "../constants/inventory";
import Item from "../containers/Item";

const CELL_COLOR = 0xd2c1c6; /*0x8383838*/
export default class extends Phaser.GameObjects.Container {
  constructor({
    scene,
    x,
    y,
    rows,
    columns,
    onDrop,
    onItemClick,
    cellSize = CELL_SIZE,
    borderWidth = BORDER_WIDTH,
    isDraggable = true
  }) {
    super(scene, x, y);

    this.scene = scene;
    this.isDraggable = isDraggable;
    this.borderWidth = borderWidth;
    this.cellSize = cellSize;
    this.onItemClick = onItemClick;

    const backgroundWidth = columns * cellSize + (columns + 1) * borderWidth;
    const backgroundHeight = rows * cellSize + (rows + 1) * borderWidth;

    const background = scene.add.rectangle(
      backgroundWidth / 2,
      backgroundHeight / 2,
      backgroundWidth,
      backgroundHeight,
      0xffffff
    );
    this.add(background);

    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        const x = cellSize * (i + 0.5) + borderWidth * (i + 1);
        const y = cellSize * (j + 0.5) + borderWidth * (j + 1);

        const cell = scene.add.rectangle(x, y, cellSize, cellSize, CELL_COLOR);

        cell.setInteractive(undefined, undefined, isDraggable);

        cell.columnIndex = i;
        cell.rowIndex = j;

        this.add(cell);
      }
    }

    if (isDraggable) {
      scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      scene.input.on("dragenter", (pointer, gameObject, dropZone) => {
        dropZone.setFillStyle(0x777676, 1);
      });

      scene.input.on("dragleave", (pointer, gameObject, dropZone) => {
        dropZone.setFillStyle(CELL_COLOR, 1);
      });

      scene.input.on("drop", (pointer, gameObject, dropZone) => {
        gameObject.x = dropZone.x + this.x;
        gameObject.y = dropZone.y + this.y;

        if (onDrop) {
          onDrop(gameObject, dropZone);
        }

        this.emitter.emit(
          "onDrop",
          gameObject.itemInfo,
          dropZone.rowIndex,
          dropZone.columnIndex
        );

        dropZone.setFillStyle(CELL_COLOR, 1);
      });

      scene.input.on("dragend", (pointer, gameObject, dropped) => {
        if (!dropped) {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
      });
    }
  }

  items = [];
  emitter = new Phaser.Events.EventEmitter();

  addItems = itemsInfo => {
    if (!Array.isArray(itemsInfo)) {
      itemsInfo = [itemsInfo];
    }
    itemsInfo.forEach(i => {
      const x = this.getItemX(i.columnIndex);
      const y = this.getItemY(i.rowIndex);
      const item = new Item({
        scene: this.scene,
        x,
        y,
        itemInfo: i,
        onClick: this.onItemClick
      });

      if (this.isDraggable) {
        this.scene.input.setDraggable(item);
      }

      this.items.push(item);
    });
  };

  getItemX = columnIndex => {
    return (
      this.x +
      this.borderWidth * (columnIndex + 1) +
      this.cellSize * (columnIndex + 0.5)
    );
  };

  getItemY = rowIndex => {
    return (
      this.y +
      this.borderWidth * (rowIndex + 1) +
      this.cellSize * (rowIndex + 0.5)
    );
  };
}
