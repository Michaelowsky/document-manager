from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# Endpoint do dodawania polisy
@router.post("/dodaj_polise/")
def dodaj_polise(polisa: schemas.PolisaCreate, db: Session = Depends(get_db)):
    print("Otrzymano polise:", polisa)
    return crud.dodaj_polise(db, polisa)

# Endpoint do pobierania polis
@router.get("/polisy/", response_model=list[schemas.PolisaResponse])
def pobierz_polisy(db: Session = Depends(get_db)):
    return crud.pobierz_polisy(db)

# Możesz także dodać prosty endpoint "home"
@router.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})