import { getApple } from "./fruits/apple"
import { getBanana } from "./fruits/banana"
import { getMango, getMangoPrice } from "./fruits/mango"
import * as appleFuncs from './fruits/apple';

const time = Date.now();

export function getFruits(id:number){
    let banana:string = '';
    let apple:string = '';
    let mango:string = '';
    if(id == 1){
       banana = getBanana()
    }
    else if(id == 2){
        apple = appleFuncs.getApple()
    }else if(id == 3){
        mango = getMango()
    }
    return {banana,apple,mango , time}
}


export function test2(){
    const something = ""
    return 'I am test 2'
}

export function test3(){
    const something = ""
    return 'I am test 3'+Math.random()
}
