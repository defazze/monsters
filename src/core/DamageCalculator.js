import Phaser from "phaser";

export default class {
  constructor() {}

  toPlayer(monsterInfo, playerInfo) {
    const damage = Phaser.Math.RND.between(
      monsterInfo.minDamage,
      monsterInfo.maxDamage
    );

    return damage;
  }
}
