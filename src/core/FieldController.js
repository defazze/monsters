import {
  CELL_SIZE,
  MONSTER_AREA,
  CENTER_ROW,
  FIRST_MONSTER_LINE
} from "../constants/common";

import Phaser from "phaser";

export default class {
  constructor() {}

  monsters = [];
  LINES = [9, 10, 11, 12];
  ROWS = [0, 1, 2, 3, 4, 5, 6];

  removeMonster(lineIndex, rowIndex) {
    this.monsters = this.monsters.filter(
      m => m.lineIndex != lineIndex || m.rowIndex != rowIndex
    );
  }

  setMonster(monsterInfo) {
    const enableLines = this.LINES.filter(i => {
      const count = this.getMonstersCount(i);
      return count > 0 && count < 7;
    });

    const firstEmpty = this.LINES.find(i => this.getMonstersCount(i) == 0);
    if (firstEmpty) {
      enableLines.push(firstEmpty);
    }

    const priorityLines = (
      monsterInfo.priorityLines.map(l => (l += MONSTER_AREA)) || lines
    ).filter(l => enableLines.some(a => a == l));

    let monsterLineIndex = this.getLineByPriority(priorityLines);

    if (monsterLineIndex == -1) {
      monsterLineIndex = Phaser.Utils.Array.GetRandom(enableLines);
    }

    let monsterRowIndex = 0;
    if (
      monsterLineIndex == FIRST_MONSTER_LINE + MONSTER_AREA &&
      this.isEmpty(FIRST_MONSTER_LINE) &&
      this.isEmpty(FIRST_MONSTER_LINE + MONSTER_AREA)
    ) {
      monsterRowIndex = CENTER_ROW;
    } else {
      monsterRowIndex = Phaser.Utils.Array.GetRandom(
        this.ROWS.filter(
          a =>
            !this.monsters
              .filter(m => m.lineIndex == monsterLineIndex)
              .map(m => m.rowIndex)
              .includes(a)
        )
      );
    }

    monsterInfo.x = (monsterLineIndex + 1) * CELL_SIZE;
    monsterInfo.y = (monsterRowIndex + 1) * CELL_SIZE;

    this.monsters.push(monsterInfo);
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
