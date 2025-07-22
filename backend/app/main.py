from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import agents_router
from app.config import API_SECRET, DEBUG


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cambia según puerto/frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router)

@app.get("/")
def read_root():
    return {"Hello" :"Word",
            "API_SECRET" : API_SECRET,
            "DEBUG" : DEBUG
            }

@app.get("/api/prueba")
def status():
    return {"status": "OK", "prueba": "PROBANDO ENLACE CON FRONTED"}