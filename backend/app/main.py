from fastapi import FastAPI
from app.routers import * 

app = FastAPI()

app.include_router(ex_router)

@app.get("/")
def read_root():
    return {"Hello you"}