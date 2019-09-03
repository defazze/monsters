import Phaser from "phaser";

import BootScene from "./scenes/Boot";
import GameScene from "./scenes/Game";
import GameOverScene from "./scenes/GameOver";
import CastleScene from "./scenes/Castle";
import InventoryScene from "./scenes/Inventory";
import WinScene from "./scenes/Win";
import TradeScene from "./scenes/Trade";
import TransitionScene from "./scenes/Transition";

import config from "./config";

const gameConfig = Object.assign(config, {
  scene: [
    BootScene,
    GameScene,
    GameOverScene,
    CastleScene,
    InventoryScene,
    WinScene,
    TradeScene,
    TransitionScene
  ]
});

class Game extends Phaser.Game {
  constructor() {
    super(gameConfig);
  }
}

window.game = new Game();
