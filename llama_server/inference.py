from langchain.prompts import PromptTemplate
from langchain_community.llms import LlamaCpp
import os
from dotenv import load_dotenv
from langchain.chains.question_answering import load_qa_chain
import pika
import json
from llama_cpp import Llama
import time

load_dotenv()
input_que_name = "message_input_que"
output_que_name = "message_output_que"
channel=''

cloudMqttUrl = os.getenv('CLOUDMQTT_URL')
connection = pika.BlockingConnection(pika.URLParameters(cloudMqttUrl))
channel = connection.channel()

# file_path = "/home/harsh/chat-stocks/models/code-llama-7b.gguf"
# file_path = "/home/harsh/chat-stocks/models/llama-2-7b-chat.Q8_0.gguf"

file_path = "/home/harsh/chat-stocks/models/codellama-7b-instruct.Q8_0.gguf"


model = Llama(model_path=file_path ,chat_format='llama-2' ,n_ctx=4096 , n_gpu_layers=-1)



# count time taken by operation



def pushResult(result):
    channel.basic_publish(exchange='',
                          routing_key=output_que_name,
                          body=json.dumps(result))
que = []
def generate_unit_test(message):
    # print(message)
    model.reset()
    if len(que)> 0:
        return que.append(message)
    else:
        que.append(message)
    while len(que) > 0:
        current = que[0]
        body = current["body"][0]
        rawTemplate = '''
            <s>[INST]
            <<SYS>>
            You are an expert programmer,Based on the follwing instructions and given code files ,write unit tests in jest for the first file; all the other files are just dependencies to give you context of all the possible test cases to produce
            Instructions:
            1. Each file wrapped between [File] and [/File] tags.
            2. Output should be between [TEST] and [/TEST] tags.
            3. Cover all possible inputs and their respective outputs using tests.
            4. Do not explain the tests.
            Files:{context}
            <</SYS>>
            '''
        template =                                                                                                                                                                                                                                                                           PromptTemplate(
            input_variables=["context"],
            template=rawTemplate
        )
        formattedPrompt = template.format(context=body)+'[/INST]'
        tokens= model.tokenize(bytes(formattedPrompt, encoding='utf8'))
        print('Token count',len(tokens))
        start = time.time()
        output = model(
                formattedPrompt,
                max_tokens=4000-len(tokens),
                stop=["[/TEST]"],echo=False,temperature=0)
        outputCode = output["choices"][0]['text']
        print( 'Usage Specs',output['usage'])
        print('Time taken', time.time()-start)

        pushResult({**message , 'body':[outputCode]})
        que.pop(0)




def cleanCode(code , message):
    model.reset()
    print('Cleaning code' ,code)
    rawTemplate = '''
        <s>[INST]
        <<SYS>>
        Rewrite all the tests without any comments and explanations, keep all the import and declarations at top followed by the tests and return the result wrapped in [FINAL] and [/FINAL] tags and without explanation.
        for example when given 
        Code:{context1}

        Your response:{response1}
        Code:{context}
        Your response:
        '''
    context1 = '''
    import abc
        describe("suite 1",() => {
        ....
        it("",() => {
        ....
        })
        })
        some random explanation
        import xyz
        describe("suite 2",() => {
        ....
        it("",() => {
        ....
        })
        })
        some more explanation
        '''
    response1  = '''

        [FINAL]
        import abc
        import xyz
        describe("suite 1",() => {
        ....
        it("",() => {
        ....
        })
        })
        describe("suite 2",() => {
        ....
        it("",() => {
        ....
        })
        })

        [/FINAL]
        <</SYS>>'''
    template = PromptTemplate(
        input_variables=["context" ,"context1" , "response1"],
        template=rawTemplate,
    )
    formattedPrompt = template.format(context=code , context1 = context1 , response1 = response1)+'[/INST]'
    tokens= model.tokenize(bytes(formattedPrompt, encoding='utf8'))
    print('Token count',len(tokens),)
    start = time.time()
    model.reset()
    output = model(
            formattedPrompt,
            max_tokens=4000,
            stop=["[/FINAL]"],
            echo=False,
            temperature=0)
    outputCode = output["choices"][0]['text']
    print( 'Usage Specs',output['usage'])
    print('Time taken', time.time()-start)
    pushResult({**message , 'body':[outputCode]})


def combineUnitTest(message):
    print('Combining code')
    body = "\n\n".join([f'[File]{code}[/File]' for code in message["body"]])
    rawTemplate = '''
        <s>[INST]
        <<SYS>>
        You are given the typescript code split across multiple file, content of each file is enclosed between [File] and [/File] tags. Combine typescript code of all the files into one and return result as output wrapped between [TEST] and [/TEST] tags.
       Code:{context}
        <</SYS>>
        '''
    template = PromptTemplate(
        input_variables=["context"],
        template=rawTemplate
    )
    formattedPrompt = template.format(context=body)+'[/INST]'
    tokens= model.tokenize(bytes(formattedPrompt, encoding='utf8'))
    print('Token count',len(tokens))
    start = time.time()
    model.reset()

    output = model(
            formattedPrompt,
            max_tokens=4000,
            stop=["[/TEST]"],echo=False,temperature=0)
    
    
    outputCode = output["choices"][0]['text']
    print( 'Usage Specs',output['usage'])
    print('Time taken', time.time()-start)
    cleanCode(outputCode, message)

def callback(ch, method, properties, body):
    message = json.loads(body)

    if message['message_type'] =='test_chunk':
        combineUnitTest(message)
        return
    else:
        return generate_unit_test(message)



channel.basic_consume(queue=input_que_name,
                      on_message_callback=callback,
                      auto_ack=True)
channel.start_consuming()


