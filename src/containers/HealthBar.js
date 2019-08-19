import Phaser from "phaser";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, health }) {
    super(scene, x, y);

    this.lenght = 90;
    this.health = health;

    this.progressBox = this.scene.add.graphics();
    this.progressBar = this.scene.add.graphics();
    this.healthBar = this.scene.add.graphics();

    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(0, 0, 96, 10);

    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(2, 2, 2 + this.lenght, 6);

    this.add([this.progressBox, this.progressBar, this.healthBar]);

    this.setHealth(health);
  }

  setHealth(health) {
    if (health < 0) {
      health = 0;
    }

    if (health > this.health) {
      health = this.health;
    }

    const healthLenght = (this.lenght / this.health) * health;

    this.healthBar.clear();
    this.healthBar.fillStyle(0xff0000, 1);
    this.healthBar.fillRect(2, 2, 2 + healthLenght, 6);
  }
}
