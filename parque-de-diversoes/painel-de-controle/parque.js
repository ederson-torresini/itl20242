export default class parque extends Phaser.Scene {
  constructor() {
    super("parque");

    this.jogador = undefined;
    this.movimento = undefined;
    this.mobileControls = undefined;
    this.mapWidth = 2000;
    this.mapHeight = 2000;
    this.popupOpen = false;
  }

  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
      true,
    );

    this.load.image("fundo", "../assets/maps/mapafundo4.jpg");
    this.load.spritesheet("jogador", "../assets/player/jogador.png", {
      frameWidth: 40,
      frameHeight: 54,
    });

    this.load.image("elefantinho", "../assets/brinquedos/elefantinho.png");
    this.load.image("rodaGigante1", "../assets/brinquedos/rodaGigante1.png");
    this.load.image("rodaGigante2", "../assets/brinquedos/rodaGigante2.png");
    this.load.image("barcoViking", "../assets/brinquedos/barcoViking.png");
    this.load.image("basquete", "../assets/brinquedos/basquete.png");
    this.load.image(
      "chapeuMexicano",
      "../assets/brinquedos/chapeuMexicano.png",
    );
    this.load.image("montanhaRussa", "../assets/brinquedos/montanhaRussa.png");
    this.load.image("samba", "../assets/brinquedos/samba.png");
    // this.load.image("zipper", "../assets/brinquedos/zipper.png")

    this.load.image("painelElefante", "../assets/brinquedos/painel1.jpg");
    this.load.image("painelPadrao", "../assets/brinquedos/painel3.png");

    this.load.image("button1", "../assets/brinquedos/on.png");
    this.load.image("button2", "../assets/brinquedos/off.png");
    this.load.image("button3", "../assets/brinquedos/botaoBaixo.png");
    this.load.image("button4", "../assets/brinquedos/BotaoCima.png");
  }

  create() {
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
      console.log(topic, message.toString());
    });

    this.add
      .image(0, 0, "fundo")
      .setOrigin(0, 0)
      .setDisplaySize(this.mapWidth, this.mapHeight);

    this.jogador = this.physics.add
      .sprite(this.mapWidth / 2, this.mapHeight / 2, "jogador")
      .setCollideWorldBounds(true);

    this.anims.create({
      key: "andar_cima",
      frames: this.anims.generateFrameNumbers("jogador", {
        start: 0,
        end: 8,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "andar_esquerda",
      frames: this.anims.generateFrameNumbers("jogador", {
        start: 9,
        end: 17,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "andar_baixo",
      frames: this.anims.generateFrameNumbers("jogador", {
        start: 18,
        end: 26,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "parado",
      frames: this.anims.generateFrameNumbers("jogador", {
        start: 18,
        end: 18,
      }),
      frameRate: 1,
    });

    this.anims.create({
      key: "andar_direita",
      frames: this.anims.generateFrameNumbers("jogador", {
        start: 27,
        end: 35,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.input.addPointer(3);
    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 500,
      y: 600,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc),
    });

    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.jogador);
    this.cameras.main.setZoom(2);

    let fences = this.physics.add.staticGroup();
    let fenceGraphics = this.add.graphics();
    let fenceThickness = 40;
    fenceGraphics.fillStyle(0x8b4513, 1);
    fenceGraphics.fillRect(0, 0, this.mapWidth, fenceThickness);
    fenceGraphics.generateTexture("fenceH", this.mapWidth, fenceThickness);
    fenceGraphics.clear();
    fenceGraphics.fillStyle(0x8b4513, 1);
    fenceGraphics.fillRect(0, 0, fenceThickness, this.mapHeight);
    fenceGraphics.generateTexture("fenceV", fenceThickness, this.mapHeight);
    fenceGraphics.destroy();

    fences
      .create(this.mapWidth / 2, fenceThickness / 2, "fenceH")
      .setOrigin(0.5, 0.5);
    fences
      .create(this.mapWidth / 2, this.mapHeight - fenceThickness / 2, "fenceH")
      .setOrigin(0.5, 0.5);
    fences
      .create(fenceThickness / 2, this.mapHeight / 2, "fenceV")
      .setOrigin(0.5, 0.5);
    fences
      .create(this.mapWidth - fenceThickness / 2, this.mapHeight / 2, "fenceV")
      .setOrigin(0.5, 0.5);
    this.physics.add.collider(this.jogador, fences);

    const criarBrinquedo = (x, y, key, scale = 0.5, colliderMsg = "") => {
      const obj = this.physics.add.staticImage(x, y, key).setScale(scale);
      obj.body.setCircle(obj.displayWidth / 2);
      obj.refreshBody();
      
      this.physics.add.overlap(this.jogador, obj, () => {
        if (!this.popupOpen) {
          let popup;
          switch (colliderMsg) {
            case "elefantinho":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "painelElefante",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.5);

              var eleButton1 = this.add.image(
                popup.x - 100,
                popup.y + 35,
                "button1",
              );
              eleButton1.setScale(0.5);
              eleButton1.setScrollFactor(0);
              eleButton1.setDepth(210);
              eleButton1.setInteractive({ useHandCursor: true });
              eleButton1.on("pointerdown", () => {
                this.mqttClient.publish("itl20242/req/" + 12, "1");
                console.log("Botão elefantinho 1 clicado");
              });

              var eleButton2 = this.add.image(
                popup.x + 100,
                popup.y + 40,
                "button2",
              );
              eleButton2.setScale(0.5);
              eleButton2.setScrollFactor(0);
              eleButton2.setDepth(210);
              eleButton2.setInteractive({ useHandCursor: true });
              eleButton2.on("pointerdown", () => {
                this.mqttClient.publish("itl20242/req/" + 12, "0");
                console.log("Botão elefantinho 2 clicado");
              });

              var eleButton3 = this.add.image(
                popup.x - 100,
                popup.y + 100,
                "button3",
              );
              eleButton3.setScale(0.3);
              eleButton3.setScrollFactor(0);
              eleButton3.setDepth(210);
              eleButton3.setInteractive({ useHandCursor: true });
              eleButton3.on("pointerdown", () => {
                console.log("Botão elefantinho 3 clicado");
              });

              var eleButton4 = this.add.image(
                popup.x + 100,
                popup.y + 95,
                "button4",
              );
              eleButton4.setScale(0.3);
              eleButton4.setScrollFactor(0);
              eleButton4.setDepth(210);
              eleButton4.setInteractive({ useHandCursor: true });
              eleButton4.on("pointerdown", () => {
                console.log("Botão elefantinho 4 clicado");
              });

              var closeX_ele = popup.x + popup.displayWidth / 2 - 20;
              var closeY_ele = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_ele = this.add.text(closeX_ele, closeY_ele, "X", {
                fontSize: "32px",
                fill: "#FFF",
                backgroundColor: "#000",
                padding: { x: 5, y: 5 },
              });
              closeButton_ele.setScrollFactor(0);
              closeButton_ele.setDepth(220);
              closeButton_ele.setInteractive({ useHandCursor: true });
              closeButton_ele.on("pointerdown", () => {
                popup.destroy();
                closeButton_ele.destroy();
                eleButton1.destroy();
                eleButton2.destroy();
                eleButton3.destroy();
                eleButton4.destroy();
                this.popupOpen = false;
              });
              break;
            case "chapeuMexicano":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "painelPadrao",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var chapeuButton1 = this.add.image(
                popup.x - 80,
                popup.y + 35,
                "button1",
              );
              chapeuButton1.setScale(0.5);
              chapeuButton1.setScrollFactor(0);
              chapeuButton1.setDepth(210);
              chapeuButton1.setInteractive({ useHandCursor: true });
              chapeuButton1.on("pointerdown", () => {
                console.log("Botão chapeu mexicano 1 clicado");
              });

              var chapeuButton2 = this.add.image(
                popup.x + 80,
                popup.y + 40,
                "button2",
              );
              chapeuButton2.setScale(0.5);
              chapeuButton2.setScrollFactor(0);
              chapeuButton2.setDepth(210);
              chapeuButton2.setInteractive({ useHandCursor: true });
              chapeuButton2.on("pointerdown", () => {
                console.log("Botão chapeu mexicano 2 clicado");
              });

              var closeX_chapeu = popup.x + popup.displayWidth / 2 - 20;
              var closeY_chapeu = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_chapeu = this.add.text(
                closeX_chapeu,
                closeY_chapeu,
                "X",
                {
                  fontSize: "32px",
                  fill: "#FFF",
                  backgroundColor: "#000",
                  padding: { x: 5, y: 5 },
                },
              );
              closeButton_chapeu.setScrollFactor(0);
              closeButton_chapeu.setDepth(220);
              closeButton_chapeu.setInteractive({ useHandCursor: true });
              closeButton_chapeu.on("pointerdown", () => {
                popup.destroy();
                closeButton_chapeu.destroy();
                chapeuButton1.destroy();
                chapeuButton2.destroy();
                this.popupOpen = false;
              });
              break;
            case "zipper":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "popupBg",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var zipperButton1 = this.add.image(
                popup.x - 100,
                popup.y,
                "button1",
              );
              zipperButton1.setScrollFactor(0);
              zipperButton1.setDepth(210);
              zipperButton1.setInteractive({ useHandCursor: true });
              zipperButton1.on("pointerdown", () => {
                console.log("Botão zipper 1 clicado");
              });

              var zipperButton2 = this.add.image(
                popup.x + 100,
                popup.y,
                "button2",
              );
              zipperButton2.setScrollFactor(0);
              zipperButton2.setDepth(210);
              zipperButton2.setInteractive({ useHandCursor: true });
              zipperButton2.on("pointerdown", () => {
                console.log("Botão zipper 2 clicado");
              });

              var closeX_zip = popup.x + popup.displayWidth / 2 - 20;
              var closeY_zip = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_zip = this.add.text(closeX_zip, closeY_zip, "X", {
                fontSize: "32px",
                fill: "#FFF",
                backgroundColor: "#000",
                padding: { x: 5, y: 5 },
              });
              closeButton_zip.setScrollFactor(0);
              closeButton_zip.setDepth(220);
              closeButton_zip.setInteractive({ useHandCursor: true });
              closeButton_zip.on("pointerdown", () => {
                popup.destroy();
                closeButton_zip.destroy();
                zipperButton1.destroy();
                zipperButton2.destroy();
                this.popupOpen = false;
              });
              break;
            case "rodaGigante1":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "popupBg",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var rg1button1 = this.add.image(
                popup.x - 100,
                popup.y,
                "button1",
              );
              rg1button1.setScrollFactor(0);
              rg1button1.setDepth(210);
              rg1button1.setInteractive({ useHandCursor: true });
              rg1button1.on("pointerdown", () => {
                console.log("Botão rodaGigante1 1 clicado");
              });

              var rg1button2 = this.add.image(
                popup.x + 100,
                popup.y,
                "button2",
              );
              rg1button2.setScrollFactor(0);
              rg1button2.setDepth(210);
              rg1button2.setInteractive({ useHandCursor: true });
              rg1button2.on("pointerdown", () => {
                console.log("Botão rodaGigante1 2 clicado");
              });

              var closeX_rg1 = popup.x + popup.displayWidth / 2 - 20;
              var closeY_rg1 = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_rg1 = this.add.text(closeX_rg1, closeY_rg1, "X", {
                fontSize: "32px",
                fill: "#FFF",
                backgroundColor: "#000",
                padding: { x: 5, y: 5 },
              });
              closeButton_rg1.setScrollFactor(0);
              closeButton_rg1.setDepth(220);
              closeButton_rg1.setInteractive({ useHandCursor: true });
              closeButton_rg1.on("pointerdown", () => {
                popup.destroy();
                closeButton_rg1.destroy();
                rg1button1.destroy();
                rg1button2.destroy();
                this.popupOpen = false;
              });
              break;
            case "rodaGigante2":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "popupBg",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var rg2button1 = this.add.image(
                popup.x - 150,
                popup.y - 50,
                "button1",
              );
              rg2button1.setScrollFactor(0);
              rg2button1.setDepth(210);
              rg2button1.setInteractive({ useHandCursor: true });
              rg2button1.on("pointerdown", () => {
                console.log("Botão rodaGigante2 1 clicado");
              });

              var rg2button2 = this.add.image(
                popup.x + 150,
                popup.y - 50,
                "button2",
              );
              rg2button2.setScrollFactor(0);
              rg2button2.setDepth(210);
              rg2button2.setInteractive({ useHandCursor: true });
              rg2button2.on("pointerdown", () => {
                console.log("Botão rodaGigante2 2 clicado");
              });

              var rg2button3 = this.add.image(
                popup.x - 150,
                popup.y + 50,
                "button3",
              );
              rg2button3.setScrollFactor(0);
              rg2button3.setDepth(210);
              rg2button3.setInteractive({ useHandCursor: true });
              rg2button3.on("pointerdown", () => {
                console.log("Botão rodaGigante2 3 clicado");
              });

              var rg2button4 = this.add.image(
                popup.x + 150,
                popup.y + 50,
                "button4",
              );
              rg2button4.setScrollFactor(0);
              rg2button4.setDepth(210);
              rg2button4.setInteractive({ useHandCursor: true });
              rg2button4.on("pointerdown", () => {
                console.log("Botão rodaGigante2 4 clicado");
              });

              var closeX_rg2 = popup.x + popup.displayWidth / 2 - 20;
              var closeY_rg2 = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_rg2 = this.add.text(closeX_rg2, closeY_rg2, "X", {
                fontSize: "32px",
                fill: "#FFF",
                backgroundColor: "#000",
                padding: { x: 5, y: 5 },
              });
              closeButton_rg2.setScrollFactor(0);
              closeButton_rg2.setDepth(220);
              closeButton_rg2.setInteractive({ useHandCursor: true });
              closeButton_rg2.on("pointerdown", () => {
                popup.destroy();
                closeButton_rg2.destroy();
                rg2button1.destroy();
                rg2button2.destroy();
                rg2button3.destroy();
                rg2button4.destroy();
                this.popupOpen = false;
              });
              break;
            case "barcoViking":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "popupBg",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var bvbutton1 = this.add.image(popup.x - 100, popup.y, "button1");
              bvbutton1.setScrollFactor(0);
              bvbutton1.setDepth(210);
              bvbutton1.setInteractive({ useHandCursor: true });
              bvbutton1.on("pointerdown", () => {
                console.log("Botão barcoViking 1 clicado");
              });

              var bvbutton2 = this.add.image(popup.x + 100, popup.y, "button2");
              bvbutton2.setScrollFactor(0);
              bvbutton2.setDepth(210);
              bvbutton2.setInteractive({ useHandCursor: true });
              bvbutton2.on("pointerdown", () => {
                console.log("Botão barcoViking 2 clicado");
              });

              var closeX_bv = popup.x + popup.displayWidth / 2 - 20;
              var closeY_bv = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_bv = this.add.text(closeX_bv, closeY_bv, "X", {
                fontSize: "32px",
                fill: "#FFF",
                backgroundColor: "#000",
                padding: { x: 5, y: 5 },
              });
              closeButton_bv.setScrollFactor(0);
              closeButton_bv.setDepth(220);
              closeButton_bv.setInteractive({ useHandCursor: true });
              closeButton_bv.on("pointerdown", () => {
                popup.destroy();
                closeButton_bv.destroy();
                bvbutton1.destroy();
                bvbutton2.destroy();
                this.popupOpen = false;
              });
              break;
            case "samba":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "popupBg",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var sambabutton1 = this.add.image(
                popup.x - 150,
                popup.y - 50,
                "button1",
              );
              sambabutton1.setScrollFactor(0);
              sambabutton1.setDepth(210);
              sambabutton1.setInteractive({ useHandCursor: true });
              sambabutton1.on("pointerdown", () => {
                console.log("Botão samba 1 clicado");
              });

              var sambabutton2 = this.add.image(
                popup.x + 150,
                popup.y - 50,
                "button2",
              );
              sambabutton2.setScrollFactor(0);
              sambabutton2.setDepth(210);
              sambabutton2.setInteractive({ useHandCursor: true });
              sambabutton2.on("pointerdown", () => {
                console.log("Botão samba 2 clicado");
              });

              var sambabutton3 = this.add.image(
                popup.x - 150,
                popup.y + 50,
                "button3",
              );
              sambabutton3.setScrollFactor(0);
              sambabutton3.setDepth(210);
              sambabutton3.setInteractive({ useHandCursor: true });
              sambabutton3.on("pointerdown", () => {
                console.log("Botão samba 3 clicado");
              });

              var sambabutton4 = this.add.image(
                popup.x + 150,
                popup.y + 50,
                "button4",
              );
              sambabutton4.setScrollFactor(0);
              sambabutton4.setDepth(210);
              sambabutton4.setInteractive({ useHandCursor: true });
              sambabutton4.on("pointerdown", () => {
                console.log("Botão samba 4 clicado");
              });

              var closeX_samba = popup.x + popup.displayWidth / 2 - 20;
              var closeY_samba = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_samba = this.add.text(
                closeX_samba,
                closeY_samba,
                "X",
                {
                  fontSize: "32px",
                  fill: "#FFF",
                  backgroundColor: "#000",
                  padding: { x: 5, y: 5 },
                },
              );
              closeButton_samba.setScrollFactor(0);
              closeButton_samba.setDepth(220);
              closeButton_samba.setInteractive({ useHandCursor: true });
              closeButton_samba.on("pointerdown", () => {
                popup.destroy();
                closeButton_samba.destroy();
                sambabutton1.destroy();
                sambabutton2.destroy();
                sambabutton3.destroy();
                sambabutton4.destroy();
                this.popupOpen = false;
              });
              break;
            case "basquete":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "popupBg",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var basketbutton1 = this.add.image(
                popup.x - 100,
                popup.y,
                "button1",
              );
              basketbutton1.setScrollFactor(0);
              basketbutton1.setDepth(210);
              basketbutton1.setInteractive({ useHandCursor: true });
              basketbutton1.on("pointerdown", () => {
                console.log("Botão basquete 1 clicado");
              });

              var basketbutton2 = this.add.image(
                popup.x + 100,
                popup.y,
                "button2",
              );
              basketbutton2.setScrollFactor(0);
              basketbutton2.setDepth(210);
              basketbutton2.setInteractive({ useHandCursor: true });
              basketbutton2.on("pointerdown", () => {
                console.log("Botão basquete 2 clicado");
              });

              var closeX_basket = popup.x + popup.displayWidth / 2 - 20;
              var closeY_basket = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_basket = this.add.text(
                closeX_basket,
                closeY_basket,
                "X",
                {
                  fontSize: "32px",
                  fill: "#FFF",
                  backgroundColor: "#000",
                  padding: { x: 5, y: 5 },
                },
              );
              closeButton_basket.setScrollFactor(0);
              closeButton_basket.setDepth(220);
              closeButton_basket.setInteractive({ useHandCursor: true });
              closeButton_basket.on("pointerdown", () => {
                popup.destroy();
                closeButton_basket.destroy();
                basketbutton1.destroy();
                basketbutton2.destroy();
                this.popupOpen = false;
              });
              break;
            case "montanhaRussa":
              this.popupOpen = true;
              popup = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "popupBg",
              );
              popup.setScrollFactor(0);
              popup.setDepth(200);
              popup.setScale(0.4);

              var mrbutton1 = this.add.image(popup.x - 100, popup.y, "button1");
              mrbutton1.setScrollFactor(0);
              mrbutton1.setDepth(210);
              mrbutton1.setInteractive({ useHandCursor: true });
              mrbutton1.on("pointerdown", () => {
                console.log("Botão montanha russa 1 clicado");
              });

              var mrbutton2 = this.add.image(popup.x + 100, popup.y, "button2");
              mrbutton2.setScrollFactor(0);
              mrbutton2.setDepth(210);
              mrbutton2.setInteractive({ useHandCursor: true });
              mrbutton2.on("pointerdown", () => {
                console.log("Botão montanha russa 2 clicado");
              });

              var closeX_mr = popup.x + popup.displayWidth / 2 - 20;
              var closeY_mr = popup.y - popup.displayHeight / 2 + 20;
              var closeButton_mr = this.add.text(closeX_mr, closeY_mr, "X", {
                fontSize: "32px",
                fill: "#FFF",
                backgroundColor: "#000",
                padding: { x: 5, y: 5 },
              });
              closeButton_mr.setScrollFactor(0);
              closeButton_mr.setDepth(220);
              closeButton_mr.setInteractive({ useHandCursor: true });
              closeButton_mr.on("pointerdown", () => {
                popup.destroy();
                closeButton_mr.destroy();
                mrbutton1.destroy();
                mrbutton2.destroy();
                this.popupOpen = false;
              });
              break;
            default:
              console.log(`Colisão com ${colliderMsg}`);
          }
        } else {
          console.log(`Colisão com ${colliderMsg}`);
        }
      });
    };

    // CRIAÇÃO DOS BRINQUEDOS – defina as posições desejadas
    criarBrinquedo(1500, 1600, "elefantinho", 0.5, "elefantinho");
    criarBrinquedo(600, 660, "chapeuMexicano", 0.4, "chapeuMexicano");
    criarBrinquedo(1200, 800, "zipper", 0.5, "zipper");
    criarBrinquedo(500, 400, "rodaGigante1", 0.5, "rodaGigante1");
    criarBrinquedo(1450, 880, "rodaGigante2", 0.3, "rodaGigante2");
    criarBrinquedo(570, 1310, "barcoViking", 0.2, "barcoViking");
    criarBrinquedo(1430, 1330, "basquete", 0.4, "basquete");
    criarBrinquedo(1550, 370, "montanhaRussa", 0.7, "montanhaRussa");
    criarBrinquedo(500, 1600, "samba", 0.5, "samba");
  }

  update() {
    const angle = Phaser.Math.DegToRad(this.joystick.angle); // Converte o ângulo para radianos
    const force = this.joystick.force;

    if (force > 0.1) {
      const velocityX = Math.cos(angle) * 200;
      const velocityY = Math.sin(angle) * 200;

      this.jogador.setVelocity(velocityX, velocityY);

      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.jogador.anims.play("andar_direita", true);
          this.direcaoAtual = "direita";
        } else {
          this.jogador.anims.play("andar_esquerda", true);
          this.direcaoAtual = "esquerda";
        }
      } else {
        if (velocityY > 0) {
          this.jogador.anims.play("andar_baixo", true);
          this.direcaoAtual = "baixo";
        } else {
          this.jogador.anims.play("andar_cima", true);
          this.direcaoAtual = "cima";
        }
      }
    } else {
      this.jogador.setVelocity(0);
      this.jogador.anims.play("parado", true);
    }
  }
}
