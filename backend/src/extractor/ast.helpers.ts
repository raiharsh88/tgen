import path from "path";
import { FileAstContent, ProjectMetaData } from "../models";
import { ExportTypes, NodeTypes, ParentTypes } from "../common/constants";
import * as t from '@babel/types';
import * as babel from '@babel/core';
import * as parser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';
import * as babelGenerate from '@babel/generator';
import { NodePath } from "@babel/traverse";
import { FileContructorObject } from "../utils/interfaces";

const generate = babelGenerate.default
const traverse = babelTraverse.default;
export function filePathResolver({aliasMap , projectDir,currentFilePath,fileExtension}:ProjectMetaData&{currentFilePath:string}, files:string[]){
    return new Set(files.map( (file:string) => {
        if(file.search(`.${fileExtension}`)){
            file+=`.${fileExtension}`
        }
        if(file.startsWith('@')){
            const aliasKey = file.split('/')[0];
            const alias = aliasMap[aliasKey]
            return file.replace(aliasKey,alias)
        }else if(file.startsWith(projectDir)){
            return file
        }else if (file.startsWith('.')){
            return path.resolve(currentFilePath.split('/').slice(0 , -1).join('/'), file)
        }else{
            return undefined
        }

    }).filter(file=> file))

}



export function getFunctionsFromExports(contents:FileAstContent){
    const functionsToTest:(typeof contents.exportDeclarations)[''][] = []
    const functionDeclarations = contents.functionDeclarations;
    const exportDeclarations = contents.exportDeclarations;

    for(const [exportName , exportedNode] of Object.entries(exportDeclarations)){
        if(exportName == '*'){
            // no support for export all declaration for now
            continue;
        }else if(exportName == 'default'){

            const defaultExportNode = exportedNode as any;
            // const extractedFunction = 
            if(defaultExportNode.declaration.type ==NodeTypes.FunctionDeclaration){
                functionsToTest.push(exportedNode);
            }else{
                const identifierName = defaultExportNode.declaration.name;
                if(identifierName && functionDeclarations[identifierName] != undefined){
                    functionsToTest.push(exportedNode);
                }else{
                    console.log('The exported node ' ,identifierName ,'is not a function');
                }
            }
        }else if(exportedNode.type == ExportTypes.ExportNamedDeclaration){
            // if the declaration is directly made here
            const namedDeclarationNode = exportedNode as t.ExportNamedDeclaration;

            if(namedDeclarationNode.declaration){
                if(namedDeclarationNode.declaration.type == NodeTypes.FunctionDeclaration){
                    functionsToTest.push(namedDeclarationNode);
                }else if(namedDeclarationNode.declaration.type == NodeTypes.VariableDecalaration){
                    const variableDeclaration = namedDeclarationNode.declaration as t.VariableDeclaration;
                    const initVariable = variableDeclaration.declarations[0]?.init as t.Identifier;
                    if(initVariable.name){
                        const functionDeclaration = functionDeclarations[initVariable.name];
                        if(functionDeclaration){
                            functionsToTest.push(namedDeclarationNode);
                        }
                    }
                }
        }else if(namedDeclarationNode.specifiers?.length){
            namedDeclarationNode.specifiers = namedDeclarationNode.specifiers.filter(specifier=>{
                const exportedIdentifier = specifier.exported as t.Identifier;
                if(exportedIdentifier.name && functionDeclarations[exportedIdentifier.name]){
                    return true;
                }else{
                    return false;
                }
            })

            if(namedDeclarationNode.specifiers.length){
                functionsToTest.push(namedDeclarationNode);
            }
        }
    }
}
    return functionsToTest
}


export function getCodeFromAstNode(node:any){
   return babel.transformFromAstSync(
        babel.types.file(babel.types.program([node])),
        null,
        { ast: true }
    );
}


export function getAstFromCode(code:string){
    return  parser.parse(code, {
        errorRecovery:true,
        sourceType: 'module',
        plugins: ['typescript'],
    });

}

export function getIdentifiersFromAst(ast:any){

    const identifiers = [] as string[]
    traverse(ast, {
        Identifier(path:NodePath<t.Identifier>) {
            identifiers.push(path.node.name)
        }
    })

    return identifiers; 
}

