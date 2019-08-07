import Phaser from "phaser";
import Data from "../../data/monsters.json";
import { CELL_SIZE } from "../constants/common";

export default class {
  constructor() {
    this.monsters = Data;
  }

  generate(wave) {
    const waveMonsters = this.monsters.filter(
      m => m.minWave <= wave && m.maxWave >= wave
    );

    const generatedMonsters = waveMonsters.map(monsterInfo => {
      const number = waveMonsters.indexOf(monsterInfo) + 1;

      const coords = this.getCoordinates(number);

      const health = Phaser.Math.RND.between(
        monsterInfo.minHealth,
        monsterInfo.maxHealth
      );

      return { monsterInfo, coords, health };
    });

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
