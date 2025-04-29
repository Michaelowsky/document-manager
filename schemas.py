from pydantic import BaseModel
from datetime import date
from typing import Optional
from datetime import datetime


class PolisaBase(BaseModel):
    rodzaj: Optional[str] = None
    typ: Optional[str] = None
    numer_ubezpieczenia: str
    ubezpieczajacy: str
    data_zawarcia: Optional[date] = None
    towarzystwo: Optional[str] = None
    przedmiot_ubezpieczenia: str
    ochrona_od: date
    ochrona_do: date
    skladka: float
    opiekun: Optional[str] = None

class PolisaCreate(PolisaBase):
    pass

class PolisaResponse(PolisaBase):
    id: int
    ubezpieczony: str = "Brak danych"

    class Config:
        orm_mode = True
        from_attributes = True

class FirmaBase(BaseModel):
    nip: str
    regon: str
    ubezpieczajacy: str

class FirmaCreate(FirmaBase):
    pass

class FirmaResponse(FirmaBase):
    id: int

    class Config:
        orm_mode = True

class UbezpieczonyBase(BaseModel):
    numer_polisy: str
    ubezpieczony: str

class UbezpieczonyCreate(UbezpieczonyBase):
    pass

class UbezpieczonyResponse(UbezpieczonyBase):
    id: int

    class Config:
        orm_mode = True

class PlatnosciBase(BaseModel):
    numer_polisy: str
    platnosci: str
    kurtaz: float 

class PlatnosciCreate(PlatnosciBase):
    pass

class PlatnosciResponse(PlatnosciBase):
    id: int

    class Config:
        orm_mode = True

class NotatkaBase(BaseModel):
    numer_polisy: str
    notatka: str

class NotatkaCreate(NotatkaBase):  # Dodano klasę NotatkaCreate
    pass

class NotatkaResponse(NotatkaBase):
    id: int
    data_zapisania: datetime  # Dodano datę zapisania

    class Config:
        orm_mode = True