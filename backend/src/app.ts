import { generateTests } from "./extractor/ast_parser";
import { initPubsubClient, publishToQue, readFromQue } from "./clients/pubsub_client";
import { ProjectMetaData } from "./models";
import  argParser from 'args-parser';

const args = argParser(process.argv) as ProjectMetaData;
// const entryFile = '/home/harsh/chat-stocks/test_app/src/fruit_api.ts';
// const projectDir = '/home/harsh/chat-stocks/test_app/';
// const aliasMap = { '@src': '/home/harsh/chat-stocks/test_app/' };
// const testDir = '/home/harsh/chat-stocks/__test__/'

console.log('Args' ,process.argv)

function validateArgument() {

    const requiredArgs = ['entryFile', 'projectDir', 'aliasMap', 'testDir' ,'fileExtension'];

    if(args.fileExtension != 'ts'){
        throw new Error('File extension must be ts')
    }
    for (const arg of requiredArgs) {
        if (!(arg in args)) {
            throw new Error(`Missing required argument: ${arg}`);
        }
    }

}




async function main() {
    validateArgument();
    await Promise.all([initPubsubClient()])
    const projectInfo: ProjectMetaData = args;

    generateTests(projectInfo);
}

main()


