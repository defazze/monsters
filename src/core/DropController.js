import Phaser from "phaser";
import { NO_DROP, GOLD, MIN_GOLD, MAX_GOLD } from "../constants/drop";

export default class {
  constructor(treasures, items) {
    this.treasures = treasures;
    this.items = items;
  }

  calculate = monsterInfo => {
    const drops = [];
    const gold = { code: GOLD, count: 0 };
    const { treasure } = monsterInfo;
    const treasureInfo = this.treasures.find(t => t.name == treasure);
    if (!treasureInfo) {
      return null;
    }

    const { picks = 1 } = treasureInfo;

    for (let i = 0; i < picks; i++) {
      const drop = this.getTreasure(treasureInfo);

      if (drop) {
        if (drop.code == GOLD) {
          gold.count += drop.count;
        } else if (drop.stackable) {
          const existingDrop = drops.find(d => d.code == drop.code);
          if (existingDrop) {
            existingDrop.count++;
          } else {
            drop.count = 1;
            drops.push(drop);
          }
        } else {
          drops.pish(drop);
        }
      }
    }

    if (gold.count > 0) {
      drops.push(gold);
    }

    return drops;
  };

  getTreasure = treasureInfo => {
    const { probs } = treasureInfo;
    const totalProbs = probs.reduce((a, b) => a + b, 0);
    const prob = Phaser.Math.RND.between(1, totalProbs);

    const getDropIndex = () => {
      let sum = 0;
      for (let i = 0; i < probs.length; i++) {
        sum += probs[i];
        if (sum >= prob) {
          return i;
        }
      }

      return probs.length - 1;
    };

    const dropIndex = getDropIndex();
    const drop = treasureInfo.drops[dropIndex];

    if (drop == NO_DROP) {
      return null;
    }

    if (drop == GOLD) {
      const { goldRate = 1 } = treasureInfo;
      const count = Phaser.Math.RND.between(
        MIN_GOLD * goldRate,
        MAX_GOLD * goldRate
      );
      return { code: GOLD, count };
    }

    const treasure = this.treasures.find(t => t.name == drop);

    if (treasure) {
      return this.getTreasure(treasure);
    } else {
      const item = this.items.find(i => i.code == drop);
      return item;
    }
  };
}
