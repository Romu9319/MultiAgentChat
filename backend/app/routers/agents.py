from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AgentInput(BaseModel):
    name: str
    prompt: str

@router.post("/agent/respond")
def get_agent_response(data: AgentInput):
    return {
        "agent": data.name,
        "response": f"[Simulado] El agente '{data.name}' responde a: '{data.prompt}'"
    }