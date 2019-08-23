import { CELL_SIZE } from "../constants/common";

import Phaser from "phaser";

export default class {
  constructor() {}

  monsters = [];

  removeMonster(lineIndex, rowIndex) {
    this.monsters = this.monsters.filter(
      m => m.lineIndex != lineIndex || m.rowIndex != rowIndex
    );
  }

  setMonster(monsterInfo) {
    const enableLines = [4, 5, 6, 7].filter(i => {
      const count = this.getMonstersCount(i);
      return count > 0 && count < 7;
    });

    const firstEmpty = [4, 5, 6, 7].find(i => this.getMonstersCount(i) == 0);
    if (firstEmpty) {
      enableLines.push(firstEmpty);
    }

    const priorityLines = (monsterInfo.priorityLines || [4, 5, 6, 7]).filter(
      l => enableLines.some(a => a == l)
    );

    let monsterLineIndex = this.getLineByPriority(priorityLines);

    if (monsterLineIndex == -1) {
      monsterLineIndex = Phaser.Utils.Array.GetRandom(enableLines);
    }

    let monsterRowIndex = 0;
    if (monsterLineIndex == 4 && this.isEmpty(4)) {
      monsterRowIndex = 3;
    } else {
      monsterRowIndex = Phaser.Utils.Array.GetRandom(
        [0, 1, 2, 3, 4, 5, 6].filter(
          a =>
            !this.monsters
              .filter(m => m.lineIndex == monsterLineIndex)
              .map(m => m.rowIndex)
              .includes(a)
        )
      );
    }

    monsterInfo.lineIndex = monsterLineIndex;
    monsterInfo.rowIndex = monsterRowIndex;

    this.monsters.push(monsterInfo);

    return {
      x: (monsterLineIndex + 2) * CELL_SIZE,
      y: (monsterRowIndex + 1) * CELL_SIZE
    };
  }

  getLineByPriority(priorityLines) {
    if (priorityLines.length == 0) {
      return -1;
    }
    const p = 80;

    for (var i = 0; i < priorityLines.length; i++) {
      const chance = Phaser.Math.RND.between(1, 100);
      if (chance <= p || i == priorityLines.length - 1) {
        return priorityLines[i];
      }
    }
  }

  getMonstersCount = lineIndex =>
    this.monsters.filter(m => m.lineIndex == lineIndex).length;

  isEmpty = lineIndex => this.getMonstersCount(lineIndex) == 0;
}
