## IN DEV MODE
uvicorn server.main:app --host 0.0.0.0 --reload

## IN PROD MODE
python -m uvicorn server.main:app --host 0.0.0.0