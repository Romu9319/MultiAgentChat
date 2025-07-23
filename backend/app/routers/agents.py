from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class AgentInput(BaseModel):
    name: str
    prompt: str


@router.post("/agent/respond")
def get_agent_response(data: AgentInput):
    try:
        if not data.prompt.strip():
            raise HTTPException(status_code=400, detail="Necesita insertar algun prompt")
        
        response = f"[Simulacion] El agente '{data.name} responde a: '{data.prompt}"
        return {
            "agent": data.name,
            "response": response,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")