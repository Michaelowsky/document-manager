from fastapi import APIRouter, Depends, Request, Query, HTTPException, Path, Body
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import crud, schemas, re, models
from database import get_db
import pandas as pd
from fastapi.responses import FileResponse
import os
from datetime import datetime
from urllib.parse import unquote
from decimal import Decimal

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# Endpoint do dodawania polisy
@router.post("/dodaj_polise/")
def dodaj_polise(polisa: schemas.PolisaCreate, db: Session = Depends(get_db)):
    print("Otrzymano polise:", polisa)
    return crud.dodaj_polise(db, polisa)

# Endpoint do pobierania polis
@router.get("/polisy", response_model=schemas.PolisaResponse)
def pobierz_polisy(numer_polisy: str = Query(..., description="Numer polisy zakodowany w URL"), db: Session = Depends(get_db)):
    print(f"Zapytanie o polisę z numerem: {numer_polisy}")

    # Pobierz polisę
    polisa = db.query(models.Polisa).filter(models.Polisa.numer_ubezpieczenia == numer_polisy.strip()).first()
    if not polisa:
        print("Nie znaleziono polisy o podanym numerze.")
        raise HTTPException(status_code=404, detail="Nie znaleziono polisy o podanym numerze.")

    # Pobierz dane ubezpieczonego
    ubezpieczony = db.query(models.Ubezpieczony).filter(models.Ubezpieczony.numer_polisy == numer_polisy.strip()).first()
    if ubezpieczony:
        print(f"Znaleziono ubezpieczonego: {ubezpieczony.ubezpieczony}")
        polisa.ubezpieczony = ubezpieczony.ubezpieczony  # Dodaj pole do obiektu polisy
    else:
        print(f"Nie znaleziono ubezpieczonego dla numeru polisy: {numer_polisy}")
        polisa.ubezpieczony = "Brak danych"

    return schemas.PolisaResponse.from_orm(polisa)

# Endpoint do dodawania firmy
@router.post("/dodaj_firme/")
def dodaj_firme(firma: schemas.FirmaCreate, db: Session = Depends(get_db)):
    print("Otrzymano firme:", firma)
    return crud.dodaj_firme(db, firma)

# Endpoint do pobierania 10 pierwszych pozycji z tabeli archiwum
@router.get("/pierwsze_pozycje/", response_model=list[schemas.PolisaResponse])
def pobierz_pierwsze_pozycje(db: Session = Depends(get_db)):
    pozycje = crud.pobierz_pierwsze_pozycje(db)
    print("Pobrane pierwsze pozycje:", pozycje)
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

# Endpoint do pobierania generowania zestawienia
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

# Endpoint do sprawdzania polisy
@router.get("/platnosci", response_model=dict)
def sprawdz_polisy(
    numer_polisy: str = Query(..., description="Numer polisy zakodowany w URL"),
    db: Session = Depends(get_db)
):
    try:
        print(f"Otrzymany numer polisy (zakodowany): {numer_polisy}")

        numer_polisy = unquote(numer_polisy)  # Dekodowanie numeru polisy
        print(f"Zdekodowany numer polisy: {numer_polisy}")

        platnosc = crud.sprawdz_platnosci(db, numer_polisy)
        if not platnosc:
            print("Nie znaleziono płatności dla podanego numeru polisy.")
            return {"exists": False}

        # Walidacja danych płatności
        if not platnosc.platnosci or platnosc.platnosci.strip() == "":
            print("Brak danych płatności dla tej polisy.")
            return {"exists": True, "platnosci": ""}

        platnosci = platnosc.platnosci.split(";")
        poprawne_platnosci = []
        for p in platnosci:
            try:
                data_skladki, skladka, data_zaplacenia, kwota_zaplacenia = p.split(",")
                poprawne_platnosci.append(f"{data_skladki},{skladka},{data_zaplacenia},{kwota_zaplacenia}")
            except ValueError as e:
                print(f"Błąd podczas przetwarzania płatności: {p}, błąd: {e}")
                continue

        platnosc.platnosci = ";".join(poprawne_platnosci)
        return {"exists": True, "platnosci": platnosc.platnosci}
    except Exception as e:
        print(f"Błąd podczas sprawdzania płatności: {e}")
        raise HTTPException(status_code=500, detail="Wystąpił błąd podczas sprawdzania płatności.")
    
