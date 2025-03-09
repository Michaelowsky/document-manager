from sqlalchemy.orm import Session
from sqlalchemy import or_
import models, schemas

def dodaj_polise(db: Session, polisa: schemas.PolisaCreate):
    nowa_polisa = models.Polisa(**polisa.dict())
    db.add(nowa_polisa)
    db.commit()
    db.refresh(nowa_polisa)
    return nowa_polisa

def pobierz_polisy(db: Session):
    return db.query(models.Polisa).all()

def dodaj_firme(db: Session, firma: schemas.FirmaCreate):
    # Sprawdź, czy firma już istnieje
    istniejąca_firma = db.query(models.Firma).filter_by(nip=firma.nip, regon=firma.regon).first()
    if istniejąca_firma:
        return istniejąca_firma  # Zwróć istniejącą firmę, jeśli już istnieje

    nowa_firma = models.Firma(**firma.dict())
    db.add(nowa_firma)
    db.commit()
    db.refresh(nowa_firma)
    return nowa_firma

def pobierz_pierwsze_pozycje(db: Session):
    return db.query(models.Polisa).limit(10).all()

def dodaj_ubezpieczonego(db: Session, ubezpieczony: schemas.UbezpieczonyCreate):
    nowy_ubezpieczony = models.Ubezpieczony(**ubezpieczony.dict())
    db.add(nowy_ubezpieczony)
    db.commit()
    db.refresh(nowy_ubezpieczony)
    return nowy_ubezpieczony

def wyszukaj_polisy(db: Session, ubezpieczajacy: str = None, ubezpieczony: str = None, nip: str = None, regon: str = None, przedmiot: str = None):
    query = db.query(models.Polisa)
    
    if ubezpieczajacy:
        query = query.filter(models.Polisa.ubezpieczajacy.like(f"%{ubezpieczajacy}%"))
    
    if ubezpieczony:
        polisy = db.query(models.Ubezpieczony).filter(models.Ubezpieczony.ubezpieczony.like(f"%{ubezpieczony}%")).all()
        numery_polis = [polisa.numer_polisy for polisa in polisy]
        query = query.filter(models.Polisa.numer_ubezpieczenia.in_(numery_polis))
    
    if nip:
        firmy = db.query(models.Firma).filter(models.Firma.nip.like(f"%{nip}%")).all()
        ubezpieczajacy_firmy = [firma.ubezpieczajacy for firma in firmy]
        query = query.filter(models.Polisa.ubezpieczajacy.in_(ubezpieczajacy_firmy))
    
    if regon:
        firmy = db.query(models.Firma).filter(models.Firma.regon.like(f"%{regon}%")).all()
        ubezpieczajacy_firmy = [firma.ubezpieczajacy for firma in firmy]
        query = query.filter(models.Polisa.ubezpieczajacy.in_(ubezpieczajacy_firmy))
    
    if przedmiot:
        query = query.filter(models.Polisa.przedmiot_ubezpieczenia.like(f"%{przedmiot}%"))
    
    return query.all()