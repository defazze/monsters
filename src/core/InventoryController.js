import Phaser from "phaser";
import { observable } from "../utils/Observable";

export default class {
  constructor({ rowsCount, columnsCount }) {
    this.emitter = new Phaser.Events.EventEmitter();

    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.itemsInfo = [];
    this.inventory = new Array(rowsCount).fill(
      new Array(columnsCount).fill(null)
    );
  }

  add = (itemInfo, count = 1) => {
    const addNewItem = () => {
      const emptyCell = this.getFirstEmptyCell();

      itemInfo = observable({
        ...itemInfo,
        count: itemInfo.stackable ? count : 1,
        rowIndex: emptyCell.rowIndex,
        columnIndex: emptyCell.columnIndex
      });

      this.inventory[itemInfo.rowIndex][itemInfo.columnIndex] = itemInfo;
      this.Items.push(itemInfo);
      this.emitter.emit("onAddNew", itemInfo);
    };

    if (itemInfo.stackable) {
      const existingItem = this.findStackableItem(itemInfo);

      if (existingItem) {
        existingItem.count += count;
      } else {
        addNewItem();
      }
    } else {
      addNewItem();
    }
  };

  remove = itemInfo => {
    const removeItem = () => {
      Phaser.Utils.Array.Remove(this.Items, itemInfo);
      this.inventory[itemInfo.rowIndex][itemInfo.columnIndex] = null;
    };

    if (itemInfo.stackable) {
      itemInfo.count--;

      if (itemInfo.count == 0) {
        removeItem();
      }
    } else {
      removeItem();
    }
  };

  moveTo = (itemInfo, rowIndex, columnIndex) => {
    this.inventory[itemInfo.rowIndex][itemInfo.columnIndex] = null;
    this.inventory[rowIndex][columnIndex] = itemInfo;
    itemInfo.rowIndex = rowIndex;
    itemInfo.columnIndex = columnIndex;
  };

  getFirstEmptyCell = () => {
    for (var i = 0; i < this.rowsCount; i++) {
      for (var j = 0; j < this.columnsCount; j++) {
        if (!this.inventory[i][j]) {
          return { rowIndex: i, columnIndex: j };
        }
      }
    }

    return null;
  };

  findStackableItem = itemInfo => {
    if (itemInfo.type == "potion") {
      const existingItem = this.itemsInfo.find(
        i => i.grade == itemInfo.grade && i.resource == itemInfo.resource
      );

      return existingItem;
    }

    return null;
  };

  get Items() {
    return this.itemsInfo;
  }
}
