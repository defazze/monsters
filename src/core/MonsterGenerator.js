import Phaser from "phaser";
import Data from "../../data/monsters.json";
import Zones from "../../data/zones.json";
import { observable } from "../utils/Observable";

export default class {
  constructor(battlefield) {
    this.battlefield = battlefield;
    this.monstersInfo = Data;
  }

  generate(wave) {
    const enabledMonsters = this.monstersInfo.filter(
      m => m.minWave <= wave && m.maxWave >= wave
    );

    enabledMonsters.forEach(
      m => (m.priorityLines = m.priorityLines || [4, 5, 6, 7])
    );

    const commonMonsters = enabledMonsters.filter(m => !m.isUnique);

    const minCount = Zones[0].min[wave - 1];
    const maxCount = Zones[0].max[wave - 1];
    const count = Phaser.Math.RND.between(minCount, maxCount);

    let generatedMonsters = [];

    for (var num = 1; num <= count; num++) {
      const monsterInfo = { ...Phaser.Utils.Array.GetRandom(commonMonsters) };
      generatedMonsters.push(monsterInfo);
    }

    const uniqueMonsters = enabledMonsters.filter(m => m.isUnique);

    uniqueMonsters.forEach(monsterInfo => {
      const spawnChance = Phaser.Math.RND.between(1, 100);
      if (monsterInfo.spawnRate > spawnChance) {
        generatedMonsters.push({ ...monsterInfo });
      }
    });

    generatedMonsters = generatedMonsters.sort(
      (a, b) => a.priorityLines[0] - b.priorityLines[0]
    );

    generatedMonsters.forEach(m => this.setMonster(m));
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
