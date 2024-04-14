import pika
import os
import json
from generator.llama import generate_unit_test,combine_unit_test
from common.amqp import get_channel
channel = get_channel()
input_que_name = "message_input_que"
output_que_name = "message_output_que"
def push_result(result):
    channel.basic_publish(exchange='',
                          routing_key=output_que_name,
                          body=json.dumps(result))
    
def callback(ch, method, properties, body):
    message = json.loads(body)

    if message['message_type'] =='test_chunk':
        return push_result(combine_unit_test(message))
        
    else:
        return push_result(generate_unit_test(message))

def main():
    channel.basic_consume(queue=input_que_name,
                      on_message_callback=callback,
                      auto_ack=True)
    channel.start_consuming()
main()