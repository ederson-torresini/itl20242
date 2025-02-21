#include <ESP32Servo.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define LED_BUILTIN 2
#define SERVO_PIN 4
#define MOTOR 18

#define SSID "itl"
#define PASSWORD "itl20242"

#define MQTT_SERVER "itl.sj.ifsc.edu.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "brinquedo-5"
#define MQTT_TOPIC_REQ "itl20242/req/5"
#define MQTT_TOPIC_RES "itl20242/res/5"

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
    Serial.println("Desligando o motor...");
    digitalWrite(MOTOR, LOW);
    client.publish(MQTT_TOPIC_RES, "0");
  }
  else if (payload[0] == '1')
  {
    Serial.println("Ligando o motor...");
    digitalWrite(MOTOR, HIGH);
    client.publish(MQTT_TOPIC_RES, "1");
  }
  else if (payload[0] == '2')
  {
    Serial.println("Movendo o servo para frente...");
    for (int i = 0; i < 180; i++)
    {
      myServo.write(i);
      delay(10);
    };
  }
  else if (payload[0] == '3')
  {
    Serial.println("Movendo o servo para trás...");
    for (int i = 180; i > 0; i--)
    {
      myServo.write(i);
      delay(10);
    };
  }
}

void setup()
{
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(MOTOR, OUTPUT);
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
