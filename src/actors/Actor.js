import Phaser from "phaser";
import HealthBar from "../graphics/HealthBar";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, asset, name, health }) {
    super(scene, x, y);

    this.lastUpdateTime = 0;
    this.regenerates = [];
    this.currentRegenerate = null;
    this.regenerateSpeed = 0;
    this.timeRegenerate = 0;

    this.totalHealth = health;
    this.currentHealth = health;
    this.isDead = false;

    this.sprite = scene.add.sprite(48, 64, asset);
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
    }

    this.healthBar.setHealth(this.currentHealth);
  }

  regenerate(health, interval) {
    this.regenerates.push({ health, interval });
  }

  update(time) {
    if (this.lastUpdateTime == 0) {
      this.lastUpdateTime = time;
    }

    if (this.regenerates.length > 0 && !this.currentRegenerate) {
      this.currentRegenerate = this.regenerates.shift();
      this.regenerateSpeed =
        this.currentRegenerate.health / this.currentRegenerate.interval;
      this.timeRegenerate = time + this.currentRegenerate.interval;
    }

    if (this.currentRegenerate) {
      if (time >= this.timeRegenerate) {
        this.currentRegenerate = null;
        this.timeRegenerat = 0;
        this.regenerateSpeed = 0;
      } else {
        this.currentHealth +=
          this.regenerateSpeed * (time - this.lastUpdateTime);

        if (this.currentHealth >= this.totalHealth) {
          this.regenerates = [];
          this.currentRegenerate = null;
          this.currentHealth = this.totalHealth;
        }

        this.healthBar.setHealth(this.currentHealth);
      }
    }

    this.lastUpdateTime = time;
  }
}
