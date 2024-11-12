import config from './config.js'
import parque from './parque.js'

class Game extends Phaser.Game {
  constructor () {
    super(config)

    this.scene.add('parque', parque)
    this.scene.start('parque')
  }
}

window.onload = () => {
  window.game = new Game()
}
