from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db

router = APIRouter()

# Endpoint do dodawania dokumentu
@router.post("/dodaj_dokument/")
def dodaj_dokument(dokument: schemas.DokumentCreate, db: Session = Depends(get_db)):
    print("Otrzymano dokument:", dokument)
    return crud.dodaj_dokument(db, dokument)

# Endpoint do pobierania dokumentów
@router.get("/dokumenty/", response_model=list[schemas.DokumentResponse])
def pobierz_dokumenty(db: Session = Depends(get_db)):
    return crud.pobierz_dokumenty(db)

# Możesz także dodać prosty endpoint "home"
@router.get("/")
def read_root():
    return {"message": "Hello, this is the document manager API!"}