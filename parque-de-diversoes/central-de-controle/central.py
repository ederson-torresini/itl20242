from dotenv import load_dotenv
from os import getenv
import paho.mqtt.client as mqtt
from re import compile
import serial

load_dotenv()
mqtt_host = getenv("MQTT_HOST", default="itl.sj.ifsc.edu.br")
mqtt_transport = getenv("MQTT_TRANSPORT", default="websockets")
mqtt_secure = getenv("MQTT_SECURE", default="true") == "true"
mqtt_port = int(getenv("MQTT_PORT", default="443"))
mqtt_timeout = int(getenv("MQTT_TIMEOUT", default="60"))
mqtt_resource = getenv("MQTT_RESOURCE", default="/mqtt/")
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


if __name__ == "__main__":
    try:
        microbit = serial.Serial(serial_port, 115200)
    except Exception as e:
        print(e)

    mqtt_client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2, transport=mqtt_transport
    )
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.ws_set_options(path=mqtt_resource)
    if mqtt_secure:
        mqtt_client.tls_set()
    mqtt_client.connect(mqtt_host, mqtt_port, mqtt_timeout)
    mqtt_client.loop_forever()
