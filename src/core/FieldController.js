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

  addMonsters(monsterInfos) {
    let newMonsters = [];
    const push = (monster, lineIndex, rowIndex) => {
      monster.x = (lineIndex + 1.5) * CELL_SIZE;
      monster.y = (rowIndex + 1.5) * CELL_SIZE;

      this.monsters.push(monster);
      newMonsters.push(monster);
    };

    const removeMonster = (lineIndex, rowIndex) => {
      this.removeMonster(lineIndex, rowIndex);
      newMonsters = newMonsters.filter(
        m => m.lineIndex != lineIndex || m.rowIndex != rowIndex
      );
    };

    monsterInfos.forEach(m => {
      if (m.isChampion) {
        const championLineIndex = Math.min(
          Math.max(...this.monsters.map(m => m.lineIndex)) + 2,
          12
        );
        const championRowIndex = CENTER_ROW;

        removeMonster(championLineIndex, championRowIndex);
        push(m, championLineIndex, championRowIndex);

        m.minions.forEach(mn => {
          const minionLineIndex = championLineIndex - 1;
          const minionRowIndex = championRowIndex - (m.minions.indexOf(mn) - 1);

          removeMonster(minionLineIndex, minionRowIndex);
          push(mn, minionLineIndex, minionRowIndex);
        });
      } else if (!m.champion) {
        const enableLines = this.LINES.filter(i => {
          const count = this.getMonstersCount(i);
          return count > 0 && count < 7;
        });

        const firstEmpty = this.LINES.find(i => this.getMonstersCount(i) == 0);
        if (firstEmpty) {
          enableLines.push(firstEmpty);
        }

        const priorityLines = (
          m.priorityLines.map(l => (l += MONSTER_AREA)) || lines
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

        push(m, monsterLineIndex, monsterRowIndex);
      }
    });

    return newMonsters;
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
