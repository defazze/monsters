import Phaser from "phaser";
import { CELL_SIZE, BORDER_WIDTH } from "../../constants/inventory";
import Item from "../Item";
import BaseContainer from "./BaseContainer";
import Tooltip from "../ItemTooltip";

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
    isDraggable = true,
    showCost,
    showSellPrice
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

    this.showCost = showCost;
    this.showSellPrice = showSellPrice;
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

      let tooltip = null;
      item.on("pointerover", pointer => {
        tooltip = new Tooltip({
          scene: this.scene,
          x: pointer.x,
          y: pointer.y,
          rows: this.getDescription(i)
        });
        this.scene.add.existing(tooltip);
      });

      item.on("pointermove", pointer => {
        if (tooltip) {
          tooltip.x = pointer.x;
          tooltip.y = pointer.y;
        }
      });
      item.on("pointerout", pointer => tooltip.destroy());
      item.on("destroy", () => tooltip?.destroy());
      if (this.isDraggable) {
        this.scene.input.setDraggable(item);
      }

      this.items.push(item);
    });
  };

  getDescription = itemInfo => {
    const result = [];
    if (this.showCost) {
      result.push("Cost: " + itemInfo.cost);
    }
    result.push(itemInfo.name);

    if (itemInfo.type == "potion") {
      result.push("recovery " + itemInfo.recoveryCount + " points");
    }

    if (this.showSellPrice) {
      result.push("Sell price: " + itemInfo.cost / 2);
    }

    return result;
  };
}
