#include <ESP32Servo.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define LED_BUILTIN 2
#define SERVO_PIN 4

#define SSID "itl"
#define PASSWORD "itl20242"

#define MQTT_SERVER "itl.sj.ifsc.edu.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "brinquedo-3"
#define MQTT_TOPIC_REQ "itl20242/req/3"
#define MQTT_TOPIC_RES "itl20242/res/3"

Servo myServo;
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
    Serial.println("Servo parado em 90 graus...");
    myServo.write(90);
    client.publish(MQTT_TOPIC_RES, "0");
  }
  else if (payload[0] == '1')
  {
    Serial.println("Iniciando 5 voltas com o servo...");
    for (int voltas = 0; voltas < 3; voltas++)
    {
      for (int i = 0; i < 180; i++)
      {
        myServo.write(i);
        delay(5);
      }
      for (int i = 180; i > 0; i--)
      {
        myServo.write(i);
        delay(5);
      }
    }
    client.publish(MQTT_TOPIC_RES, "1");
  }
}

void setup()
{
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  myServo.attach(SERVO_PIN);
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
      Serial.print("Broker MQTT: reconectando em 1s...");
      delay(1000);
    }
  }
  client.loop();
}
