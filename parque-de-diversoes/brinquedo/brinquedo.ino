#include <WiFi.h>
#include <PubSubClient.h>


// Pinagem do motor
#define MOTOR 12

// Wi-Fi
#define SSID "itl"
#define PASSWORD "itl20242"

// MQTT
#define MQTT_SERVER "itl.sj.ifsc.edu.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "brinquedo-5"
#define MQTT_TOPIC_REQ "itl20242/req/5"
#define MQTT_TOPIC_RES "itl20242/res/5"


// Cliente Wi-Fi e MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// Função de callback para receber mensagens MQTT
void callback(char *topic, byte *payload, unsigned int length)
{
  // Pisca o LED embutido 3 vezes em intervalos de 100ms
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
  }

    // Verificar o valor da mensagem
    if (payload[0] == '0')
    {
      Serial.println("Desligando o motor...");

      // Publicar no tópico MQTT que o comando deu certo
      client.publish(MQTT_TOPIC_RES, "0");
    }
    else if (payload[0] == '1')
    {
      Serial.println("Ligando o motor...");

      // Ligar o motor
      digitalWrite(MOTOR, HIGH);

      // Publicar no tópico MQTT que o comando deu certo
      client.publish(MQTT_TOPIC_RES, "1");
    }
}

void setup()
{
  // Interface serial
  Serial.begin(9600);

  // Wi-Fi
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Conectando ao Wi-Fi...");
  }
  Serial.println("Conectado ao Wi-Fi!");

  // Conexão com o broker MQTT
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void loop()
{
  // Verificar se está conectado no broker MQTT
  if (!client.connected())
  {
    // Desligar o LED embutido da placa
    digitalWrite(LED_BUILTIN, LOW);

    // (Re)Conectar com o broker MQTT, se necessário
    if (client.connect(MQTT_CLIENT_ID))
    {
      Serial.println("Conectado ao broker MQTT!");

      // Ligar o LED embutido da placa
      digitalWrite(LED_BUILTIN, HIGH);

      // Inscrever no tópico de requisição
      client.subscribe(MQTT_TOPIC_REQ);
    }
    else
    {
      Serial.print("Falha na reconexão com o broker MQTT. Tentando novamente em 5 segundos...");
      delay(5000);
    }
  }

  // Loop para manter a conexão MQTT ativa
  client.loop();
}
