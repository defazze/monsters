import Phaser from "phaser";
import HealthBar from "../containers/HealthBar";
import Regenerator from "../core/Regenerator";
import { proxy } from "../core/ActorInfoProxy";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, actorInfo }) {
    super(scene, x, y);

    this.setSize(96, 96);
    this.actorInfo = proxy(actorInfo, this);

    this.regenerator = new Regenerator();

    this.sprite = scene.physics.add.sprite(0, 16, actorInfo.asset);
    this.healthBar = new HealthBar({
      scene,
      x: 0,
      y: -28,
      health: actorInfo.health
    });
    scene.add.existing(this.healthBar);

    const font = actorInfo.isChampion
      ? {
          fontFamily: "Arial Black",
          fontSize: 12,
          color: "#9d3133"
        }
      : {
          fontFamily: "Arial",
          fontSize: 12,
          color: "#0f0f0f"
        };
    this.name = scene.add.text(-40, -48, actorInfo.name, font);

    const callback = ({ val }) => {
      if (val == 0) {
        this.actorInfo.isDead = true;
      }
      this.healthBar.setHealth(val);
    };
    this.actorInfo.subscribe(callback, "health");
    this.on("destroy", () => this.actorInfo.unsubscribe(callback, "health"));

    this.add([this.name, this.healthBar, this.sprite]);
  }

  regenerate(health, interval) {
    this.regenerator.add(health, interval);
  }

  update(time, delta) {
    const regenerateSpeed = this.regenerator.process(time);
    if (regenerateSpeed > 0) {
      let health = this.actorInfo.health + regenerateSpeed * delta;

      if (health >= this.totalHealth) {
        this.regenerator.reset();
        health = this.totalHealth;
      }
      this.actorInfo.health = health;
    }
  }
}
