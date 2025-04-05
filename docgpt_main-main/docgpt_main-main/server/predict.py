import os
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()

from server.serverlog import create_logger
logger = create_logger(__name__)

PROMPT_TEMPLATE = """
Ensure that the answer is derived from the following context without using any prior knowledge.

--------------
Context:
{context}

--------------

Answer the question: {question}
"""

async def predict_answer(question, unique_id):
    try:
        faiss_file_temp_location = os.path.join(os.getcwd(), 'tmp', 'faiss', f"{unique_id}.faiss")

        embeddings = OpenAIEmbeddings()        
        vector_store = FAISS.load_local(faiss_file_temp_location, embeddings)
        docs = vector_store.similarity_search(question)

        logger.info(f"Number of documents: {len(docs)}")

        if (len(docs) == 0):
            return "Sorry, I don't have an answer for that."
        
        context = ""
        for doc in docs:            
            context = context + str(doc.page_content) + "\n\n"
        
        prompt = PROMPT_TEMPLATE.format(context=context, question=question)

        client = OpenAI()

        response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},    
            ]
        )
        # logger.info(response.choices[0].message.content)
        return response.choices[0].message.content

    except Exception as e:
        logger.error(f"Error: {e}")
        raise e