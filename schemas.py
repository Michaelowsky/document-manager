from pydantic import BaseModel
from datetime import date

class PolisaBase(BaseModel):
    rodzaj: str
    typ: str
    numer_ubezpieczenia: str
    ubezpieczajacy: str
    data_zawarcia: date
    towarzystwo: str
    przedmiot_ubezpieczenia: str
    ochrona_od: date
    ochrona_do: date
    skladka: float
    opiekun: str

class PolisaCreate(PolisaBase):
    pass

class PolisaResponse(PolisaBase):
    id: int

    class Config:
        orm_mode = True