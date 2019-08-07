import Phaser from "phaser";
import Actor from "./Actor";

export class Monster extends Actor {
  constructor({ scene, x, y, asset, name, totalLife, onClick }) {
    super({ scene, x, y, asset, name, totalLife });

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 96, 96),
      Phaser.Geom.Rectangle.Contains
    );
    this.on("pointerdown", () => onClick(this));
  }
}
