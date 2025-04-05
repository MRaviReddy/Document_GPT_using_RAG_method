import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Header, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

# intialize the logger
from server.serverlog import create_logger
logger = create_logger(__name__)

# load environment variables
load_dotenv()

import server.embed
import server.model
import server.predict

# initialize the app
app = FastAPI(
    title="Doc GPT API",
    description="Doc GPT API for generating text from a prompt and prediction",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# add middleware to log requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

# add middleware to log validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=400,
        content={"message": "Validation error"}
    )

# add middleware to log server errors
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP error: {exc}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}
    )

# health end point
@app.get("/api/health")
async def health():
    return {"message": "OK"}

# file upload end point
@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    try:
        logger.info(f"File upload: {file.filename}")

        pdf_file_temp_location = os.path.join(os.getcwd(), 'tmp', 'pdf', file.filename)
        with open(pdf_file_temp_location,'wb+') as pdf_file:
            pdf_file.write(await file.read())
            pdf_file.close()

        vector_store_uuid = server.embed.embed_file(pdf_file_temp_location)
        # vector_store_uuid = "bc76defb-fc4b-4365-8e28-56b85158a12a"
        logger.info("Ingestion Completed")        
        metadata_file = os.path.join(os.getcwd(), 'tmp', 'metadata.json')
        with open(metadata_file, 'r') as f:
            metadata = f.read()
            f.close()

        # logger.info(json.loads(metadata))

        metadata = json.loads(metadata) | {}

        metadata[file.filename] = str(vector_store_uuid)

        with open(metadata_file, 'w') as f:
            f.write(json.dumps(metadata))
            f.close()
                   
        return {"vector_store_uuid": vector_store_uuid}    
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# prediction end point
@app.post("/api/predict")
async def predict(request: server.model.PredictRequestModel):
    try:
        logger.info(f"Recieved question is: {request.question}")
        answer = await server.predict.predict_answer(request.question, request.unique_id)
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# prediction end point
@app.get("/api/files")
async def files():
    try:
        metadata_file = os.path.join(os.getcwd(), 'tmp', 'metadata.json')
        try:
            with open(metadata_file, 'r') as f:
                metadata = f.read()
                f.close()
            
            return {"files": json.loads(metadata)}
        except:
            return {"files": []}
        
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

