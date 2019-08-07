import Phaser from "phaser";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, health }) {
    super(scene, x, y);

    this.lenght = 90;
    this.health = health;

    this.progressBox = this.scene.add.graphics();
    this.progressBar = this.scene.add.graphics();
    this.deathBar = this.scene.add.graphics();

    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(0, 0, 96, 10);

    this.progressBar.fillStyle(0xff0000, 1);
    this.progressBar.fillRect(2, 2, 2 + this.lenght, 6);

    this.add([this.progressBox, this.progressBar, this.deathBar]);
  }

  setHealth(health) {
    if (health < 0) {
      health = 0;
    }

    if (health > this.health) {
      health = this.health;
    }

    const death = this.health - health;
    const deathLenght = (this.lenght / this.health) * death;

    this.deathBar.clear();
    this.deathBar.fillStyle(0xffffff, 1);
    this.deathBar.fillRect(
      2 + (this.lenght - deathLenght),
      2,
      2 + deathLenght,
      6
    );
  }
}
