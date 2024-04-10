import * as t from '@babel/types';

export interface PageContext {
    domain_name:string;
    links:string[];
    max_depth:number;
    current_depth:number;
    visited_urls: Set<string>;
    max_urls_per_page:number;
    page_sizes:number[];
    total_urls_visited:number;
}


export interface  FileContructorObject{
    lineCodeMapping :{
        [key:number]:string;
    };
    meta:{
        importDeclarations:t.ImportDeclaration[]
    }
}


export interface UTMessageFormat{
    message_id:string;
    body:string[];
    group_id:string;
    group_size:number;
    group_sequence_no:number;
    message_type:"code_chunk"|"test_chunk";

}

export enum UTMessageType{
    CODE_CHUNK = "code_chunk",
    TEST_CHUNK = "test_chunk"
}