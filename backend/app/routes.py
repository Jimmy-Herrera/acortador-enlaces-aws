from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from app import database
from app.config import BASE_URL
from app.schemas import LinkInfo, ShortenRequest, ShortenResponse

router = APIRouter()


@router.post("/shorten", response_model=ShortenResponse)
def shorten(payload: ShortenRequest):
    item = database.create_link(str(payload.original_url))
    return ShortenResponse(
        short_code=item["short_code"],
        original_url=item["original_url"],
        short_url=f"{BASE_URL}/{item['short_code']}",
    )


@router.get("/urls/{short_code}", response_model=LinkInfo)
def get_info(short_code: str):
    item = database.get_link(short_code)
    if not item:
        raise HTTPException(status_code=404, detail="Enlace no encontrado")
    return item


@router.get("/{short_code}")
def redirect(short_code: str):
    item = database.get_link(short_code)
    if not item:
        raise HTTPException(status_code=404, detail="Enlace no encontrado")
    return RedirectResponse(url=item["original_url"], status_code=307)