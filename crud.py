from sqlalchemy.orm import Session
from sqlalchemy import or_, Date, func
import models, schemas
from datetime import datetime
from sqlalchemy.sql import cast

def dodaj_polise(db: Session, polisa: schemas.PolisaCreate):
    nowa_polisa = models.Polisa(**polisa.dict())
    db.add(nowa_polisa)
    db.commit()
    db.refresh(nowa_polisa)
    return nowa_polisa

def pobierz_polisy(db: Session):
    return db.query(models.Polisa).all()

def dodaj_firme(db: Session, firma: schemas.FirmaCreate):
   
    istniejąca_firma = db.query(models.Firma).filter_by(nip=firma.nip, regon=firma.regon).first()

    if istniejąca_firma:
        return istniejąca_firma

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

def wyszukaj_polisy(db: Session, ubezpieczajacy: str = None, ubezpieczony: str = None, nip: str = None, regon: str = None, przedmiot: str = None, numer_polisy: str = None, data_zawarcia_od: str = None, data_zawarcia_do: str = None, ochrona_od: str = None, ochrona_do: str = None, zakonczenie_od: str = None, zakonczenie_do: str = None, limit: int = 10, offset: int = 0):
    query = db.query(models.Polisa)
    
    # Filtrowanie po ubezpieczającym
    if ubezpieczajacy:
        query = query.filter(func.lower(models.Polisa.ubezpieczajacy).ilike(f"%{ubezpieczajacy.lower()}%"))
    
    # Filtrowanie po ubezpieczonym
    if ubezpieczony:
        polisy = db.query(models.Ubezpieczony).filter(models.Ubezpieczony.ubezpieczony.like(f"%{ubezpieczony}%")).all()
        numery_polis = [polisa.numer_polisy for polisa in polisy]
        query = query.filter(models.Polisa.numer_ubezpieczenia.in_(numery_polis))
    
    # Filtrowanie po NIP
    if nip:
        firmy = db.query(models.Firma).filter(models.Firma.nip.like(f"%{nip}%")).all()
        ubezpieczajacy_firmy = [firma.ubezpieczajacy for firma in firmy]
        query = query.filter(models.Polisa.ubezpieczajacy.in_(ubezpieczajacy_firmy))
    
    # Filtrowanie po REGON
    if regon:
        firmy = db.query(models.Firma).filter(models.Firma.regon.like(f"%{regon}%")).all()
        ubezpieczajacy_firmy = [firma.ubezpieczajacy for firma in firmy]
        query = query.filter(models.Polisa.ubezpieczajacy.in_(ubezpieczajacy_firmy))
    
    # Filtrowanie po przedmiocie ubezpieczenia
    if przedmiot:
        query = query.filter(models.Polisa.przedmiot_ubezpieczenia.like(f"%{przedmiot}%"))
    
    # Filtrowanie po numerze polisy
    if numer_polisy:
        query = query.filter(models.Polisa.numer_ubezpieczenia.ilike(numer_polisy))
    
    # Filtrowanie po dacie zawarcia
    if data_zawarcia_od and data_zawarcia_do:
        query = query.filter(models.Polisa.data_zawarcia.between(data_zawarcia_od, data_zawarcia_do))
    elif data_zawarcia_od:
        query = query.filter(models.Polisa.data_zawarcia >= data_zawarcia_od)
    elif data_zawarcia_do:
        query = query.filter(models.Polisa.data_zawarcia <= data_zawarcia_do)
    
    # Filtrowanie po dacie ochrony
    if ochrona_od and ochrona_do:
        query = query.filter(models.Polisa.ochrona_od.between(ochrona_od, ochrona_do))
    elif ochrona_od:
        query = query.filter(models.Polisa.ochrona_od >= ochrona_od)
    elif ochrona_do:
        query = query.filter(models.Polisa.ochrona_od <= ochrona_do)
    
    # Filtrowanie po dacie zakończenia ochrony
    if zakonczenie_od and zakonczenie_do:
        query = query.filter(models.Polisa.ochrona_do.between(zakonczenie_od, zakonczenie_do))
    elif zakonczenie_od:
        query = query.filter(models.Polisa.ochrona_do >= zakonczenie_od)
    elif zakonczenie_do:
        query = query.filter(models.Polisa.ochrona_do <= zakonczenie_do)
    
    # Zastosowanie limitu i offsetu
    return query.offset(offset).limit(limit).all()

def sprawdz_platnosci(db: Session, numer_polisy: str):
    try:
        print(f"Sprawdzanie płatności dla numeru polisy: {numer_polisy}")
        wynik = db.query(models.Platnosci).filter(models.Platnosci.numer_polisy == numer_polisy).first()
        print(f"Wynik zapytania: {wynik}")
        return wynik
    except Exception as e:
        print(f"Błąd w funkcji sprawdz_platnosci: {e}")
        return None

def zapisz_platnosci(db: Session, platnosci: schemas.PlatnosciCreate):

    polisa = db.query(models.Polisa).filter(models.Polisa.numer_ubezpieczenia == platnosci.numer_polisy).first()

    if not polisa:
        raise ValueError(f"Nie znaleziono polisy o numerze: {platnosci.numer_polisy}")
    
    nazwa_towarzystwa = polisa.towarzystwo

    nowa_platnosc = models.Platnosci(
        nazwa_towarzystwa=nazwa_towarzystwa,
        numer_polisy=platnosci.numer_polisy,
        platnosci=platnosci.platnosci,
        kurtaz=platnosci.kurtaz
    )

    db.add(nowa_platnosc)
    db.commit()
    db.refresh(nowa_platnosc)

    return nowa_platnosc

def dodaj_notatke(db: Session, notatka: schemas.NotatkaCreate):
    nowa_notatka = models.Notatki(
        **notatka.dict(),
        data_zapisania=datetime.utcnow()  # Ustaw datę zapisania
    )
    db.add(nowa_notatka)
    db.commit()
    db.refresh(nowa_notatka)
    return nowa_notatka

def pobierz_notatki(db: Session, numer_polisy: str):
    return db.query(models.Notatki).filter(models.Notatki.numer_polisy == numer_polisy).all()