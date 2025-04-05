import os
import uuid

from pypdf import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.schema import Document


from dotenv import load_dotenv
load_dotenv()

from server.serverlog import create_logger
logger = create_logger(__name__)

def embed_file(file):
    try:
        # return uuid.uuid4()
        logger.info(f"PDF file: {file}")        
        reader = PdfReader(file)

        # num_pages = reader.numPages
        logger.info(f"Number of pages: {len(reader.pages)}")

        text = ""
        for page in reader.pages:
            text = text + "\n\n" + page.extract_text()        

        documents = [Document(page_content=text, metadata={"file_name": file})]
        
        # split the document into sentences        
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        sentences = text_splitter.split_documents(documents)

        # embed the sentences
        embeddings = OpenAIEmbeddings()
        vector_store = FAISS.from_documents(sentences, embeddings)
                
        # create a temporary file to store the vector store        
        unique_id = uuid.uuid4()
        faiss_file_temp_location = os.path.join(os.getcwd(), 'tmp', 'faiss', f"{unique_id}.faiss")
        # store the vector store in a local file
        vector_store.save_local(faiss_file_temp_location)

        # return the embeddings
        return unique_id
    except Exception as e:
        logger.error(f"Error: {e}")
        raise e
    