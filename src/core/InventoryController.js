import Phaser from "phaser";

export default class {
  constructor({ rowsCount, columnsCount }) {
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.itemsInfo = [];
    this.inventory = new Array(rowsCount).fill(
      new Array(columnsCount).fill(null)
    );
  }

  add(itemInfo, count = 1) {
    const addNewItem = () => {
      itemInfo = { ...itemInfo };
      const emptyCell = this.getFirstEmptyCell();
      itemInfo.rowIndex = emptyCell.rowIndex;
      itemInfo.columnIndex = emptyCell.columnIndex;
      this.inventory[itemInfo.rowIndex][itemInfo.columnIndex] = itemInfo;
      itemInfo.count = itemInfo.stackable ? count : 1;
      this.Items.push(itemInfo);
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
  }

  remove(itemInfo) {
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
  }

  moveTo(itemInfo, rowIndex, columnIndex) {
    this.inventory[itemInfo.rowIndex][itemInfo.columnIndex] = null;
    this.inventory[rowIndex][columnIndex] = itemInfo;
    itemInfo.rowIndex = rowIndex;
    itemInfo.columnIndex = columnIndex;
  }

  getFirstEmptyCell() {
    for (var i = 0; i < this.rowsCount; i++) {
      for (var j = 0; j < this.columnsCount; j++) {
        if (!this.inventory[i][j]) {
          return { rowIndex: i, columnIndex: j };
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
}
