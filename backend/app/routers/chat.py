from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .schemas import ChatMessage
from ..services.openai_client import ask_openai


router = APIRouter()


@router.post("/chat")
def chat_endpoint(msg: ChatMessage):
    prompt = msg.prompt
    if not prompt:
        raise HTTPException(status_code=400, detail="El prompt no puede estar vacío")
    try:
        answer = ask_openai(prompt)
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en OpenAi: {e}")