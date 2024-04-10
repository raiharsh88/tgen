import { publishToQue, readFromQue } from "../clients/pubsub_client";
import amqp from 'amqplib'
import { UTMessageFormat, UTMessageType } from "../utils/interfaces";
import { v4 as uuid } from 'uuid';
import fs from 'fs';

const outputFile = "/home/harsh/chat-stocks/backend/outdir/current.test.ts";
const outputDir = "/home/harsh/chat-stocks/test_app/outdir/__tests__";

const queNames = {
    inputQue: 'message_input_que',
    outputQue: 'message_output_que'
}
const timestamps = {} as any
const messageCache = {}
export function tgen(codeChunks) {
    readFromQue((ctx) => {
        if (ctx.content) {
            const message = JSON.parse(ctx.content.toString()) as UTMessageFormat;

            if (message.message_type == UTMessageType.CODE_CHUNK) {
                handleCodeChunks(message)
            } else if (message.message_type == UTMessageType.TEST_CHUNK) {
                handleTestChunks(message)
            }
        }
    }, {
        queName: queNames.outputQue
    });
    pushCodeChunks(codeChunks)
}

async function handleCodeChunks(message: UTMessageFormat) {
    console.log('Code generated',message.body[0].length)
    const fileCount = (await countFilesInDirectory(outputDir))||0;
    fs.writeFileSync(outputDir+'/test'+((fileCount)+1)+'.test.ts', message.body[0])
    const groupId = message.group_id;
    if (groupId in messageCache) {
        messageCache[groupId].push(message)
    } else {
        messageCache[groupId] = [message]
    }

    const { group_sequence_no, group_size } = message;

    if (group_sequence_no == group_size) {
        const codeChunks = messageCache[groupId];
        delete messageCache[groupId]
        //push code chunks to db
        pushTestChunks(codeChunks);
    }
}

async function handleTestChunks(message: UTMessageFormat) {
    console.log('Test generated', message.body[0].length)
    const fileCount = (await countFilesInDirectory(outputDir))||0;
    // const filePath = `${outputDir}/test_suite_${fileCount+1}.test.ts`; 
    const filePath = `${outputDir}/output.test.ts`; 

    for(const chunk of message.body[0].split('')){
        fs.appendFileSync(filePath, chunk);
        await new Promise(r => setTimeout(r, 1));
    }
    console.log('Test file written', filePath)
    // fs.writeFileSync(filePath, message.body[0]);
    console.log('Total time',Date.now()-timestamps[message.group_id])
}

async function pushTestChunks(testChunks: UTMessageFormat[]) {
    const chunks = testChunks.map(chunk => chunk.body[0]);
    const message: UTMessageFormat = {
        message_type: UTMessageType.TEST_CHUNK,
        body: chunks,
        group_id: uuid(),
        group_size: 1,
        group_sequence_no: 1,
        message_id: uuid()
    };
    timestamps[message.group_id] = timestamps[testChunks[0].group_id]
    console.log('Pusing combined' ,message.message_type , message.body.length)
    publishToQue(message, {queName:queNames.inputQue});
}

async function pushCodeChunks(codeChunks: string[][]) {
    const group_id = uuid();
    timestamps[group_id] = Date.now();
    codeChunks.forEach((chunk, index) => {
        const message: UTMessageFormat = {
            message_type: UTMessageType.CODE_CHUNK,
            body: [chunk.map(c => `[File] ${c} [/File]`).join('\n')],
            group_id,
            group_size: codeChunks.length,
            group_sequence_no: index+1,
            message_id: uuid()
        };
        publishToQue(message , {queName:queNames.inputQue});
    })
    console.log("code chunks pushed")
}



function countFilesInDirectory(directoryPath):Promise<number> {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files.length);
        });
    });
}
