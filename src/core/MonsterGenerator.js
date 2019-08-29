import Phaser from "phaser";
import Data from "../../data/monsters.json";
import Zones from "../../data/zones.json";
import { proxy } from "./MonsterProxy";

export default class {
  constructor(battlefield) {
    this.battlefield = battlefield;
    this.monstersInfo = Data;
  }

  generate(wave) {
    const enabledMonsters = this.monstersInfo.filter(
      m => m.minWave <= wave && m.maxWave >= wave
    );

    const commonMonsters = enabledMonsters.filter(m => !m.isUnique);

    const minCount = Zones[0].min[wave - 1];
    const maxCount = Zones[0].max[wave - 1];
    const count = Phaser.Math.RND.between(minCount, maxCount);

    let generatedMonsters = [];

    const getMonster = () =>
      proxy({
        ...Phaser.Utils.Array.GetRandom(commonMonsters)
      });

    for (var num = 1; num <= count; num++) {
      const monsterInfo = getMonster();
      generatedMonsters.push(monsterInfo);
    }

    if (wave == 7) {
      const champion = getMonster();
      champion.priorityLines = [8];

      const minion = { ...champion };
      minion.minHealth = minion.minHealth * 2;
      minion.maxHealth = minion.maxHealth * 2;
      minion.isMinion = true;

      champion.minions = [minion, { ...minion }, { ...minion }];
      champion.minHealth = champion.minHealth * 3;
      champion.maxHealth = champion.maxHealth * 3;
      champion.isChampion = true;

      generatedMonsters.push(champion);
      generatedMonsters = generatedMonsters.concat(champion.minions);
    }

    const uniqueMonsters = enabledMonsters.filter(m => m.isUnique);

    uniqueMonsters.forEach(monsterInfo => {
      const spawnChance = Phaser.Math.RND.between(1, 100);
      if (monsterInfo.spawnRate > spawnChance) {
        generatedMonsters.push(proxy({ ...monsterInfo }));
      }
    });

    generatedMonsters.forEach(
      m => (m.priorityLines = m.priorityLines || [4, 5, 6, 7])
    );

    generatedMonsters = generatedMonsters.sort(
      (a, b) => a.priorityLines[0] - b.priorityLines[0]
    );

    generatedMonsters.forEach(m => this.setMonster(m));

    return generatedMonsters;
  }

  setMonster(monsterInfo) {
    if (!monsterInfo.isMinion) {
      this.battlefield.setMonster(monsterInfo);
    }
    const health = Phaser.Math.RND.between(
      monsterInfo.minHealth,
      monsterInfo.maxHealth
    );

    monsterInfo.health = health;
  }
}
