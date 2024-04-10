import * as fs from 'fs';
import { FileAstContent, ProjectMetaData } from '../models';
import { fileConstructor, filePathResolver, getAstFromCode, getCodeFromAstNode, getFilePathFromImports, getFunctionsFromExports, getIdentifiersFromAst, isParentProgram, lineCodeMappingToCodeFile, removeUnusedVariables } from './ast.helpers';
import { FileContructorObject } from '../utils/interfaces';
import { extractContentsOfFile } from './file_content_extractor';
import * as t from '@babel/types';
import { NodeTypes } from '../common/constants';
import { readFileContent } from '../common/helpers';
import { tgen } from '../test_generator/tgen';


const processedFiles = new Set();
const filesToProcess: string[] = [];

export function generateTests(projectInfo:ProjectMetaData){

    filesToProcess.push(projectInfo.entryFile)
    const results = [] as string[]
    while (filesToProcess.length > 0) {
        const currentFilePath: string = filesToProcess.shift() as string;
        if (processedFiles.has(currentFilePath)) continue;
        const code = fs.readFileSync(projectInfo.entryFile, 'utf-8');
        const ast = getAstFromCode(code);
        const extractedContents = extractContentsOfFile(ast);
        processedFiles.add(currentFilePath);
        const exportedFunctions = getFunctionsFromExports(extractedContents);
        const exportWiseFiles = [] as  any[];
        for(const functionNode of exportedFunctions){
          const allFiles =   buildFunctionContext(functionNode , extractedContents,projectInfo)
            exportWiseFiles.push(allFiles)
        }
        results.push(...exportWiseFiles)
    }
    tgen(results);
    return results
}


function buildFunctionContext(exportedNode:t.Node ,fileContent:FileAstContent , projectInfo:ProjectMetaData){

    const functionToTest = getCodeFromAstNode(exportedNode).code;
    const functionFirstFile = fileConstructor(fileContent, functionToTest);
    const functionProjectContext = [`//File location - ${projectInfo.entryFile}\n\n${lineCodeMappingToCodeFile(functionFirstFile.lineCodeMapping)}`] as string[];
    const unknownImports = fileContent.unknowDeclarations.filter(node => node.type == NodeTypes.ImportDeclaration) as t.ImportDeclaration[];
    let importsQue = [...functionFirstFile.meta.importDeclarations.map(node => ({node, parent:projectInfo.entryFile})),...unknownImports.map(node => ({node, parent:projectInfo.entryFile}))]
    const fileContentMapping = {} as {[key:string]:{
        [key:number]:string
    }};

    while(importsQue.length){
        const tempQue = [] as any[]
        for(const {node:importNode , parent} of importsQue){
            const importFilePath = getFilePathFromImports( projectInfo,parent, [importNode])[0];
            if(!importFilePath) continue;
            const identifiers = getIdentifiersFromAst(getAstFromCode(getCodeFromAstNode(importNode).code));
            const code = readFileContent(importFilePath);
            const ast = getAstFromCode(code);
            const contnentsFromAst = extractContentsOfFile(ast);
            const fileObject = fileConstructor(contnentsFromAst, undefined , identifiers);
            fileContentMapping[importFilePath] = {...(fileContentMapping[importFilePath]||{}),...fileObject.lineCodeMapping};
            tempQue.push(...fileObject.meta.importDeclarations.map(node => ({node, parent:importFilePath})));
            }
            importsQue = tempQue;
    }
    for(const [filePath,fileMapping] of Object.entries(fileContentMapping)){
            if(!Object.values(fileMapping).map(line => line.trim()).filter(l => l).length)continue;
            functionProjectContext.push(`//File location - ${filePath}\n\n${lineCodeMappingToCodeFile(fileMapping)}`);
    }

    return functionProjectContext;
}


