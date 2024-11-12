from dotenv import load_dotenv
from os import getenv
import paho.mqtt.client as mqtt
from re import compile
import serial

load_dotenv()
mqtt_host = getenv("MQTT_HOST", default="test.mosquitto.org")
mqtt_topic = getenv("MQTT_TOPIC", default="itl20242/req")
serial_port = getenv("SERIAL_PORT", default="/dev/ttyACM0")


def on_connect(client, userdata, flags, reason_code, properties):
    print("Conectado ao broker MQTT")
    client.subscribe(mqtt_topic + "/#")


def on_message(client, userdata, msg):
    print(msg.topic, msg.payload.decode())
    if compile(mqtt_topic + "/1?[0-9]").fullmatch(msg.topic):
        disciplina, sentido, brinquedo = msg.topic.split("/")
        comando = msg.payload.decode()
        mensagem = "".join([brinquedo, comando, "\n"])
        try:
            microbit.write(mensagem).encode()
        except Exception as e:
            print(e)
            print(mensagem)
        mqtt_client.publish(f"{disciplina}/res/{brinquedo}", comando)


try:
    microbit = serial.Serial(serial_port, 115200)
except Exception as e:
    print(e)

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(mqtt_host)
mqtt_client.loop_forever()
