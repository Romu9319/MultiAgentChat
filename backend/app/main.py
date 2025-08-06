
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.agents import router as agents_router
from app.routers.chat import router as chat_router
from app.routers.health import router as health_router
from app.config import API_SECRET, DEBUG


# Login básico
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger("multiagentchat")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Cambia según puerto/frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(agents_router)
app.include_router(chat_router)


# Middleware para logging de peticiones
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"-> {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"<- {response. status_code} {request.method} {request.url.path}")
    return response

@app.get("/")
def read_root():
    return {"Hello" :"Word",
            "API_SECRET" : API_SECRET,
            "DEBUG" : DEBUG
            }

@app.get("/api/prueba")
def status():
    return {"status": "OK", "prueba": "PROBANDO ENLACE CON FRONTED"}