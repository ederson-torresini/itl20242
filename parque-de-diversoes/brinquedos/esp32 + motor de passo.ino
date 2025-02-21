#include <WiFi.h>
#include <PubSubClient.h>

#define LED_BUILTIN 2
#define IN1_PIN 16
#define IN2_PIN 4
#define IN3_PIN 2
#define IN4_PIN 15

#define SSID "itl"
#define PASSWORD "itl20242"

#define MQTT_SERVER "itl.sj.ifsc.edu.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "brinquedo-5"
#define MQTT_TOPIC_REQ "itl20242/req/5"
#define MQTT_TOPIC_RES "itl20242/res/5"

WiFiClient espClient;
PubSubClient client(espClient);

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
    Serial.println("Ligando o motor em sentido horário...");
    for (int i = 0; i < 32; i++)
    {
      digitalWrite(IN1_PIN, HIGH);
      digitalWrite(IN2_PIN, LOW);
      digitalWrite(IN3_PIN, LOW);
      digitalWrite(IN4_PIN, LOW);
      delay(10);
      digitalWrite(IN1_PIN, LOW);
      digitalWrite(IN2_PIN, HIGH);
      digitalWrite(IN3_PIN, LOW);
      digitalWrite(IN4_PIN, LOW);
      delay(10);
      digitalWrite(IN1_PIN, LOW);
      digitalWrite(IN2_PIN, LOW);
      digitalWrite(IN3_PIN, HIGH);
      digitalWrite(IN4_PIN, LOW);
      delay(10);
      digitalWrite(IN1_PIN, LOW);
      digitalWrite(IN2_PIN, LOW);
      digitalWrite(IN3_PIN, LOW);
      digitalWrite(IN4_PIN, HIGH);
      delay(10);
    }
    client.publish(MQTT_TOPIC_RES, "0");
  }
  else if (payload[0] == '1')
  {
    Serial.println("Ligando o motor em sentido anti-horário...");
    for (int i = 0; i < 32; i++)
    {
      digitalWrite(IN4_PIN, HIGH);
      digitalWrite(IN3_PIN, LOW);
      digitalWrite(IN2_PIN, LOW);
      digitalWrite(IN1_PIN, LOW);
      delay(10);
      digitalWrite(IN4_PIN, LOW);
      digitalWrite(IN3_PIN, HIGH);
      digitalWrite(IN2_PIN, LOW);
      digitalWrite(IN1_PIN, LOW);
      delay(10);
      digitalWrite(IN4_PIN, LOW);
      digitalWrite(IN3_PIN, LOW);
      digitalWrite(IN2_PIN, HIGH);
      digitalWrite(IN1_PIN, LOW);
      delay(10);
      digitalWrite(IN4_PIN, LOW);
      digitalWrite(IN3_PIN, LOW);
      digitalWrite(IN2_PIN, LOW);
      digitalWrite(IN1_PIN, HIGH);
      delay(10);
    }
    client.publish(MQTT_TOPIC_RES, "1");
  }
  digitalWrite(IN4_PIN, LOW);
  digitalWrite(IN3_PIN, LOW);
  digitalWrite(IN2_PIN, LOW);
  digitalWrite(IN1_PIN, LOW);
}

void setup()
{
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(IN1_PIN, OUTPUT);
  pinMode(IN2_PIN, OUTPUT);
  pinMode(IN3_PIN, OUTPUT);
  pinMode(IN4_PIN, OUTPUT);
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
