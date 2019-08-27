import Phaser from "phaser";
import ItemsContainer from "../containers/items/ItemsContainer";
import Gold from "../containers/Gold";
import Trader from "../core/Trader";

const X = 100;
const Y = 400;

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "TradeScene" });
  }

  init(data) {
    this.customData = data;
  }
  preload() {}

  create() {
    const { inventory, traderInventory } = this.customData;
    const trader = new Trader(inventory, traderInventory);

    this.cameras.main.setBackgroundColor(0x34c70e);

    const approve = this.add.image(X + 800, 800, "approve").setInteractive();
    approve.on("pointerdown", () => {
      this.scene.start("CastleScene");
    });
    approve.on("pointerover", () => approve.setTint(0x008447));
    approve.on("pointerout", () => approve.clearTint());

    const decline = this.add.image(X + 900, 800, "decline").setInteractive();
    decline.on("pointerdown", () => {
      this.scene.start("CastleScene");
    });
    decline.on("pointerover", () => decline.setTint(0xd91a3a));
    decline.on("pointerout", () => decline.clearTint());

    const onTraderItemClick = item => {
      trader.buy(item.itemInfo);
    };

    const onPlayerItemClick = item => {
      trader.sell(item.itemInfo);
    };

    const playerContainer = new ItemsContainer({
      scene: this,
      x: X,
      y: 460,
      rows: inventory.rowsCount,
      columns: inventory.columnsCount,
      onItemClick: onPlayerItemClick,
      showSellPrice: true
    });
    this.add.existing(playerContainer);

    const traderContainer = new ItemsContainer({
      scene: this,
      x: X,
      y: 110,
      rows: traderInventory.rowsCount,
      columns: traderInventory.columnsCount,
      onItemClick: onTraderItemClick,
      isDraggable: false,
      showCost: true
    });
    this.add.existing(traderContainer);

    inventory.addContainer(playerContainer);
    traderInventory.addContainer(traderContainer);

    const playerGold = new Gold({
      scene: this,
      x: X + 500,
      y: 820,
      goldObject: inventory.gold
    });

    const traderGold = new Gold({
      scene: this,
      x: X + 500,
      y: 50,
      goldObject: traderInventory.gold
    });

    this.events.on("shutdown", () => {
      inventory.removeContainer(playerContainer);
      traderInventory.removeContainer(traderContainer);
    });
  }
}
