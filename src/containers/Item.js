import Phaser from "phaser";

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, itemInfo, onClick }) {
    super(scene, x, y);

    itemInfo.subscribe(change => {
      if (change.prop == "count") {
        this.refresh();
      }
    });

    this.itemInfo = itemInfo;
    this.image = scene.add.image(0, 0, itemInfo.asset);

    if (itemInfo.stackable) {
      this.count = scene.add.text(0, 0, itemInfo.count, {
        fontFamily: "Arial Black",
        fontSize: 14,
        color: "#0f0f0f"
      });
    }
    this.count.x = 24 - this.count.width;
    this.count.y = 24 - this.count.height;

    this.add([this.image, this.count]);
    this.setSize(this.image.width, this.image.height);
    this.setInteractive();
    if (onClick) {
      this.on("pointerdown", () => onClick(this));
    }
    this.scene.add.existing(this);
  }

  refresh = () => {
    if (this.scene) {
      if (this.itemInfo.stackable) {
        const { count } = this.itemInfo;
        if (count == 0) {
          this.destroy();
        } else {
          this.count.text = count;
          this.count.x = 24 - this.count.width;
          this.count.y = 24 - this.count.height;
        }
      }
    }
  };
}
