from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from routers import dokumenty
from pathlib import Path

app = FastAPI()

# Ładowanie dodawania dokumentów
app.include_router(dokumenty.router)

# Załaduj statyczne pliki
app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")

# Załaduj pliki szablonów
templates = Jinja2Templates(directory="templates")

# Strona główna - formularz HTML
@app.get("/", response_class=HTMLResponse)
async def root():
    return templates.TemplateResponse("index.html", {"request": {}})