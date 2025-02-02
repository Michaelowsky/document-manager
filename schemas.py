from pydantic import BaseModel
from datetime import date

class DokumentCreate(BaseModel):
    imie: str
    nazwisko: str
    data_zawarcia: date
    data_zakonczenia: date


class DokumentResponse(DokumentCreate):
    id: int

    class Config:
        from_attributes = True