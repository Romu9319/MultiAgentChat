from fastapi import APIRouter

router = APIRouter()

@router.get("/healthz", tags=["Health"])
def healt_check():
    """
    Endpoint para health-check:
    Devuelve {"status": "ok"} si el servidor esta levnatado.
    """
    return {"status": "ok"}