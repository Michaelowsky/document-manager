from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from routers import dokumenty as polisy
from pathlib import Path

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Ładowanie dodawania polis
app.include_router(polisy.router)

# Załaduj statyczne pliki
app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")

# Załaduj pliki szablonów
templates = Jinja2Templates(directory="templates")

# Strona główna - formularz HTML
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    logger.info("Root endpoint called")
    return templates.TemplateResponse("index.html", {"request": request})