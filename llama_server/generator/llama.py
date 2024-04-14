from langchain.prompts import PromptTemplate
from llama_cpp import Llama
import time

file_path = "/home/harsh/chat-stocks/models/codellama-7b-instruct.Q8_0.gguf"

model = Llama(model_path=file_path ,chat_format='llama-2' ,n_ctx=4096 , n_gpu_layers=-1)


que = []
def generate_unit_test(message):
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
            Files:{context}
            <</SYS>>
            Your answer :[Test]
            '''
        template =                                                                                                                                                                                                                                                                           PromptTemplate(
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
                max_tokens=len(tokens)*2.5,
                stop=["[/Test]"],echo=False,temperature=0)
        outputCode = output["choices"][0]['text']
        print( 'Usage Specs',output['usage'])
        print('Time taken', time.time()-start)
        que.pop(0)
        return {**message , 'body':[outputCode]}




def clean_unit_test(code , message):
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
    return {**message , 'body':[outputCode]}


def combine_unit_test(message):
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
    return clean_unit_test(outputCode, message)