# Endpoint do zapisywania płatności
@router.post("/platnosci/", response_model=schemas.PlatnosciResponse)
def zapisz_platnosci(platnosci: schemas.PlatnosciCreate, db: Session = Depends(get_db)):
    print(f"Otrzymane dane: numer_polisy={platnosci.numer_polisy}, platnosci={platnosci.platnosci}, kurtaz={platnosci.kurtaz}")
    try:
        nowa_platnosc = crud.zapisz_platnosci(db, platnosci)
        return nowa_platnosc
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Endpoint do aktualizacji płatności
@router.put("/platnosci", response_model=schemas.PlatnosciResponse)
def aktualizuj_platnosci(

    
    numer_polisy: str = Query(..., description="Numer polisy zakodowany w URL"),
    nowe_platnosci: dict = Body(..., description="Nowe płatności w formacie JSON"),
    db: Session = Depends(get_db)
):
    try:
        print(f"Otrzymany numer polisy (zakodowany): {numer_polisy}")
        numer_polisy = unquote(numer_polisy)  # Dekodowanie numeru polisy
        print(f"Zdekodowany numer polisy: {numer_polisy}")

        platnosc = crud.sprawdz_platnosci(db, numer_polisy)
        if not platnosc:
            raise HTTPException(status_code=404, detail="Nie znaleziono płatności dla podanego numeru polisy.")

        # Aktualizacja płatności
        aktualne_platnosci = platnosc.platnosci.split(";")
        for i, nowa_platnosc in nowe_platnosci.items():
            if nowa_platnosc:  # Jeśli użytkownik wpisał wartość
                data_zaplacenia = nowa_platnosc.get("dataZaplacenia", "").strip()
                kwota_zaplacenia = nowa_platnosc.get("kwotaZaplacenia", "").strip()
                aktualne_platnosci[int(i)] = f"{aktualne_platnosci[int(i)].split(',')[0]},{aktualne_platnosci[int(i)].split(',')[1]},{data_zaplacenia},{kwota_zaplacenia}"

        platnosc.platnosci = ";".join(aktualne_platnosci)
        db.commit()
        db.refresh(platnosc)
        return platnosc
    except Exception as e:
        print(f"Błąd podczas aktualizacji płatności: {e}")
        raise HTTPException(status_code=500, detail="Wystąpił błąd podczas aktualizacji płatności.")
    
@router.get("/ubezpieczony", response_model=schemas.UbezpieczonyResponse)
def pobierz_ubezpieczonego(numer_polisy: str = Query(..., description="Numer polisy zakodowany w URL"), db: Session = Depends(get_db)):
    ubezpieczony = db.query(models.Ubezpieczony).filter(models.Ubezpieczony.numer_polisy == numer_polisy).first()
    if not ubezpieczony:
        return {"id": None, "numer_polisy": numer_polisy, "ubezpieczony": "Brak danych"}
    return ubezpieczony

