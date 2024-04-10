import fs from 'fs';

export function readFileContent(filePath){
    try{
        return fs.readFileSync(filePath as string, 'utf-8');

    }catch(e){
        console.log('Error in reading the file: ' , filePath)
    }

    return ""
}