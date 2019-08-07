import Phaser from "phaser";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, totalLife }) {
    super(scene, x, y);

    this.lenght = 90;
    this.totalLife = totalLife;

    this.progressBox = this.scene.add.graphics();
    this.progressBar = this.scene.add.graphics();
    this.deathBar = this.scene.add.graphics();

    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(0, 0, 96, 10);

    this.progressBar.fillStyle(0xff0000, 1);
    this.progressBar.fillRect(2, 2, 2 + this.lenght, 6);

    this.add([this.progressBox, this.progressBar, this.deathBar]);
  }

  setTotalLife(totalLife) {
    this.totalLife = totalLife;
  }

  setCurrentLife(currentLife) {
    if (currentLife < 0) {
      currentLife = 0;
    }

    if (currentLife > this.totalLife) {
      currentLife = this.totalLife;
    }

    const death = this.totalLife - currentLife;
    const deathLenght = (this.lenght / this.totalLife) * death;

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