function getIdentifierFromMapping(fileContnet:FileAstContent, identifier:string){
    const keysToCheck = ["functionDeclarations", "importDeclarations", "variableDeclarations","exportDeclarations"]
    for(const key of keysToCheck){
        if(identifier in fileContnet[key]){
            return fileContnet[key][identifier];
        }
    }
}
export function fileConstructor(fileContent: FileAstContent , exportedLine:string|undefined=undefined, requiredIdentifiers:string[] = []):FileContructorObject{
    const lineToCodeMapping = {} as { [key: number]: string };
    let que = [exportedLine];
    let processed = {} as { [key: string]: boolean };
    let unknownCodeToProcess = fileContent.unknowDeclarations.map(node => getCodeFromAstNode(node).code);

    const meta = {
        importDeclarations:[] as t.ImportDeclaration[]
    }

    if(!exportedLine){
        que = []
    }


    if(requiredIdentifiers.length){
        requiredIdentifiers.forEach(identifierName => {
           const identifierValue = getIdentifierFromMapping(fileContent, identifierName);

           if(identifierValue){
            processed[identifierName] = true;
            const generatedCode = getCodeFromAstNode(identifierValue);
            const lineNumber = identifierValue.loc?.start.line;
            if(lineNumber){
                lineToCodeMapping[lineNumber] = generatedCode.code;
                que.push(generatedCode.code);
            }else{
                console.log('no line number found', generatedCode.code)
            }
           }
        })
    }
    while (que.length){
        const newBatch = [] as string[];
        for (const line of que){
            const identifiers = getIdentifiersFromAst( getAstFromCode(line as string));
            identifiers.forEach((identifierName:string) => {
                if(processed[identifierName]){
                    return;
                }
                const identifierValue = getIdentifierFromMapping(fileContent, identifierName);

                if(identifierValue && identifierName in fileContent.importDeclarations)
                    {
                        meta.importDeclarations.push(fileContent.importDeclarations[identifierName])
                    }                
                    if(identifierValue && identifierName){
                    const generatedCode = getCodeFromAstNode(identifierValue);
                    const lineNumber = identifierValue.loc?.start.line;
                    if(lineNumber){
                        lineToCodeMapping[lineNumber] = generatedCode.code;
                        newBatch.push(generatedCode.code);
                    }else{
                        console.log('no line number found', generatedCode.code)
                    }
                }

                processed[identifierName] = true;

            })

        }
        que = newBatch;

        if(!que.length){
            que = unknownCodeToProcess;
            unknownCodeToProcess = []; 
        }
    }

    for(const unknowns of fileContent.unknowDeclarations){
        if(unknowns.loc?.start.line){
            lineToCodeMapping[unknowns.loc?.start.line] = getCodeFromAstNode(unknowns).code;
        }
    }

    // if(exportedLine){
    //     lineToCodeMapping[1000000000] = exportedLine;
    // }

    meta.importDeclarations = Array.from(new Set(meta.importDeclarations))
    return {lineCodeMapping:lineToCodeMapping ,meta}
}



export function isParentProgram(path:NodePath<t.Node> ){
    return path.parent.type == ParentTypes.Program;
}

export function fileConstructor2({ functionDeclarations, importDeclarations, unknowDeclarations, variableDeclarations }: FileAstContent , exportedLine:string) {

    const lineToCodeMapping = {} as { [key: number]: string };

    for(const importDeclaration of Object.values(importDeclarations)){
        const generatedCode = getCodeFromAstNode(importDeclaration);
        const lineNumber = importDeclaration.loc?.start.line;
        if(lineNumber){
            lineToCodeMapping[lineNumber] = generatedCode.code;
        }else{
            console.log('no line number found', generatedCode.code)
        }
    }
    for(const functionDeclaration of Object.values(functionDeclarations)){
        const generatedCode = getCodeFromAstNode(functionDeclaration);
        const lineNumber = functionDeclaration.loc?.start.line;
        if(lineNumber){
            lineToCodeMapping[lineNumber] = generatedCode.code;
        }else{
            console.log('no line number found', generatedCode.code)
        }
    }
    
    for(const unknowDeclaration of unknowDeclarations){
        const generatedCode = getCodeFromAstNode(unknowDeclaration);
        const lineNumber  = unknowDeclaration?.loc?.start.line;
        if(lineNumber){
            lineToCodeMapping[lineNumber] = generatedCode.code;
        }else{
            console.log('no line number found', generatedCode.code)
        }
    }


    for(const variableNode of Object.values(variableDeclarations)){
        const generatedCode = getCodeFromAstNode(variableNode);
        const lineNumber =  variableNode.loc?.start.line;
        if(lineNumber){
            lineToCodeMapping[lineNumber] = generatedCode.code;
        }else{
            console.log('no line number found', generatedCode.code)
        }
    }


    let fileRows = [] as any[]


    for(const [key , values]  of Object.entries(lineToCodeMapping)){
        fileRows.push([key , values])
    }

    fileRows = fileRows.sort((a , b) => a-b).map(line => line[1]);
    fileRows.push(exportedLine)
    return fileRows.join('\n')

    // for(const exported)
}


