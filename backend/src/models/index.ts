import * as t from '@babel/types';

export interface ProjectMetaData {
    aliasMap:{
        [key:string]:string,
    };
    projectDir:string,
    entryFile:string,
    fileExtension:'ts',
    testDir:string
}


export interface FileAstContent{
    variableDeclarations:{[key:string]:t.VariableDeclaration};
    functionDeclarations:{[key:string]:t.FunctionDeclaration};
    unknowDeclarations:t.Node[];
    importDeclarations:{[key:string]:t.ImportDeclaration};
    exportDeclarations:{[key:string]:t.ExportDeclaration};
}