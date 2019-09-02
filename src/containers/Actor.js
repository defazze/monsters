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

    this.name = scene.add.text(-40, -48, actorInfo.name, {
      fontFamily: "Arial",
      fontSize: 12,
      color: "#0f0f0f"
    });

    this.actorInfo.subscribe(({ val }) => {
      if (val == 0) {
        this.destroy();
      } else {
        this.healthBar.setHealth(val);
      }
    }, "health");

    this.add([this.name, this.healthBar, this.sprite]);
  }

  regenerate(health, interval) {
    this.regenerator.add(health, interval);
  }

  update(time, delta) {
    const regenerateSpeed = this.regenerator.process(time);
    if (regenerateSpeed > 0) {
      this.currentHealth += regenerateSpeed * delta;

      if (this.currentHealth >= this.totalHealth) {
        this.regenerator.reset();
        this.currentHealth = this.totalHealth;
      }
      this.healthBar.setHealth(this.currentHealth);
    }
  }
}
