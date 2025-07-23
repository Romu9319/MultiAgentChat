from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

AGENTS = ["Agente1", "Agente2", "Verificador", "Planificador"]

class AgentInput(BaseModel):
    name: str
    prompt: str


@router.get("/agents", response_model = list[str])
def list_agents():
    return AGENTS


@router.post("/agent/respond")
def get_agent_response(data: AgentInput):
    try:
        if data.name not in AGENTS:
            raise HTTPException(status_code=404, detail= f"Agente {data.name} no encontrado")

        if not data.prompt.strip():
            raise HTTPException(status_code=400, detail="Necesita insertar algun prompt")
        
        response = f"[Simulacion] El agente '{data.name} responde a: '{data.prompt}"
        return {
            "agent": data.name,
            "response": response,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")