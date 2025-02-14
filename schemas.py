from pydantic import BaseModel
from datetime import date

class PolisaCreate(BaseModel):
    rodzaj_polisy: str
    imie: str
    nazwisko: str
    data_zawarcia: date
    data_zakonczenia: date

class PolisaResponse(PolisaCreate):
    id: int

    class Config:
        from_attributes = True