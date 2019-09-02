import Phaser from "phaser";
import Generator from "../core/MonsterGenerator";
import Calculator from "../core/DamageCalculator";
import DropController from "../core/DropController";
import { GOLD } from "../constants/drop";
import Zones from "../../data/zones.json";

export default class {
  constructor(battlefield, gameData) {
    const { treasures, items } = gameData;
    this.dropController = new DropController(treasures, items);

    this.battlefield = battlefield;
    battlefield.events.on("onGenerateMonsters", this.generate);
    battlefield.events.on("onMonsterAttack", this.onMonsterAttack);
    battlefield.events.on("onPlayerAttack", this.onPlayerAttack);

    this.inventory = gameData.inventory;
  }

  generator = new Generator();
  calculator = new Calculator();
  wave = 7;
  monsters = [];

  generate = () => {
    const newMonsters = this.battlefield.addMonsters(
      this.generator.generate(this.wave)
    );
    this.monsters.push(...newMonsters);
    newMonsters.forEach(m =>
      m.subscribe(args => this.onMonsterHealthChange(m), "health")
    );

    this.wave++;
  };

  onMonsterAttack = (monsterInfo, playerInfo) => {
    const damage = this.calculator.toPlayer(monsterInfo, playerInfo);

    if (damage > 0) {
      playerInfo.health = Math.max(0, playerInfo.health - damage);
      this.battlefield.hurtPlayer();
    }
  };

  onPlayerAttack = (monsterInfo, playerInfo) => {
    const damage = this.calculator.toMonster(playerInfo, monsterInfo);

    if (damage > 0) {
      monsterInfo.health = Math.max(0, monsterInfo.health - damage);
    }
  };

  onMonsterHealthChange = monsterInfo => {
    if (monsterInfo.health == 0) {
      monsterInfo.isDead = true;
      this.drop(monsterInfo);

      if (this.monsters.every(m => m.isDead || m.isPermanent)) {
        this.monsters = this.monsters.filter(m => !m.isDead);

        if (this.wave >= Zones[0].min.length) {
          this.battlefield.win();
        } else {
          this.generate();
        }
      }
    }
  };

  drop = monsterInfo => {
    const drops = this.dropController.calculate(monsterInfo);
    drops.forEach(d =>
      d.code == GOLD ? this.inventory.addGold(d.count) : this.inventory.add(d)
    );
    this.battlefield.dropAnimate(drops, monsterInfo);
  };
}
