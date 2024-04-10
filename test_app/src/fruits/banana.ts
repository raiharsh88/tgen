import { fruit_names, random_fruit_picker } from "../helpers/helper"

console.log('Random fruit picker' , fruit_names)
export function getBanana() {
    console.log(random_fruit_picker())
    return "banana"
}

export function getBananaPrice() {
    return 1.99
}

