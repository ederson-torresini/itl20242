from dotenv import load_dotenv
import paho.mqtt.client as mqtt
from re import compile
from os import getenv

load_dotenv()
mqtt_host = getenv("MQTT_HOST", default="test.mosquitto.org")
mqtt_topic = getenv("MQTT_TOPIC", default="itl20242/atualizar")


def on_connect(client, userdata, flags, reason_code, properties):
    print("Conectado ao broker MQTT")
    client.subscribe(mqtt_topic + "/#")


def on_message(client, userdata, msg):
    print(msg.topic, msg.payload.decode())
    if compile(mqtt_topic + "/1?[0-9]").fullmatch(msg.topic):
        disciplina, sentido, brinquedo = msg.topic.split("/")
        comando = msg.payload.decode()
        mqtt_client.publish(f"{disciplina}/estado/{brinquedo}", comando)


mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

mqtt_client.connect(mqtt_host)
mqtt_client.loop_forever()
