import Phaser from "phaser";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, goldObject, onClick }) {
    super(scene, x, y);

    this.goldObject = goldObject;
    this.image = scene.add.image(0, 0, "coins");

    this.count = scene.add.text(40, -15, goldObject.count, {
      fontFamily: "Arial Black",
      fontSize: 36,
      color: "#0f0f0f"
    });

    const callback = change => {
      if (change.prop == "count") {
        this.count.text = this.goldObject.count;
      }
    };
    goldObject.subscribe(callback);
    scene.events.on("shutdown", () => goldObject.unsubscribe(callback));

    this.add([this.image, this.count]);
    this.setSize(this.image.width, this.image.height);
    this.setInteractive();
    if (onClick) {
      this.on("pointerup", () => onClick(this));
    }
    this.scene.add.existing(this);
  }
}
