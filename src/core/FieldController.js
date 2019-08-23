import { CELL_SIZE } from "../constants/common";

import Phaser from "phaser";

const NORMAL = 1;
const EMPTY = 2;
const FULL = 3;

export default class {
  constructor() {
    this.clear();
  }

  monsters = [];
  clear() {
    this.lines = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ];

    this.linesStatus = new Map([
      [4, NORMAL],
      [5, NORMAL],
      [6, NORMAL],
      [7, NORMAL]
    ]);
  }

  debugField() {
    const copy = [
      Array.from(this.lines[0]),
      Array.from(this.lines[1]),
      Array.from(this.lines[2]),
      Array.from(this.lines[3]),
      Array.from(this.lines[4]),
      Array.from(this.lines[5]),
      Array.from(this.lines[6]),
      Array.from(this.lines[7])
    ];
    console.log(copy);
  }

  setLinesStatus() {
    const enableLines = [];
    for (var lineIndex = 4; lineIndex <= 7; lineIndex++) {
      const isFull = this.isFull(lineIndex);
      const isEmpty = this.isEmpty(lineIndex);

      const status = isFull ? FULL : isEmpty ? EMPTY : NORMAL;
      this.linesStatus.set(lineIndex, status);

      if (
        status == NORMAL ||
        (status == EMPTY &&
          !enableLines.some(a => this.linesStatus.get(a) == EMPTY))
      ) {
        enableLines.push(lineIndex);
      }
    }

    return enableLines;
  }

  removeMonster(lineIndex, rowIndex) {
    this.monsters = this.monsters.filter(
      m => m.lineIndex == lineIndex && m.rowIndex == rowIndex
    );
    this.lines[lineIndex][rowIndex] = null;
  }

  setMonster(monsterInfo) {
    const getMonstersCount = lineIndex =>
      this.monsters.filter(m => m.lineIndex == lineIndex).length;

    const enableLines = [4, 5, 6, 7].filter(i => {
      const count = getMonstersCount(i);
      return count > 0 && count < 7;
    });

    const firstEmpty = [4, 5, 6, 7].find(i => getMonstersCount(i) == 0);
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
        [0, 1, 2, 3, 4, 5, 6].filter(a => !this.lines[monsterLineIndex][a])
      );
    }

    this.lines[monsterLineIndex][monsterRowIndex] = monsterInfo;

    monsterInfo.lineIndex = monsterLineIndex;
    monsterInfo.rowIndex = monsterRowIndex;

    this.monsters.push(monsterInfo);

    return {
      x: (monsterLineIndex + 2) * CELL_SIZE,
      y: (monsterRowIndex + 1) * CELL_SIZE
    };
  }

  setCell(lineIndex, rowIndex, value) {
    this.lines[lineIndex][rowIndex] = value;
  }

  getLineByPriority(priorityLines) {
    if (priorityLines.length == 0) {
      return -1;
    }
    const p = 80;

    for (var i = 0; i < priorityLines.length; i++) {
      const chance = Phaser.Math.RND.between(1, 100);
      if (chance <= p) {
        return priorityLines[i];
      }
    }

    return priorityLines[priorityLines.length - 1];
  }

  isEmpty(lineIndex) {
    const result = this.lines[lineIndex].every(cell => !cell);

    if (lineIndex == 4) {
    }
    return result;
  }

  isFull(lineIndex) {
    return this.lines[lineIndex].every(cell => cell);
  }

  get mainCell() {
    return this.lines[4][3];
  }
}
