import Phaser from "phaser";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, asset, count }) {
    super(scene, x, y);

    this.image = scene.add.image(0, 0, asset);
    this.count = scene.add.text(0, 0, count, {
      fontFamily: "Arial Black",
      fontSize: 14,
      color: "#0f0f0f"
    });

    this.count.x += 24 - this.count.width;
    this.count.y += 24 - this.count.height;
    this.add([this.image, this.count]);
    this.setSize(this.image.width, this.image.height);
    this.setInteractive();
    this.scene.add.existing(this);
  }
}
