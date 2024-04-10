
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


embedFunction = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2",
    device="cuda"
)

model_path = "/home/harsh/chat-stocks/models/llama-2-7b-chat.Q8_0.gguf"

textString = "".join(["i am a serial killer ,and my name is michael myers" for i in range(1000)])
metadata = {"source": "test file path"}

documents =[Document(page_content=textString, metadata=metadata)]
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

query = "What did the president say about Ketanji Brown Jackson"


client = Chroma.Client()

print(client.list_collections())


def convertTextToEmbedding(text):
    return embedFunction(text)

# res = []
# for doc in docs:
#     time1 = time.time()
#     res.append(convertTextToEmbedding(doc.page_content))
#     time2 = time.time()
#     print('Time taken',(time2-time1)*1000)

# print(len(res[0][0]))
    

# for doc in res.values():
    # print(doc)




model = SentenceTransformer("all-MiniLM-L6-v2",device='cuda')

sentences = "".join(["".join([
    "This framework generates embeddings for each input sentence",
    "Sentences are passed as a list of string.",
    "The quick brown fox jumps over the lazy dog."
]) for i in range(1000)]
)
# Sentences are encoded by calling model.encode()
time1= time.time()
embeddings = model.encode((sentences), normalize_embeddings=False).tolist()
time2 = time.time()

# Print the embeddings
# for sentence, embedding in zip(sentences, embeddings):
#     print("Sentence:", sentence)
#     print("Embedding:", embedding)
#     print("")

print('Time taken', (time2-time1)*1000 , isinstance([],list))
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
