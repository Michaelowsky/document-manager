from sqlalchemy import Column, Integer, String, Date, Numeric
from database import Base

class Polisa(Base):
    __tablename__ = "archiwum"

    id = Column(Integer, primary_key=True, index=True)
    rodzaj = Column(String, index=True)
    typ = Column(String, index=True)
    numer_ubezpieczenia = Column(String, index=True)
    ubezpieczajacy = Column(String, index=True)
    data_zawarcia = Column(Date)
    towarzystwo = Column(String, index=True)
    przedmiot_ubezpieczenia = Column(String, index=True)
    ochrona_od = Column(Date)
    ochrona_do = Column(Date)
    skladka = Column(Numeric)
    opiekun = Column(String, index=True)