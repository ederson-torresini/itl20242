export default class parque extends Phaser.Scene {
  constructor() {
    super("parque");

    this.ligar = undefined;
    this.desligar = undefined;
  }

  preload() {
    this.load.audio("sino", "assets/sino.mp3");

    this.load.spritesheet("ligar", "assets/ligar.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("desligar", "assets/desligar.png", {
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
      key: "ligar",
      frames: this.anims.generateFrameNumbers("ligar", { start: 0, end: 7 }),
      frameRate: 20,
    });

    this.anims.create({
      key: "desligar",
      frames: this.anims.generateFrameNumbers("desligar", { start: 0, end: 7 }),
      frameRate: 20,
    });

    this.brinquedos = [
      {
        x: 100,
        y: 100,
        letra: "J", // barco viking
        numero: 1,
      },
      {
        x: 300,
        y: 100,
        letra: "h", // carrossel
        numero: 2,
      },
      {
        x: 100,
        y: 300,
        letra: "7", // montanha russa
        numero: 3,
      },
      {
        x: 300,
        y: 300,
        letra: "j", // roda gigante
        numero: 4,
      },
      {
        x: 100,
        y: 500,
        letra: ";", // chapéu mexicano
        numero: 5,
      },
      {
        x: 300,
        y: 500,
        letra: "D", // samba
        numero: 6,
      },
      {
        x: 100,
        y: 700,
        letra: "K", // carrinho
        numero: 7,
      },
      {
        x: 300,
        y: 700,
        letra: "y", // roda gigante
        numero: 8,
      },
    ];

    this.brinquedos.forEach((brinquedo) => {
      brinquedo.objeto = this.add
        .text(brinquedo.x, brinquedo.y, brinquedo.letra, {
          fontFamily: "amusement-park",
          fontSize: 200,
          color: "#000000",
        })
        .setInteractive()
        .on("pointerdown", () => {
          if (this.ligar) this.ligar.destroy();
          this.ligar = this.add
            .sprite(
              brinquedo.x + brinquedo.objeto.width / 2 - 32,
              brinquedo.y + brinquedo.objeto.height + 32,
              "ligar",
            )
            .setInteractive()
            .on("pointerdown", () => {
              this.ligar.play("ligar");
              this.mqttClient.publish("itl20242/req/" + brinquedo.numero, "1");
            });

          if (this.desligar) this.desligar.destroy();
          this.desligar = this.add
            .sprite(
              brinquedo.x + brinquedo.objeto.width / 2 + 32,
              brinquedo.y + brinquedo.objeto.height + 32,
              "desligar",
            )
            .setInteractive()
            .on("pointerdown", () => {
              this.desligar.play("desligar");
              this.mqttClient.publish("itl20242/req/" + brinquedo.numero, "0");
            });
        });
    });
  }

  update() {}
}