@router.post("/raport_knf/")
def generuj_raport_knf(
    data_zawarcia_od: str = Body(..., description="Data zawarcia od"),
    data_zawarcia_do: str = Body(..., description="Data zawarcia do"),
    db: Session = Depends(get_db)
):
    # Konwertuj zakres dat na obiekty daty
    data_zawarcia_od_date = datetime.strptime(data_zawarcia_od, "%Y-%m-%d").date()
    data_zawarcia_do_date = datetime.strptime(data_zawarcia_do, "%Y-%m-%d").date()

    # Pobierz polisy z tabeli archiwum w podanym przedziale dat
    polisy = (
        db.query(models.Polisa.numer_ubezpieczenia, models.Polisa.towarzystwo, models.Polisa.skladka)
        .filter(models.Polisa.data_zawarcia >= data_zawarcia_od_date)
        .filter(models.Polisa.data_zawarcia <= data_zawarcia_do_date)
        .all()
    )

    # Grupuj dane według towarzystwa
    raport = {}
    for numer_polisy, towarzystwo, skladka in polisy:
        if towarzystwo not in raport:
            raport[towarzystwo] = {
                "suma_skladek": 0,
                "suma_skladek_kurtaz": 0,
                "suma_kwot_zaplacenia": 0,
                "prowizja_zainkasowana": 0  # Nowa kolumna
            }

        # Dodaj składkę do sumy składek
        raport[towarzystwo]["suma_skladek"] += skladka

        # Pobierz kurtaż z tabeli płatności
        platnosc = db.query(models.Platnosci).filter(models.Platnosci.numer_polisy == numer_polisy).first()
        if platnosc and platnosc.kurtaz:
            raport[towarzystwo]["suma_skladek_kurtaz"] += Decimal(skladka) * platnosc.kurtaz

        # Oblicz sumę kwot zapłacenia i prowizję w podanym okresie
        if platnosc and platnosc.platnosci:
            platnosci = platnosc.platnosci.split(";")
            for platnosc_entry in platnosci:
                try:
                    # Rozdziel dane płatności
                    planowana_data, skladka_raty, data_zaplacenia, kwota_zaplacenia = platnosc_entry.split(",")

                    # Konwertuj data_zaplacenia na obiekt daty
                    if data_zaplacenia.strip():
                        data_zaplacenia_date = datetime.strptime(data_zaplacenia.strip(), "%Y-%m-%d").date()

                        # Sprawdź, czy data zapłacenia mieści się w podanym zakresie
                        if data_zawarcia_od_date <= data_zaplacenia_date <= data_zawarcia_do_date:
                            # Dodaj kwotę zapłacenia do sumy, jeśli istnieje
                            if kwota_zaplacenia.strip():
                                kwota_zaplacenia_decimal = Decimal(kwota_zaplacenia.strip())
                                raport[towarzystwo]["suma_kwot_zaplacenia"] += kwota_zaplacenia_decimal

                                # Oblicz prowizję i dodaj do sumy prowizji
                                raport[towarzystwo]["prowizja_zainkasowana"] += kwota_zaplacenia_decimal * platnosc.kurtaz
                except ValueError as e:
                    print(f"Błąd przetwarzania płatności: {platnosc_entry}, błąd: {e}")
                    continue

    # Konwertuj dane do DataFrame
    import pandas as pd
    df = pd.DataFrame(
        [
            {
                "Towarzystwo": towarzystwo,
                "Suma Składek": dane["suma_skladek"],
                "Suma Składek * Kurtaż": dane["suma_skladek_kurtaz"],
                "Suma Kwot Zapłacenia": dane["suma_kwot_zaplacenia"],
                "Prowizja Zainkasowana": dane["prowizja_zainkasowana"]  # Nowa kolumna
            }
            for towarzystwo, dane in raport.items()
        ]
    )

    # Zapisz do pliku Excel
    folder_path = "RaportyKNF"
    os.makedirs(folder_path, exist_ok=True)
    file_name = f"Raport_KNF_{data_zawarcia_od}_do_{data_zawarcia_do}.xlsx"
    file_path = os.path.join(folder_path, file_name)
    df.to_excel(file_path, index=False)

    return {"message": f"Raport wygenerowany: {file_name}", "file_path": file_path}

@router.get("/szukaj_firme/", response_model=schemas.FirmaResponse)
def szukaj_firme(nip: str = Query(..., description="NIP firmy"), db: Session = Depends(get_db)):
    firma = db.query(models.Firma).filter(models.Firma.nip == nip.strip()).first()
    if not firma:
        raise HTTPException(status_code=404, detail="Nie znaleziono firmy o podanym NIP.")
    return firma

@router.get("/szukaj_firme_regon/", response_model=schemas.FirmaResponse)
def szukaj_firme_regon(regon: str = Query(..., description="REGON firmy"), db: Session = Depends(get_db)):
    firma = db.query(models.Firma).filter(models.Firma.regon == regon.strip()).first()
    if not firma:
        raise HTTPException(status_code=404, detail="Nie znaleziono firmy o podanym REGON.")
    return firma