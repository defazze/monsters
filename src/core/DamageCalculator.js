import Phaser from "phaser";
import { FIRST_MONSTER_LINE } from "../constants/common";

export default class {
  constructor() {}

  toPlayer(monsterInfo, playerInfo) {
    let damage = Phaser.Math.RND.between(
      monsterInfo.minDamage,
      monsterInfo.maxDamage
    );

    const defence = playerInfo.dexterity / 4;
    const chanceToHit = this.getChanceToHit(monsterInfo.attackRating, defence);

    const chance = Phaser.Math.RND.between(1, 100);
    if (chance > chanceToHit) {
      damage = 0;
    } else {
      const lineDistance = Math.abs(
        monsterInfo.lineIndex - playerInfo.lineIndex
      );
      if (monsterInfo.isRanged) {
        if (lineDistance == 1) {
          damage = damage * 0.7;
        }
      } else {
        if (lineDistance == 2) {
          damage = damage * 0.75;
        } else if (lineDistance == 3) {
          damage = damage * 0.5;
        } else if (lineDistance > 3) {
          damage = 0;
        }
      }
    }
    return damage;
  }

  toMonster(playerInfo, monsterInfo) {
    let damage = Phaser.Math.RND.between(
      playerInfo.baseMinDamage,
      playerInfo.baseMaxDamage
    );

    const attackRating = playerInfo.dexterity * 4.25;
    const chanceToHit = this.getChanceToHit(attackRating, monsterInfo.defence);

    const chance = Phaser.Math.RND.between(1, 100);
    if (chance > chanceToHit) {
      damage = 0;
    } else {
      const lineDistance = Math.abs(
        monsterInfo.lineIndex - playerInfo.lineIndex
      );

      if (lineDistance == 2) {
        damage = damage * 0.75;
      } else if (lineDistance == 3) {
        damage = damage * 0.5;
      } else if (lineDistance > 3) {
        damage = 0;
      }
    }
    return damage;
  }

  getChanceToHit(attackRating, defence) {
    let chanceToHit = 100 * (attackRating / (attackRating + defence));
    if (chanceToHit < 5) {
      chanceToHit = 5;
    }
    if (chanceToHit > 95) {
      chanceToHit = 95;
    }

    return chanceToHit;
  }
}
