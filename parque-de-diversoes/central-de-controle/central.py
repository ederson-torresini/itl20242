from dotenv import load_dotenv
import paho.mqtt.client as mqtt
from re import search

load_dotenv()
mqtt_host = os.getenv("MQTT_HOST", default="mqtt-broker")
mqtt_port = os.getenv("MQTT_PORT", default=1883)
mqtt_topic = os.getenv("MQTT_TOPIC", default="itl20242/atualizar")
mqtt_keepalive = os.getenv("MQTT_KEEPALIVE", default=60)

def on_connect(client, userdata, flags, reason_code, properties):
    client.subscribe(mqtt_topic)   

def on_message(client, userdata, msg):
    if re.compile(mqtt_topic + "/[1-9]?[0-9]+").match(msg.topic):
        class, direction, attraction = msg.topic.split("/")
        payload = msg.payload.decode()
        mqtt_client.publish(f"{class}/estado/{attraction}", payload)

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

mqttc.connect(mqtt_host, mqtt_port, mqtt_keepalive)
mqttc.loop_forever()
