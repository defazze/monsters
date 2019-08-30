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
    const push = (monster, lineIndex, rowIndex) => {
      monster.x = (lineIndex + 1.5) * CELL_SIZE;
      monster.y = (rowIndex + 1.5) * CELL_SIZE;

      this.monsters.push(monster);
    };

    if (monsterInfo.isChampion) {
      const championLineIndex = Math.min(
        Math.max(...this.monsters.map(m => m.lineIndex)) + 2,
        12
      );
      const championRowIndex = CENTER_ROW;

      this.removeMonster(championLineIndex, championRowIndex);
      push(monsterInfo, championLineIndex, championRowIndex);

      monsterInfo.minions.forEach(m => {
        const minionLineIndex = championLineIndex - 1;
        const minionRowIndex =
          championRowIndex - (monsterInfo.minions.indexOf(m) - 1);

        this.removeMonster(minionLineIndex, minionRowIndex);
        push(m, minionLineIndex, minionRowIndex);
      });
    } else if (!monsterInfo.champion) {
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

      const monsterLineIndex = this.getLineByPriority(priorityLines);

      if (monsterLineIndex == -1) {
        monsterLineIndex = Phaser.Utils.Array.GetRandom(enableLines);
      }

      const monsterRowIndex =
        monsterLineIndex == FIRST_MONSTER_LINE + MONSTER_AREA &&
        this.isEmpty(FIRST_MONSTER_LINE) &&
        this.isEmpty(FIRST_MONSTER_LINE + MONSTER_AREA)
          ? CENTER_ROW
          : Phaser.Utils.Array.GetRandom(
              this.ROWS.filter(
                a =>
                  !this.monsters
                    .filter(m => m.lineIndex == monsterLineIndex)
                    .map(m => m.rowIndex)
                    .includes(a)
              )
            );

      push(monsterInfo, monsterLineIndex, monsterRowIndex);
    }
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
