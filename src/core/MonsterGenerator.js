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

    const getMonster = () =>
      proxy({
        ...Phaser.Utils.Array.GetRandom(commonMonsters)
      });

    let generatedMonsters = [...Array(count).keys()].map(a => getMonster());

    if (wave == 7) {
      const champion = getMonster();
      champion.priorityLines = [8];
      const minion = { ...champion };
      minion.minHealth = minion.minHealth * 1.5;
      minion.maxHealth = minion.maxHealth * 1.5;
      minion.champion = champion;

      champion.minions = [...Array(3).keys()].map(a => proxy({ ...minion }));
      champion.minHealth = champion.minHealth * 3;
      champion.maxHealth = champion.maxHealth * 3;
      champion.treasure += " C";
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

    generatedMonsters.forEach(m => {
      m.priorityLines = m.priorityLines || [4, 5, 6, 7];
      const health = Phaser.Math.RND.between(m.minHealth, m.maxHealth);
      m.health = health;
    });

    generatedMonsters = generatedMonsters.sort(
      (a, b) => a.priorityLines[0] - b.priorityLines[0]
    );

    const newMonsters = this.battlefield.addMonsters(generatedMonsters);
    return newMonsters;
  }
}
