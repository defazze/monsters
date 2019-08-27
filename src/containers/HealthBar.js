import Phaser from "phaser";

const WIDTH = 80;
const HEIGHT = 6;
const BORDER = 2;

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, health }) {
    super(scene, x, y);

    this.health = health;

    this.progressBox = this.scene.add.graphics();
    this.progressBar = this.scene.add.graphics();
    this.healthBar = this.scene.add.graphics();

    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(
      -(WIDTH + BORDER * 2) / 2,
      -(HEIGHT + BORDER * 2) / 2,
      WIDTH + BORDER * 2,
      HEIGHT + BORDER * 2
    );

    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);

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

    const healthLenght = (WIDTH / this.health) * health;

    this.healthBar.clear();
    this.healthBar.fillStyle(0xff0000, 1);
    this.healthBar.fillRect(-WIDTH / 2, -HEIGHT / 2, healthLenght, HEIGHT);
  }
}
