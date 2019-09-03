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
const TUTORIAL_ZONE = Zones[0];

export default class {
  generate(wave) {
    const enabledMonsters = Monsters.filter(
      m => m.minWave <= wave && m.maxWave >= wave
    );

    const commonMonsters = enabledMonsters.filter(m => !m.isUnique);

    const minMonsters = TUTORIAL_ZONE.min[wave - 1];
    const maxMonsters = TUTORIAL_ZONE.max[wave - 1];
    const monstersCount = Phaser.Math.RND.between(minMonsters, maxMonsters);

    const getMonster = () => {
      return { ...Phaser.Utils.Array.GetRandom(commonMonsters) };
    };

    let battleObjects = range(monstersCount).map(a => getMonster());

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

      battleObjects.push(champion);
      battleObjects.push(...champion.minions);
    }

    const uniqueMonsters = enabledMonsters.filter(m => m.isUnique);

    uniqueMonsters.forEach(monsterInfo => {
      const spawnChance = Phaser.Math.RND.between(1, 100);
      if (monsterInfo.spawnRate > spawnChance) {
        battleObjects.push({ ...monsterInfo });
      }
    });

    battleObjects.forEach(m => {
      m.priorityLines = m.priorityLines || [4, 5, 6, 7];
      const health = Phaser.Math.RND.between(m.minHealth, m.maxHealth);
      m.health = health;
    });

    battleObjects = battleObjects.sort(
      (a, b) => a.priorityLines[0] - b.priorityLines[0]
    );

    const { landscape } = TUTORIAL_ZONE;

    landscape.forEach(landscapeObject => {
      const { minCount, maxCount, asset } = landscapeObject;
      const objectsCount = Phaser.Math.RND.between(minCount, maxCount);
      range(objectsCount).forEach(o =>
        battleObjects.push({ asset, isLandscape: true, isPermanent: true })
      );
    });

    const newObjects = this.addObjects(battleObjects);
    return newObjects;
  }

  addObjects(battleObjbects) {
    let newObjects = [];

    const push = (monster, lineIndex, rowIndex) => {
      newObjects = newObjects.filter(
        m => m.initLineIndex != lineIndex || m.initRowIndex != rowIndex
      );

      monster.initLineIndex = lineIndex;
      monster.initRowIndex = rowIndex;
      monster.initX = (lineIndex + 1.5) * CELL_SIZE;
      monster.initY = (rowIndex + 1.5) * CELL_SIZE;

      newObjects.push(monster);
    };

    const getObjectsCount = lineIndex =>
      newObjects.filter(m => m.initLineIndex == lineIndex).length;

    const isEmpty = lineIndex => getObjectsCount(lineIndex) == 0;

    const monsters = battleObjbects.filter(o => !o.isLandscape);
    const landscape = battleObjbects.filter(o => o.isLandscape);

    const landscapePlaces = this.getRandomPlaces(landscape.length);
    landscape.forEach(o => {
      const { lineIndex, rowIndex } = landscapePlaces[landscape.indexOf(o)];
      push(o, lineIndex, rowIndex);
    });

    monsters.forEach(m => {
      if (m.isChampion) {
        const championLineIndex = Math.min(
          Math.max(...newObjects.map(m => m.initLineIndex)) + 2,
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
          const count = getObjectsCount(i);
          return count > 0 && count < 7;
        });

        const firstEmpty = LINES.find(i => getObjectsCount(i) == 0);
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
                    !newObjects
                      .filter(m => m.initLineIndex == monsterLineIndex)
                      .map(m => m.initRowIndex)
                      .includes(a)
                )
              );

        push(m, monsterLineIndex, monsterRowIndex);
      }
    });

    return newObjects;
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

  getRandomPlaces(placesCount) {
    const totalPlacesCount = LINES.length * ROWS.length;
    const places = Phaser.Utils.Array.Shuffle(range(totalPlacesCount)).slice(
      0,
      placesCount
    );

    return places.map(p => {
      const lineIndex = (p % LINES.length) + 9;
      const rowIndex = Math.floor(p / LINES.length);

      return { lineIndex, rowIndex };
    });
  }
}