export function removeUnusedVariables(sourceCode) {
    const ast = parser.parse(sourceCode, {
        sourceType: 'module',
        plugins: ['typescript']
    });

    const usedIdentifiers = new Set();
  
    traverse(ast, {
        Identifier(path) {
            usedIdentifiers.add(path.node.name);
        }
    })

    traverse(ast, {
        VariableDeclarator(path:NodePath<t.VariableDeclarator>) {
            if(!(path.parent.type == ParentTypes.Program))return 
            if (!usedIdentifiers.has(path.node)) {
                path.remove();
            }
        },
        ImportSpecifier(path:NodePath<t.ImportSpecifier>) {
            if(!(path.parent.type == ParentTypes.Program))return 
            const imported = path.node.imported as t.Identifier;
            if(typeof imported != 'string' && imported.name != undefined && !(usedIdentifiers.has(imported.name))){
                path.remove();
            }
        },
        FunctionDeclaration(path:NodePath<t.FunctionDeclaration>){
            // console.log('Function declaration',path.node)
            if(!(path.parent.type == ParentTypes.Program))return 
            const functionDeclaration = path.node;
            const functionName = functionDeclaration.id?.name;
            if(functionName!= undefined && !usedIdentifiers.has(functionName)){
                path.remove();
            }
        }
    });



    traverse(ast, {
        VariableDeclarator(path:NodePath<t.VariableDeclarator>) {
            if(!(path.parent.type == ParentTypes.Program))return 
            // Check if the variable is used
            if (!usedIdentifiers.has(path.node)) {
                // Remove the variable if unused

                // console.log('remove unused variable var', path.node)
                path.remove();
            }
        },
        ImportSpecifier(path:NodePath<t.ImportSpecifier>) {
            if(!(path.parent.type == ParentTypes.Program))return 

            const imported = path.node.imported as t.Identifier;
            if(typeof imported != 'string' && imported.name != undefined && !(usedIdentifiers.has(imported.name))){
                console.log('remove unused variable imp', imported.name)
                path.remove();
            }
        },
        // ImportNamespaceSpecifier(path) {
        //     // Collect all used imports for namespace imports
        //     usedImports.add(path.node.local.name);
        // },
        // ImportDefaultSpecifier(path) {
        //     // Collect all used imports for default imports
        //     usedImports.add(path.node.local.name);
        // },
        FunctionDeclaration(path:NodePath<t.FunctionDeclaration>){
            // console.log('Function declaration',path.node)
            if(!(path.parent.type == ParentTypes.Program))return 
            const functionDeclaration = path.node;
            const functionName = functionDeclaration.id?.name;
            if(functionName!= undefined && !usedIdentifiers.has(functionName)){
                path.remove();
            }
        }
    });













    traverse(ast, {
        VariableDeclarator(path:NodePath<t.VariableDeclarator>) {
            if(!(path.parent.type == ParentTypes.Program))return 
            // Check if the variable is used
            if (!usedIdentifiers.has(path.node)) {
                // Remove the variable if unused

                // console.log('remove unused variable var', path.node)
                path.remove();
            }
        },
        ImportSpecifier(path:NodePath<t.ImportSpecifier>) {
            if(!(path.parent.type == ParentTypes.Program))return 

            const imported = path.node.imported as t.Identifier;
            if(typeof imported != 'string' && imported.name != undefined && !(usedIdentifiers.has(imported.name))){
                console.log('remove unused variable imp', imported.name)
                path.remove();
            }
        },
        // ImportNamespaceSpecifier(path) {
        //     // Collect all used imports for namespace imports
        //     usedImports.add(path.node.local.name);
        // },
        // ImportDefaultSpecifier(path) {
        //     // Collect all used imports for default imports
        //     usedImports.add(path.node.local.name);
        // },
        FunctionDeclaration(path:NodePath<t.FunctionDeclaration>){
            // console.log('Function declaration',path.node)
            if(!(path.parent.type == ParentTypes.Program))return 
            const functionDeclaration = path.node;
            const functionName = functionDeclaration.id?.name;
            if(functionName!= undefined && !usedIdentifiers.has(functionName)){
                path.remove();
            }
        }
    });
    // Generate the modified code
    const { code } = generate(ast);
    return code;
}


export function getFilePathFromImports(projectInfo:ProjectMetaData,currentFilePath:string,importDeclarationNodes:t.ImportDeclaration[]){
    const importedFiles =importDeclarationNodes
                        .map(importDeclaration => importDeclaration.source.value);
    return Array.from(filePathResolver({ ...projectInfo, currentFilePath }, importedFiles)).filter(file => file);
}


export function lineCodeMappingToCodeFile(lineToCodeMapping:any){
    let fileRows = [] as any[]
    for(const [key , values]  of Object.entries(lineToCodeMapping)){
        fileRows.push([key , values])
    }
    fileRows = fileRows.sort((a , b) => a-b).map(line => line[1]);
    return fileRows.join('\n');
}
