#include <WiFi.h>
#include <PubSubClient.h>

#define LED_BUILTIN 2
#define SENSOR 5
#define LED 4

#define SSID "itl"
#define PASSWORD "itl20242"

#define MQTT_SERVER "itl.sj.ifsc.edu.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "brinquedo-7"
#define MQTT_TOPIC_REQ "itl20242/req/7"
#define MQTT_TOPIC_RES "itl20242/res/7"

WiFiClient espClient;
PubSubClient client(espClient);
int placar = 0;

void callback(char *topic, byte *payload, unsigned int length)
{
  for (int i = 0; i < 3; i++)
  {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
  }
  if (payload[0] == '0')
  {
    Serial.println("Zerando o placar...");
    for (int i = 0; i < 3; i++)
    {
      digitalWrite(LED, HIGH);
      delay(100);
      digitalWrite(LED, LOW);
      delay(100);
    }
    placar = 0;
    client.publish(MQTT_TOPIC_RES, "0");
  }
  else if (payload[0] == '1')
  {
    Serial.println("Incrementando o placar...");
    digitalWrite(LED, HIGH);
    delay(500);
    digitalWrite(LED, LOW);

    placar++;
    client.publish(MQTT_TOPIC_RES, "1");
  }
  else if (payload[0] == '2')
  {
    Serial.println("Decrementando o placar...");
    digitalWrite(LED, HIGH);
    delay(500);
    digitalWrite(LED, LOW);

    placar--;
    client.publish(MQTT_TOPIC_RES, "2");
  }
}

void setup()
{
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(LED, OUTPUT);
  pinMode(SENSOR, INPUT);
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Conectando ao Wi-Fi...");
  }
  Serial.println("Conectado ao Wi-Fi!");
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void loop()
{
  delay(50);
  if (digitalRead(SENSOR) == LOW)
  {
    placar++;
    digitalWrite(LED, HIGH);
    delay(3000);
    digitalWrite(LED, LOW);
    Serial.println(placar);
  }
  if (!client.connected())
  {
    digitalWrite(LED_BUILTIN, LOW);
    if (client.connect(MQTT_CLIENT_ID))
    {
      Serial.println("Conectado ao broker MQTT!");
      digitalWrite(LED_BUILTIN, HIGH);
      client.subscribe(MQTT_TOPIC_REQ);
    }
    else
    {
      Serial.print("Broker MQTT: reconectando em 5s...");
      delay(5000);
    }
  }
  client.loop();
}
