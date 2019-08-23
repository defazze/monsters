import Phaser from "phaser";
import { CELL_SIZE, BORDER_WIDTH } from "../../constants/inventory";

const CELL_COLOR = 0xd2c1c6; /*0x8383838*/
export default class extends Phaser.GameObjects.Container {
  constructor({
    scene,
    x,
    y,
    rows,
    columns,
    onItemClick,
    isDraggable,
    cellSize = CELL_SIZE,
    borderWidth = BORDER_WIDTH
  }) {
    super(scene, x, y);

    this.scene = scene;
    this.borderWidth = borderWidth;
    this.cellSize = cellSize;
    this.onItemClick = onItemClick;

    const backgroundWidth = columns * cellSize + (columns + 1) * borderWidth;
    const backgroundHeight = rows * cellSize + (rows + 1) * borderWidth;

    const background = scene.add.rectangle(
      backgroundWidth / 2,
      backgroundHeight / 2,
      backgroundWidth,
      backgroundHeight,
      0xffffff
    );
    this.add(background);

    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        const x = cellSize * (i + 0.5) + borderWidth * (i + 1);
        const y = cellSize * (j + 0.5) + borderWidth * (j + 1);

        const cell = scene.add.rectangle(x, y, cellSize, cellSize, CELL_COLOR);

        cell.setInteractive(undefined, undefined, isDraggable);

        cell.columnIndex = i;
        cell.rowIndex = j;

        this.add(cell);
      }
    }
  }

  items = [];
  emitter = new Phaser.Events.EventEmitter();

  getItemX = columnIndex => {
    return (
      this.x +
      this.borderWidth * (columnIndex + 1) +
      this.cellSize * (columnIndex + 0.5)
    );
  };

  getItemY = rowIndex => {
    return (
      this.y +
      this.borderWidth * (rowIndex + 1) +
      this.cellSize * (rowIndex + 0.5)
    );
  };
}
