
from sentence_transformers import SentenceTransformer

from common.db import conn
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings.sentence_transformer import (
    SentenceTransformerEmbeddings,
)
from langchain_core.documents import Document

# from langchain.vectorstores import  Chroma
import chromadb as Chroma
from chromadb.utils import embedding_functions
import time



model_path = "/home/harsh/chat-stocks/models/llama-2-7b-chat.Q8_0.gguf"

textString = "".join(["i am a serial killer ,and my name is michael myers" for i in range(1000)])
metadata = {"source": "test file path"}

documents =[Document(page_content="abcd", metadata=metadata)]
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

query = "What did the president say about Ketanji Brown Jackson"     



embeFunction = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2",
    device="cuda"
)


def convertTextToEmbedding(text):
    return embeFunction(text)


model = SentenceTransformer("all-MiniLM-L6-v2",device='cuda')

sentence = "".join([
    "This framework generates embeddings for each input sentence" for i in range(1000)]
)
# Sentences are encoded by calling model.encode()
time1= time.time()
embeddings = model.encode(list([textString]))
time2 = time.time()

print(' sentence_tf str input', (time2-time1)*1000 ,'ms')

# # # Sentences are encoded by calling model.encode()
# # time1= time.time()
# # embeddings = model.encode(list(sentence))
# # time2 = time.time()

# print(' sentence_tf list input', (time2-time1)*1000 ,'ms')


time1= time.time()
embeddings = convertTextToEmbedding(
documents[0])
time2 = time.time()

print(' sentence_tf with chromadb wrapper', (time2-time1)*1000, 'ms',embeddings)







# time1= time.time()
# embeddings = model.encode(sentences, normalize_embeddings=False).tolist()
# time2 = time.time()

# # Print the embeddings
# # for sentence, embedding in zip(sentences, embeddings):
# #     print("Sentence:", sentence)
# #     print("Embedding:", embedding)
# #     print("")

# print('Time taken1.1', (time2-time1)*1000)

# time1= time.time()

# # emb  = convertTextToEmbedding(sentences)

# time2 = time.time()

# print('Time taken2', (time2-time1)*1000  )
# convertTextToEmbedding(sentences)
