from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, constr
from typing import Dict, List


class AgentMessageInput(BaseModel):
    name: constr(strip_whitespace=True, min_length=1) 
    prompt: constr(strip_whitespace=True, min_length=1)


class AgentCtreate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1)


class AgentBroadcastInput(BaseModel):
    prompt: constr(strip_whitespace=True, min_length=1)


class AgentBroadcastOutput(BaseModel):
    response: Dict[str, str]
    