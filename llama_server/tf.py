from transformers import AutoModelForCausalLM, AutoTokenizer
from llama_cpp import Llama
checkpoint = "Salesforce/codegen-350M-mono"
# tokenizer = AutoTokenizer.from_pretrained("codellama/CodeLlama-7b-Instruct-hf" ,)
# model = AutoModelForCausalLM.from_pretrained("codellama/CodeLlama-7b-Instruct-hf")
# file_path = "/home/harsh/chat-stocks/models/code-llama-7b.gguf"
# file_path = "/home/harsh/chat-stocks/models/llama-2-7b-chat.Q8_0.gguf"
text = '''def hello_world():'''

# completion = model.generate(**tokenizer(text, return_tensors="pt"))

question = '''<s>[INST]
<<SYS>>Write unit in jest for fruit_api.ts; all the other files are just dependencies to give you context of all the possible test cases to produce;
Output should be between [TEST] and [/TEST] tags;
Each file wrapped between [FILE] and [/FILE] tags;
Cover all the cases including the data returned from the dependencies
Following are the files code files:
<</SYS>>
[File1]
//File location - /home/harsh/chat-stocks/test_app/src/fruit_api.ts
import { getApple } from "./fruits/apple";
import { getBanana } from "./fruits/banana";
import { getMango, getMangoPrice } from "./fruits/mango";
import * as appleFuncs from './fruits/apple';
import './fruits/apple';
const time = Date.now();
let fruitNameEnd = 10;
(() => {
  fruitNameEnd = 20;
})();
export function getFruits(id: number) {
  let banana: string = '';
  let apple: string = '';
  let mango: string = '';
  if (id == 1) {
    banana = getBanana();
  } else if (id == 2) {
    apple = appleFuncs.getApple();
  } else if (id == 3) {
    mango = getMango();
  }
  return {
    banana,
    apple,
    mango,
    time,
    fruitNameEnd
  };
}
[/File1]

# Dependencies -
[File2]
//File location - /home/harsh/chat-stocks/test_app/src/fruits/banana.ts
import { fruit_names, random_fruit_picker } from "../helpers/helper";
console.log('Random fruit picker', fruit_names);
export function getBanana() {
  console.log(random_fruit_picker());
  return "hdhu"+random_fruit_picker();
}
[/File2]
[File3]
//File location - /home/harsh/chat-stocks/test_app/src/fruits/apple.ts
export function getApple() {
  return "apple";
}
[/File3]
[/File4]
//File location - /home/harsh/chat-stocks/test_app/src/fruits/mango.ts
export function getMango() {
  return 'mango';
}
export function getMangoPrice() {
  return 5 + Math.random();
}
[/File4]
[/File5]
//File location - /home/harsh/chat-stocks/test_app/src/helpers/helper.ts
export const fruit_names = ['apple', 'mango', 'banana'];
export const random_fruit_picker = () => fruit_names[Math.floor(Math.random() * fruit_names.length)];
[/File5]
[/INST]
'''

model_path = "/home/harsh/chat-stocks/models/codellama-7b-instruct.Q8_0.gguf"

model = Llama(model_path=model_path ,chat_format='llama-2' ,n_ctx=4096 , n_gpu_layers=-1)

tokens= model.tokenize(bytes(question, encoding='utf8'))

import time
print('Token count',len(tokens))

# count time taken by operation

start = time.time()
output = model(
      question,
      max_tokens=4000-len(tokens),
      stop=["[/TEST]"],
      echo=False # Echo the prompt back in the output
)

end = time.time()
print('Time taken', end - start)

# print('Text',output["choices"][0]['text'])

print('Outpur specs' , output['usage'])

[print(key ,val , '\n\n\n') for key ,val in output['choices'][0].items()]