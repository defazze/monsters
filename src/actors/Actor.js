import Phaser from "phaser";
import LiveBar from "../graphics/LiveBar";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, asset, name, totalLife }) {
    super(scene, x, y);

    this.currentLife = totalLife;
    this.isDead = false;

    this.sprite = scene.add.sprite(48, 64, asset);
    this.liveBar = new LiveBar({ scene, x: 0, y: 15, totalLife });
    scene.add.existing(this.liveBar);
    this.name = scene.add.text(16, 0, name, {
      fontFamily: "Arial",
      fontSize: 12,
      color: "#0f0f0f"
    });

    this.add([this.sprite, this.liveBar, this.name]);
  }

  hit(damage) {
    this.currentLife -= damage;
    if (this.currentLife <= 0) {
      this.isDead = true;
    }

    this.liveBar.setCurrentLife(this.currentLife);
  }
}
