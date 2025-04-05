from pydantic import BaseModel

class PredictRequestModel(BaseModel):
    question: str
    unique_id: str

class PredictResponseModel(BaseModel):
    answer: str