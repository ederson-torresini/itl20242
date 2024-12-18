export default {
  backgroundColor: '#ffffff',
  type: Phaser.AUTO,
  width: 540,
  height: 960,
  pixelArt: true,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 540,
    height: 960
  }
}
