import Phaser from "phaser";
import { INVENTORY_COLUMNS, INVENTORY_ROWS } from "../constants/inventory";
import ItemData from "../../data/items.json";

export default class {
  constructor() {
    this.itemsInfo = [];
    this.inventory = new Array(INVENTORY_ROWS).fill(
      new Array(INVENTORY_COLUMNS).fill(null)
    );
  }

  add(itemInfo) {
    const addNewItem = () => {
      const emptyCell = this.getFirstEmptyCell();
      itemInfo.row = emptyCell.row;
      itemInfo.column = emptyCell.column;
      this.inventory[itemInfo.row][itemInfo.column] = itemInfo;
      itemInfo.count = 1;
      this.Items.push(itemInfo);
    };

    if (itemInfo.stackable) {
      const existingItem = this.findStackableItem(itemInfo);

      if (existingItem) {
        existingItem.count++;
      } else {
        addNewItem();
      }
    } else {
      addNewItem();
    }
  }

  remove(itemInfo) {
    const removeItem = () => {
      Phaser.Utils.Array.Remove(this.Items, itemInfo);
      this.inventory[itemInfo.row][itemInfo.column] = null;
    };

    if (itemInfo.stackable) {
      itemInfo.count--;

      if (itemInfo.count == 0) {
        removeItem();
      }
    } else {
      removeItem();
    }
  }

  moveTo(itemInfo, rowIndex, columnIndex) {
    this.inventory[itemInfo.row][itemInfo.column] = null;
    this.inventory[(rowIndex, columnIndex)] = itemInfo;
    itemInfo.row = rowIndex;
    itemInfo.column = columnIndex;
  }

  getFirstEmptyCell() {
    for (var i = 0; i < INVENTORY_ROWS; i++) {
      for (var j = 0; j < INVENTORY_COLUMNS; j++) {
        if (!this.inventory[i][j]) {
          return { row: i, column: j };
        }
      }
    }

    return null;
  }

  findStackableItem(itemInfo) {
    if (itemInfo.type == "potion") {
      const existingItem = this.Items.find(
        i => i.grade == itemInfo.grade && i.resource == itemInfo.resource
      );

      return existingItem;
    }

    return null;
  }

  get Items() {
    return this.itemsInfo;
  }

  get AllItems() {
    return ItemData;
  }
}
