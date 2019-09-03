import Phaser from "phaser";

export default {
  type: Phaser.AUTO,
  parent: "content",
  width: 1056,
  height: 864,
  localStorageName: "phaseres6webpack",
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  }
};
