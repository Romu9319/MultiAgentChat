from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, constr

class AgentInput(BaseModel):
    name: constr(strip_whitespace=True, min_length=1)
    prompt: constr(strip_whitespace=True, min_length=1)


class AgentMessageInput(BaseModel):
    name: constr(strip_whitespace=True, min_length=1) 
    prompt: str


class AgentCtreate(BaseModel):
    name: constr(strip_whitespace=True, min_length=1)
    