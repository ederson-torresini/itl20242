export default class parque extends Phaser.Scene {
  constructor() {
    super("parque");
  }

  preload() {
    this.load.audio("sino", "assets/sino.mp3");
  }

  create() {
    this.sino = this.sound.add("sino");

    this.mqttClient = mqtt.connect("wss://test.mosquitto.org:8081");

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

    this.brinquedos = [
      { x: 100, y: 100, numero: "1" },
      { x: 250, y: 100, numero: "2" },
      { x: 400, y: 100, numero: "3" },
      { x: 100, y: 300, numero: "4" },
      { x: 250, y: 300, numero: "5" },
      { x: 400, y: 300, numero: "6" },
      { x: 100, y: 500, numero: "7" },
      { x: 250, y: 500, numero: "8" },
      { x: 400, y: 500, numero: "9" },
      { x: 100, y: 700, numero: "10" },
      { x: 250, y: 700, numero: "11" },
      { x: 400, y: 700, numero: "12" },
    ];

    this.brinquedos.forEach((brinquedo) => {
      this.add.text(brinquedo.x, brinquedo.y, brinquedo.numero, {
        fontSize: "32px",
        fill: "#fff",
        fontFamily: "Courier New",
      });
      brinquedo.comandos = [0, 1];
      brinquedo.comandos.forEach((i) => {
        brinquedo.comandos[i] = this.add
          .text(brinquedo.x, brinquedo.y + (i + 1) * 50, i, {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "Courier New",
          })
          .setInteractive()
          .on("pointerdown", () => {
            this.mqttClient.publish(
              "itl20242/req/" + brinquedo.numero,
              i.toString(),
            );
          });
      });
    });
  }

  update() {}
}
