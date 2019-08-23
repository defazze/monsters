import Phaser from "phaser";
import { CELL_SIZE, BORDER_WIDTH } from "../../constants/inventory";
import Item from "../Item";
import BaseContainer from "./BaseContainer";

const CELL_COLOR = 0xd2c1c6; /*0x8383838*/
export default class extends BaseContainer {
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
    super({
      scene,
      x,
      y,
      rows,
      columns,
      onItemClick,
      isDraggable,
      cellSize,
      borderWidth
    });

    this.isDraggable = isDraggable;

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
}
