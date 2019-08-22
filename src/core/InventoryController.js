import Phaser from "phaser";
import { observable } from "../utils/Observable";

export default class {
  constructor({ rowsCount, columnsCount }) {
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.inventory = new Array(rowsCount).fill(
      new Array(columnsCount).fill(null)
    );
  }

  gold = observable({ count: 0 });
  itemsInfo = [];
  containers = [];

  addContainer = container => {
    this.containers.push(container);
    container.addItems(this.itemsInfo);
    container.emitter.on("onDrop", this.moveTo);
  };

  removeContainer = container => {
    this.containers = this.containers.filter(c => c != container);
    container.emitter.off("onDrop", this.moveTo);
  };

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
      this.containers.forEach(c => c.addItems(itemInfo));
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

  addGold(gold) {
    this.gold.count += gold;
  }

  removeGold(gold) {
    this.gold.count -= gold;
  }

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
