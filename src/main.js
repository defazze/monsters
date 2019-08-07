import Phaser from "phaser";

import BootScene from "./scenes/Boot";
import SplashScene from "./scenes/Splash";
import GameScene from "./scenes/Game";
import GameOverScene from "./scenes/GameOver";

import config from "./config";

const gameConfig = Object.assign(config, {
  scene: [BootScene, SplashScene, GameScene, GameOverScene]
});

class Game extends Phaser.Game {
  constructor() {
    super(gameConfig);
  }
}

window.game = new Game();
