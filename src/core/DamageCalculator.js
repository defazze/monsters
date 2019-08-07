import Phaser from "phaser";

export default class {
  constructor() {}

  toPlayer(monsterInfo, playerInfo) {
    const damage = Phaser.Math.RND.between(
      monsterInfo.minDamage,
      monsterInfo.maxDamage
    );

    const defence = playerInfo.dexterity / 4;
    const chanceToHit = this.getChanceToHit(monsterInfo.attackRating, defence);
    console.log("Monster chance to hit: " + chanceToHit);

    const chance = Phaser.Math.RND.between(1, 100);
    if (chance > chanceToHit) {
      console.log("Monster attack failed!");
      return 0;
    } else {
      console.log("Monster attacs for " + damage + " damage!");
      return damage;
    }
  }

  toMonster(playerInfo, monsterInfo) {
    const damage = Phaser.Math.RND.between(
      playerInfo.baseMinDamage,
      playerInfo.baseMaxDamage
    );

    const attackRating = playerInfo.dexterity * 4.25;
    const chanceToHit = this.getChanceToHit(attackRating, monsterInfo.defence);
    console.log("Player chance to hit: " + chanceToHit);

    const chance = Phaser.Math.RND.between(1, 100);
    if (chance > chanceToHit) {
      console.log("Player damage failed!");
      return 0;
    } else {
      console.log("Player attacs for " + damage + " damage!");
      return damage;
    }
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
