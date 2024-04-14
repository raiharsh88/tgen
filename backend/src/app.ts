import { generateTests } from "./extractor/ast_parser";
import { initPubsubClient, publishToQue, readFromQue } from "./clients/pubsub_client";
import { ProjectMetaData } from "./models";

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


