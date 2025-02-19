#include <Ethernet.h>
#include <PubSubClient.h>

// Pinagem para ESP32
#define LED_BUILTIN 2
#define MOTOR 12

// MQTT
#define MQTT_SERVER "itl.sj.ifsc.edu.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "brinquedo-5"
#define MQTT_TOPIC_REQ "itl20242/req/5"
#define MQTT_TOPIC_RES "itl20242/res/5"

// Cliente Ethernet e MQTT
byte mac[] = {0xDE, 0xED, 0xBA, 0xFE, 0xFE, 0xEF};
EthernetClient ethClient;
PubSubClient client(ethClient);

// Função de callback para receber mensagens MQTT
void callback(char *topic, byte *payload, unsigned int length) {
  // Pisca o LED embutido 3 vezes em intervalos de 100ms
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
  }

  // Verificar o valor da mensagem
  if (payload[0] == '0') {
    Serial.println("Desligando o motor...");

    // Desligar o motor
    digitalWrite(MOTOR, LOW);

    // Publicar no tópico MQTT que o comando deu certo
    client.publish(MQTT_TOPIC_RES, "0");
  } else if (payload[0] == '1') {
    Serial.println("Ligando o motor...");

    // Ligar o motor
    digitalWrite(MOTOR, HIGH);

    // Publicar no tópico MQTT que o comando deu certo
    client.publish(MQTT_TOPIC_RES, "1");
  }
}

void setup() {
  // Configurar os pinos, LED embutido e motor, como saída
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(MOTOR, OUTPUT);

  // Interface serial
  Serial.begin(9600);

  // Ethernet
  Ethernet.begin(mac);
  while (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Aguardando a conexão Ethernet...");
    delay(500);
  }

  // Conexão com o broker MQTT
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void loop() {
  // Verificar se está conectado no broker MQTT
  if (!client.connected()) {
    // Desligar o LED embutido da placa
    digitalWrite(LED_BUILTIN, LOW);

    // (Re)Conectar com o broker MQTT, se necessário
    if (client.connect(MQTT_CLIENT_ID)) {
      Serial.println("Conectado ao broker MQTT!");

      // Ligar o LED embutido da placa
      digitalWrite(LED_BUILTIN, HIGH);

      // Inscrever no tópico de requisição
      client.subscribe(MQTT_TOPIC_REQ);
    } else {
      Serial.print("Broker MQTT: reconectando em 5s...");
      delay(5000);
    }
  }

  // Loop para manter a conexão MQTT ativa
  client.loop();
}
