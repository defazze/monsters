import Phaser from "phaser";
import Data from "../../data/monsters.json";
import MonstersCount from "../../data/monstersCount.json";
import { CELL_SIZE } from "../constants/common";

export default class {
  constructor(battlefield) {
    this.battlefield = battlefield;
    this.monstersInfo = Data;
  }

  generate(wave) {
    const enabledMonsters = this.monstersInfo.filter(
      m => m.minWave <= wave && m.maxWave >= wave && !m.isUnique
    );
    enabledMonsters.forEach(
      m => (m.priorityLines = m.priorityLines || [4, 5, 6, 7])
    );

    const minCount = MonstersCount[0].min[wave - 1];
    const maxCount = MonstersCount[0].max[wave - 1];
    const count = Phaser.Math.RND.between(minCount, maxCount);

    let generatedMonsters = [];

    for (var num = 1; num <= count; num++) {
      const monsterInfo = { ...Phaser.Utils.Array.GetRandom(enabledMonsters) };

      this.setMonster(monsterInfo);
      generatedMonsters.push(monsterInfo);
    }

    const uniqueMonsters = this.monstersInfo.filter(
      m => m.minWave <= wave && m.maxWave >= wave && m.isUnique
    );

    uniqueMonsters.forEach(monsterInfo => {
      const spawnChance = Phaser.Math.RND.between(1, 100);
      if (monsterInfo.spawnRate > spawnChance) {
        this.setMonster(monsterInfo);
        generatedMonsters.push(monsterInfo);
        monsterInfo.priorityLines = monsterInfo.priorityLines || [4, 5, 6, 7];
      }
    });

    generatedMonsters = generatedMonsters.sort(
      (a, b) => a.priorityLines[0] - b.priorityLines[0]
    );

    return generatedMonsters;
  }

  setMonster(monsterInfo) {
    const coords = this.battlefield.setMonster(monsterInfo);

    const health = Phaser.Math.RND.between(
      monsterInfo.minHealth,
      monsterInfo.maxHealth
    );

    monsterInfo.coords = coords;
    monsterInfo.health = health;
  }
}
