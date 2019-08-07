import Phaser from "phaser";
import Data from "../../data/monsters.json";
import MonstersCount from "../../data/monstersCount.json";
import { CELL_SIZE } from "../constants/common";

export default class {
  constructor() {
    this.monstersInfo = Data;
  }

  generate(wave) {
    const enabledMonsters = this.monstersInfo.filter(
      m => m.minWave <= wave && m.maxWave >= wave
    );
    const enabledMonsterCount = enabledMonsters.length;

    const minCount = MonstersCount[0].min[wave - 1];
    const maxCount = MonstersCount[0].max[wave - 1];
    const count = Phaser.Math.RND.between(minCount, maxCount);

    const generatedMonsters = [];
    for (var num = 1; num <= count; num++) {
      const enabledMonsterIndex =
        Phaser.Math.RND.between(1, enabledMonsterCount) - 1;

      const monsterInfo = enabledMonsters[enabledMonsterIndex];

      const coords = this.getCoordinates(num);
      const health = Phaser.Math.RND.between(
        monsterInfo.minHealth,
        monsterInfo.maxHealth
      );

      generatedMonsters.push({ monsterInfo, coords, health });
    }

    return generatedMonsters;
  }

  getCoordinates(number) {
    //Адов хардкод
    switch (number) {
      case 1:
        return { x: CELL_SIZE * 6, y: CELL_SIZE * 4 };
      case 2:
        return { x: CELL_SIZE * 6, y: CELL_SIZE * 2 };
      case 3:
        return { x: CELL_SIZE * 6, y: CELL_SIZE * 6 };
      case 4:
        return { x: CELL_SIZE * 6, y: CELL_SIZE * 1 };
      case 5:
        return { x: CELL_SIZE * 6, y: CELL_SIZE * 7 };
      case 6:
        return { x: CELL_SIZE * 7, y: CELL_SIZE * 3 };
      case 7:
        return { x: CELL_SIZE * 7, y: CELL_SIZE * 5 };
      case 8:
        return { x: CELL_SIZE * 8, y: CELL_SIZE * 4 };
    }
  }
}
