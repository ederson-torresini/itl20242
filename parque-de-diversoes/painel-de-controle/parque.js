export default class parque extends Phaser.Scene {
  constructor() {
    super("parque");

    this.desligar = undefined;
    this.ligar = undefined;
  }

  preload() {
    this.load.audio("sino", "assets/sino.mp3");

    this.load.image("barco-viking", "assets/barco-viking.png");
    this.load.image("carrossel", "assets/carrossel.png");
    this.load.image("montanha-russa", "assets/montanha-russa.png");

    this.load.spritesheet("desligar", "assets/desligar.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("ligar", "assets/ligar.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.sino = this.sound.add("sino");

    this.mqttClient = mqtt.connect("wss://itl.sj.ifsc.edu.br/mqtt/");

    this.mqttClient.on("connect", (err) => {
      console.log("Conectado ao broker MQTT");
      this.mqttClient.subscribe("itl20242/res/#", (err) => {
        if (!err) {
          console.log("Tópico assinado");
        }
      });
    });

    this.mqttClient.on("message", (topic, message) => {
      this.sino.play();
      console.log(topic, message.toString());
    });

    this.anims.create({
      key: "desligar",
      frames: this.anims.generateFrameNumbers("desligar", { start: 0, end: 7 }),
      frameRate: 20,
    });

    this.anims.create({
      key: "ligar",
      frames: this.anims.generateFrameNumbers("ligar", { start: 0, end: 7 }),
      frameRate: 20,
    });

    this.brinquedos = [
      {
        x: 300,
        y: 200,
        imagem: "barco-viking",
        numero: 1,
      },
      {
        x: 300,
        y: 450,
        imagem: "carrossel",
        numero: 2,
      },
      {
        x: 300,
        y: 700,
        imagem: "montanha-russa",
        numero: 3,
      },
    ];

    this.brinquedos.forEach((brinquedo) => {
      brinquedo.objeto = this.add
        .sprite(brinquedo.x, brinquedo.y, brinquedo.imagem)
        .setInteractive()
        .on("pointerdown", () => {
          if (this.desligar) this.desligar.destroy();
          this.desligar = this.add
            .sprite(
              brinquedo.x - brinquedo.objeto.width / 2 + 32,
              brinquedo.y + brinquedo.objeto.height,
              "desligar",
            )
            .setInteractive()
            .on("pointerdown", () => {
              this.desligar.play("desligar");
              this.mqttClient.publish("itl20242/req/" + brinquedo.numero, "0");
            });

          if (this.ligar) this.ligar.destroy();
          this.ligar = this.add
            .sprite(
              brinquedo.x - brinquedo.objeto.width / 2 + 96,
              brinquedo.y + brinquedo.objeto.height,
              "ligar",
            )
            .setInteractive()
            .on("pointerdown", () => {
              this.ligar.play("ligar");
              this.mqttClient.publish("itl20242/req/" + brinquedo.numero, "1");
            });
        });
    });
  }

  update() {}
}
