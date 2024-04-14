import pika
import os
import json
from dotenv import load_dotenv
load_dotenv()

cloudMqttUrl = os.getenv('CLOUDMQTT_URL')
connection = pika.BlockingConnection(pika.URLParameters(cloudMqttUrl))

def get_channel():
    return connection.channel()

