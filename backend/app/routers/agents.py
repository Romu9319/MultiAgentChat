from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .schemas import AgentCtreate, AgentMessageInput, AgentBroadcastInput, AgentBroadcastOutput
from typing import List, Dict

router = APIRouter()

AGENTS : List[str] = ["Agente1", "Agente2", "Verificador", "Planificador"]


@router.get("/agents", response_model = List[str])
def list_agents():
    return AGENTS


@router.post("/agents", status_code=201)
def create_agent(data: AgentCtreate):
    name = data.name
    if name in AGENTS:
        raise HTTPException(status_code=409, detail=f"El Agente '{name}' ya existe")
    AGENTS.append(name)
    return {"detail": f"Agente '{name}' creado"}


@router.delete("/agents/{name}")
def delete_agent(name:str):
    if name not in AGENTS:
        raise HTTPException(status=404, detail="El agente '{name}' no existe")
    AGENTS.remove(name)
    return {"detail": f"Agente '{name}' eliminado"}


@router.post("/agents/respond")
def get_agent_response(data: AgentMessageInput):
    name = data.name
    prompt = data.prompt
    try:
        if name not in AGENTS:
            raise HTTPException(status_code=404, detail= f"Agente {data.name} no encontrado")

        if not prompt:
            raise HTTPException(status_code=400, detail="Necesita insertar algun prompt")
        
        response = f"[Simulacion] El agente '{name} responde a: '{prompt}"
        return {
            "agent": name,
            "response": response,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.post("/agents/broadcast", response_model=AgentBroadcastOutput)
def broadcast_prompt(data: AgentBroadcastInput):
    prompt = data.prompt
    try:
        if not prompt:
            raise HTTPException(status_code=400, detail="El prompt no puede estar vacio")
        replies: Dict[str, str] = {
            agent_name: f"[BROADCAST SIMULADO] '{agent_name}' responde a: '{prompt}'"
            for agent_name in AGENTS
        }
        return{"response": replies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error Interno: {str(e)}")