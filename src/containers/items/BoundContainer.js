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
    onItemClick,
    boundItemsTypes = [],
    cellSize = CELL_SIZE,
    borderWidth = BORDER_WIDTH
  }) {
    super({
      scene,
      x,
      y,
      rows: 1,
      columns: boundItemsTypes.length,
      onItemClick,
      cellSize,
      borderWidth
    });

    this.itemsTypes = boundItemsTypes;
    this.bounds = new Map();
    this.itemsTypes.forEach(i => this.bounds.set(i, null));
  }

  keyPress(key) {
    if (key != "1" && key != "2") {
      return;
    }
    const index = +key - 1;

    const item = this.bounds.get(this.itemsTypes[index]);
    if (item) {
      this.onItemClick(item);
    }
  }

  addItems = itemsInfo => {
    if (!Array.isArray(itemsInfo)) {
      itemsInfo = [itemsInfo];
    }

    itemsInfo.forEach(i => {
      const index = this.itemsTypes.indexOf(i.code);
      if (index != -1) {
        const x = this.getItemX(index);
        const y = this.getItemY(0);
        const item = new Item({
          scene: this.scene,
          x,
          y,
          itemInfo: i,
          onClick: this.onItemClick
        });

        this.bounds.set(i.code, item);
        this.items.push(item);
      }
    });
  };
}
