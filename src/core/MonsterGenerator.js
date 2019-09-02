import Phaser from "phaser";
import Monsters from "../../data/monsters.json";
import Zones from "../../data/zones.json";
import { range } from "../utils/Enumerable";

import {
  CELL_SIZE,
  MONSTER_AREA,
  CENTER_ROW,
  FIRST_MONSTER_LINE
} from "../constants/common";

const LINES = [9, 10, 11, 12];
const ROWS = [0, 1, 2, 3, 4, 5, 6];

export default class {
  generate(wave) {
    const enabledMonsters = Monsters.filter(
      m => m.minWave <= wave && m.maxWave >= wave
    );

    const commonMonsters = enabledMonsters.filter(m => !m.isUnique);

    const minCount = Zones[0].min[wave - 1];
    const maxCount = Zones[0].max[wave - 1];
    const count = Phaser.Math.RND.between(minCount, maxCount);

    const getMonster = () => {
      return { ...Phaser.Utils.Array.GetRandom(commonMonsters) };
    };

    let generatedMonsters = range(count).map(a => getMonster());

    if (wave == 7) {
      const champion = getMonster();
      champion.priorityLines = [8];
      const minion = { ...champion };
      minion.minHealth = minion.minHealth * 1.5;
      minion.maxHealth = minion.maxHealth * 1.5;
      minion.champion = champion;

      champion.minions = range(3).map(a => {
        return { ...minion };
      });

      champion.minHealth = champion.minHealth * 3;
      champion.maxHealth = champion.maxHealth * 3;
      champion.treasure += " C";
      champion.isChampion = true;

      generatedMonsters.push(champion);
      generatedMonsters.push(...champion.minions);
    }

    const uniqueMonsters = enabledMonsters.filter(m => m.isUnique);

    uniqueMonsters.forEach(monsterInfo => {
      const spawnChance = Phaser.Math.RND.between(1, 100);
      if (monsterInfo.spawnRate > spawnChance) {
        generatedMonsters.push({ ...monsterInfo });
      }
    });

    generatedMonsters.forEach(m => {
      m.priorityLines = m.priorityLines || [4, 5, 6, 7];
      const health = Phaser.Math.RND.between(m.minHealth, m.maxHealth);
      m.health = health;
    });

    generatedMonsters = generatedMonsters.sort(
      (a, b) => a.priorityLines[0] - b.priorityLines[0]
    );

    const newMonsters = this.addMonsters(generatedMonsters);
    return newMonsters;
  }

  addMonsters(monsters) {
    let newMonsters = [];

    const push = (monster, lineIndex, rowIndex) => {
      newMonsters = newMonsters.filter(
        m => m.initLineIndex != lineIndex || m.initRowIndex != rowIndex
      );

      monster.initLineIndex = lineIndex;
      monster.initRowIndex = rowIndex;
      monster.initX = (lineIndex + 1.5) * CELL_SIZE;
      monster.initY = (rowIndex + 1.5) * CELL_SIZE;

      newMonsters.push(monster);
    };

    const getMonstersCount = lineIndex =>
      newMonsters.filter(m => m.initLineIndex == lineIndex).length;

    const isEmpty = lineIndex => getMonstersCount(lineIndex) == 0;

    monsters.forEach(m => {
      if (m.isChampion) {
        const championLineIndex = Math.min(
          Math.max(...newMonsters.map(m => m.initLineIndex)) + 2,
          12
        );
        const championRowIndex = CENTER_ROW;
        push(m, championLineIndex, championRowIndex);

        m.minions.forEach(mn => {
          const minionLineIndex = championLineIndex - 1;
          const minionRowIndex = championRowIndex - (m.minions.indexOf(mn) - 1);

          push(mn, minionLineIndex, minionRowIndex);
        });
      } else if (!m.champion) {
        const enableLines = LINES.filter(i => {
          const count = getMonstersCount(i);
          return count > 0 && count < 7;
        });

        const firstEmpty = LINES.find(i => getMonstersCount(i) == 0);
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
          isEmpty(FIRST_MONSTER_LINE + MONSTER_AREA)
            ? CENTER_ROW
            : Phaser.Utils.Array.GetRandom(
                ROWS.filter(
                  a =>
                    !newMonsters
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
}
