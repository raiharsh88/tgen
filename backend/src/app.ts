import db from "./common/db";
import { generateTests } from "./extractor/ast_parser";
import { initPubsubClient, publishToQue, readFromQue } from "./clients/pubsub_client";
import { initialiseCrawler } from "./scraper/scraper";
import { UTMessageFormat } from "./utils/interfaces";
import amqp from "amqplib";
import { tgen } from "./test_generator/tgen";
import { ProjectMetaData } from "./models";


const websiteUrl = 'https://python.langchain.com/docs/get_started/quickstart';



// db.connect().then(() => {
//     console.log('Connected to database');
//     main()
// }).catch(console.log)



const entryFile = '/home/harsh/chat-stocks/test_app/src/fruit_api.ts';
const projectDir = '/home/harsh/chat-stocks/test_app/';
const aliasMap = { '@src': '/home/harsh/chat-stocks/test_app/' };
const testDir = '/home/harsh/chat-stocks/__test__/'


const projectInfo: ProjectMetaData = { aliasMap, projectDir, entryFile, fileExtension: 'ts' ,testDir};



async function main() {
    await Promise.all([initPubsubClient()])
    generateTests(projectInfo);
}

main()


