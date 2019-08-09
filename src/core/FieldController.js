import { Z_FILTERED } from "zlib";

import Phaser from "phaser";

const NORMAL = 1;
const EMPTY = 2;
const FULL = 3;

export default class {
  constructor() {
    this.clear();
  }

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

    this.linesStatus = new Map(
      [4, NORMAL],
      [5, NORMAL],
      [6, NORMAL],
      [7, NORMAL]
    );

    this.enableLines = [];
  }

  setLinesStatus() {
    for (lineIndex = 4; lineIndex++; lineIndex <= 7) {
      const isFull = this.isFull(lineIndex);
      const isEmpty = this.isEmpty(lineIndex);

      const status = isFull ? FULL : isEmpty ? EMPTY : NORMAL;
      this.linesStatus.set(lineIndex, status);

      if (
        status == NORMAL ||
        (status == EMPTY && !this.enableLines.some(EMPTY))
      ) {
        this.enableLines.push(lineIndex);
      }
    }
  }

  setMonster(monster) {
    let priorityLines = monster.monsterInfo.priorityLines
      ? monster.monsterInfo.priorityLines
      : [1, 2, 3, 4];

    priorityLines = priorityLines.filter(l => this.enabledLines.some(l));

    let monsterLineIndex = getLineByPriority(priorityLines);

    if (monsterLineIndex == -1) {
      monsterLineIndex = getLineByRandom(this.enabledLines);
    }
  }

  getLineByPriority(priorityLines) {
    if (priorityLines.lenght == 0) {
      return -1;
    }

    const p = 75;
    let i = 0;
    for (i = 0; i++; i < priorityLines.lenght) {
      const chance = Phaser.Math.RND.between(1, 100);
      if (chance <= p) {
        return priorityLines[i];
      }
    }

    return priorityLines[i];
  }

  getLineByRandom(lines) {
    const line = Phaser.Math.RND.between(0, lines.lenght - 1);

    return line;
  }

  isEmpty(lineIndex) {
    return this.lines[lineIndex].every(cell => !cell);
  }

  isFull(lineIndex) {
    return this.lines[lineIndex].every(cell => cell);
  }

  setMain(monster) {
    this.lines[4][3] = monster;
  }

  get mainCell() {
    return this.lines[4][3];
  }
}
