from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db
import pandas as pd
from fastapi.responses import FileResponse
import os
from datetime import datetime

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
    pozycje = crud.pobierz_pierwsze_pozycje(db)
    print("Pobrane pierwsze pozycje:", pozycje)  # Dodaj logowanie
    return pozycje

# Endpoint do dodawania ubezpieczonego
@router.post("/dodaj_ubezpieczonego/")
def dodaj_ubezpieczonego(ubezpieczony: schemas.UbezpieczonyCreate, db: Session = Depends(get_db)):
    print("Otrzymano ubezpieczonego:", ubezpieczony)
    return crud.dodaj_ubezpieczonego(db, ubezpieczony)

# Endpoint do wyszukiwania polis
@router.get("/wyszukaj/", response_model=list[schemas.PolisaResponse])
def wyszukaj_polisy(
    ubezpieczajacy: str = None,
    ubezpieczony: str = None,
    nip: str = None,
    regon: str = None,
    przedmiot: str = None,
    numer_polisy: str = None,
    data_zawarcia_od: str = None,
    data_zawarcia_do: str = None,
    ochrona_od: str = None,
    ochrona_do: str = None,
    zakonczenie_od: str = None,
    zakonczenie_do: str = None,
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    wyniki = crud.wyszukaj_polisy(db, ubezpieczajacy, ubezpieczony, nip, regon, przedmiot, numer_polisy, data_zawarcia_od, data_zawarcia_do, ochrona_od, ochrona_do, zakonczenie_od, zakonczenie_do, limit, offset)
    print("Pobrane wyniki wyszukiwania:", wyniki)  # Dodaj logowanie
    return wyniki

@router.post("/generuj_zestawienie/")
def generuj_zestawienie(
    ubezpieczajacy: str = None,
    ubezpieczony: str = None,
    nip: str = None,
    regon: str = None,
    przedmiot: str = None,
    numer_polisy: str = None,
    data_zawarcia_od: str = None,
    data_zawarcia_do: str = None,
    ochrona_od: str = None,
    ochrona_do: str = None,
    db: Session = Depends(get_db)
):
    wyniki = crud.wyszukaj_polisy(db, ubezpieczajacy, ubezpieczony, nip, regon, przedmiot, numer_polisy, data_zawarcia_od, data_zawarcia_do, ochrona_od, ochrona_do, limit=1000, offset=0)
    
    # Logowanie wyników
    print("Wyniki wyszukiwania:", wyniki)

    # Konwertuj wyniki do DataFrame
    df = pd.DataFrame([schemas.PolisaResponse.from_orm(w).dict() for w in wyniki])
    
    # Utwórz folder Zestawienia, jeśli nie istnieje
    folder_path = "Zestawienia"
    os.makedirs(folder_path, exist_ok=True)
    
    # Generuj nazwę pliku
    now = datetime.now()
    file_name = f"Zestawienie {now.strftime('%Y-%m-%d %H_%M')}.xlsx"
    file_path = os.path.join(folder_path, file_name)
    
    # Zapisz DataFrame do pliku Excel
    df.to_excel(file_path, index=False)
    
    return {"message": f"Zestawienie zapisane jako {file_name}"}