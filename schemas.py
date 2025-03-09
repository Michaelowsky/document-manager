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