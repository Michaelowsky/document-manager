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

# Endpoint do dodawania firmy
@router.post("/dodaj_firme/")
def dodaj_firme(firma: schemas.FirmaCreate, db: Session = Depends(get_db)):
    print("Otrzymano firme:", firma)
    return crud.dodaj_firme(db, firma)

# Endpoint do pobierania 10 pierwszych pozycji z tabeli archiwum
@router.get("/pierwsze_pozycje/", response_model=list[schemas.PolisaResponse])
def pobierz_pierwsze_pozycje(db: Session = Depends(get_db)):
    return crud.pobierz_pierwsze_pozycje(db)

# Endpoint do dodawania ubezpieczonego
@router.post("/dodaj_ubezpieczonego/")
def dodaj_ubezpieczonego(ubezpieczony: schemas.UbezpieczonyCreate, db: Session = Depends(get_db)):
    print("Otrzymano ubezpieczonego:", ubezpieczony)
    return crud.dodaj_ubezpieczonego(db, ubezpieczony)

# Endpoint do wyszukiwania polis
@router.get("/wyszukaj/", response_model=list[schemas.PolisaResponse])
def wyszukaj_polisy(ubezpieczajacy: str = None, ubezpieczony: str = None, nip: str = None, regon: str = None, przedmiot: str = None, db: Session = Depends(get_db)):
    return crud.wyszukaj_polisy(db, ubezpieczajacy, ubezpieczony, nip, regon, przedmiot)

# Możesz także dodać prosty endpoint "home"
@router.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})