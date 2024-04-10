import psycopg2
import sys

conn = psycopg2.connect(database = "llm-1", 
                        user = "harsh", 
                        host= 'localhost',
                        password = "password",
                        port = 5433)

