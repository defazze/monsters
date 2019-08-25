import Actor from "./Actor";

const IDLE = "knight-idle";
const WALK = "knight-walk";
const HURT = "knight-hurt";
const ATTACK = "knight-attack";

export class Player extends Actor {
  constructor({ scene, x, y, playerInfo, onDead }) {
    super({
      scene,
      x,
      y,
      health: playerInfo.health,
      asset: "knight",
      name: "Knight",
      onDead
    });

    this.playerInfo = playerInfo;
    this.currentAnimation = IDLE;
  }

  idle() {
    this.currentAnimation = IDLE;
    this.sprite.anims.play(this.currentAnimation);
  }

  walk() {
    this.currentAnimation = WALK;
    this.sprite.anims.play(this.currentAnimation);
  }

  attack() {
    this.sprite.anims.play(ATTACK);
    this.sprite.anims.chain(this.currentAnimation);
  }

  hurt() {
    this.sprite.anims.play(HURT);
    this.sprite.anims.chain(this.currentAnimation);
  }

  bringToTop() {
    this.sprite.setDepth(10);
  }
}
