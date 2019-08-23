import Phaser from "phaser";
import HealthBar from "../containers/HealthBar";
import Regenerator from "../core/Regenerator";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, asset, name, health, onDead }) {
    super(scene, x, y);

    this.regenerator = new Regenerator();

    this.totalHealth = health;
    this.currentHealth = health;
    this.isDead = false;

    this.onDead = onDead;

    this.sprite = scene.physics.add.sprite(48, 64, asset);
    //this.sprite.setTint(0x44ff44);
    this.healthBar = new HealthBar({ scene, x: 0, y: 15, health });
    scene.add.existing(this.healthBar);
    this.name = scene.add.text(16, 0, name, {
      fontFamily: "Arial",
      fontSize: 12,
      color: "#0f0f0f"
    });

    this.add([this.sprite, this.healthBar, this.name]);
  }

  hit(damage) {
    this.currentHealth -= damage;
    if (this.currentHealth <= 0) {
      this.isDead = true;
      this.onDead(this);
    }

    this.healthBar.setHealth(this.currentHealth);
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
