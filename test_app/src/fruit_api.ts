import { getApple } from "./fruits/apple"
import { getBanana } from "./fruits/banana"
import { getMango, getMangoPrice } from "./fruits/mango"
import * as appleFuncs from './fruits/apple';
import './fruits/apple'
const time = Date.now();

let fruitNameEnd = 10;
(()=> {
    fruitNameEnd = 20;
})()
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
    return {banana,apple,mango , time, fruitNameEnd}
}

function test2(){
    const something = ""
    return 'I am test 2'
}

function test3(){
    const something = ""
    return 'I am test 3'+Math.random()
}
export {test2 , test3}

