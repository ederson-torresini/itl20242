#include <Adafruit_LiquidCrystal.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define LED_BUILTIN 2
#define LCD_SPI_DATA 3
#define LCD_SPI_CLOCK 2
#define LCD_SPI_LATCH 4
#define SENSOR 12

#define SSID "itl"
#define PASSWORD "itl20242"

#define MQTT_SERVER "itl.sj.ifsc.edu.br"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "brinquedo-5"
#define MQTT_TOPIC_REQ "itl20242/req/5"
#define MQTT_TOPIC_RES "itl20242/res/5"

Adafruit_LiquidCrystal lcdDisplay(LCD_SPI_DATA, LCD_SPI_CLOCK, LCD_SPI_LATCH);
WiFiClient espClient;
PubSubClient client(espClient);
int placar = 0;

void atualizarPlacar()
{
  lcdDisplay.setCursor(8, 0);
  lcdDisplay.print(placar);
}

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
    placar = 0;
    atualizarPlacar();
    client.publish(MQTT_TOPIC_RES, "0");
  }
  else if (payload[0] == '1')
  {
    Serial.println("Incrementando o placar...");
    placar++;
    atualizarPlacar();
    client.publish(MQTT_TOPIC_RES, "1");
  }
}

void setup()
{
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  lcdDisplay.begin(16, 2);
  lcdDisplay.setCursor(0, 0);
  lcdDisplay.print("Placar: 0");
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
  if (digitalRead(SENSOR) == HIGH)
  {
    placar++;
    atualizarPlacar();
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
