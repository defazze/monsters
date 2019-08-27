import Phaser from "phaser";
const TOOLTIP_COLOR = 0x73736f;
const FONT_SIZE = 12;
const FONT_COLOR = "#0f0f0f";
const FONT_FAMILY = "Arial Black";
const HORIZONTAL_PADDING = 15;
const VERTICAL_PADDING = 15;

export default class extends Phaser.GameObjects.Container {
  constructor({ scene, x, y, rows }) {
    super(scene, x, y);

    this.scene = scene;

    const texts = [];
    if (rows) {
      rows.forEach(r => {
        const text = scene.add.text(0, 0, r, {
          fontFamily: FONT_FAMILY,
          fontSize: FONT_SIZE,
          color: FONT_COLOR
        });
        texts.push(text);
      });

      const maxWidth = Math.max(...texts.map(t => t.width));
      const maxHeight = Math.max(...texts.map(t => t.height));

      const backgroundWidth = maxWidth + 2 * HORIZONTAL_PADDING;
      const backgroundHeight =
        (maxHeight + VERTICAL_PADDING) * texts.length + VERTICAL_PADDING;

      const background = scene.add.rectangle(
        backgroundWidth / 2,
        backgroundHeight / 2,
        backgroundWidth,
        backgroundHeight,
        TOOLTIP_COLOR
      );

      texts.forEach(t => {
        const index = texts.indexOf(t);
        const x = (maxWidth - t.width) / 2 + HORIZONTAL_PADDING;
        const y = VERTICAL_PADDING + index * (VERTICAL_PADDING + maxHeight);
        t.x = x;
        t.y = y;
      });
      //debugger;

      this.add([background, ...texts]);
    }
  }
}
