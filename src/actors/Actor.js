import Phaser from "phaser";
import HealthBar from "../graphics/HealthBar";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, asset, name, health }) {
    super(scene, x, y);

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
}
