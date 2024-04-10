import amqp from 'amqplib';
import config from '../config';
import { UTMessageFormat } from '../utils/interfaces';

const cloudmqtt_url  = config.cloudMqttUrl;
let channel:amqp.Channel;

const que_names = ['default_que','message_input_que','message_output_que'];

export async function initPubsubClient() {
    const connection = await amqp.connect(cloudmqtt_url);
    channel = await connection.createChannel();

    await Promise.all(que_names.map(qn => channel.assertQueue(qn)))
    return channel;
}

export async function publishToQue(message:UTMessageFormat, params:any={}){
    const queName = params.queName??que_names[0];
    channel.sendToQueue(queName, Buffer.from(JSON.stringify(message)),{});
}

export async function readFromQue( handler ,params:any={}) {
    const queName = params.queName??que_names[0];
    await channel.consume(queName ,handler ,{noAck:true})
}