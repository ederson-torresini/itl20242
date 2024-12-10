export default class parque extends Phaser.Scene {
  constructor () {
    super('parque')
  }

  preload () {
    this.load.audio('sino', 'assets/sino.mp3')
    this.load.spritesheet('a', 'assets/a.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('b', 'assets/b.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
  }

  create () {
    this.sino = this.sound.add('sino')

    this.mqttClient = mqtt.connect('wss://itl.sj.ifsc.edu.br/mqtt/')

    this.mqttClient.on('connect', (err) => {
      console.log('Conectado ao broker MQTT')
      this.mqttClient.subscribe('itl20242/res/#', (err) => {
        if (!err) {
          console.log('Tópico assinado')
        }
      })
    })

    this.mqttClient.on('message', (topic, message) => {
      this.sino.play()
      console.log(topic, message.toString())
    })

    this.brinquedos = [
      { x: 100, y: 100, numero: '1' },
      { x: 250, y: 100, numero: '2' },
      { x: 400, y: 100, numero: '3' },
      { x: 100, y: 300, numero: '4' },
      { x: 250, y: 300, numero: '5' },
      { x: 400, y: 300, numero: '6' },
      { x: 100, y: 500, numero: '7' },
      { x: 250, y: 500, numero: '8' },
      { x: 400, y: 500, numero: '9' },
      { x: 100, y: 700, numero: '10' },
      { x: 250, y: 700, numero: '11' },
      { x: 400, y: 700, numero: '12' },
    ]

    this.anims.create({
      key: 'a',
      frames: this.anims.generateFrameNumbers('a', { start: 0, end: 7 }),
      frameRate: 20
    })

    this.anims.create({
      key: 'b',
      frames: this.anims.generateFrameNumbers('b', { start: 0, end: 7 }),
      frameRate: 20
    })

    this.brinquedos.forEach((brinquedo) => {
      this.add.text(brinquedo.x, brinquedo.y, brinquedo.numero, {
        fontSize: '32px',
        fill: '#000000',
      })
      brinquedo.comandos = ['a', 'b']
      brinquedo.comandos.forEach((i) => {
        let num
        i === 'a' ? num = 0 : num = 1
        brinquedo.comandos[i] = this.physics.add.sprite(brinquedo.x + 32, brinquedo.y + (num + 1) * 64, i, 0)
          .setInteractive()
          .on('pointerdown', () => {
            brinquedo.comandos[i].anims.play(i)
            this.mqttClient.publish(
              'itl20242/req/' + brinquedo.numero,
              num.toString(),
            )
          })
      })
    })
  }

  update () { }
}
