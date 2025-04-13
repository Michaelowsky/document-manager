from sqlalchemy import Column, Integer, String, Date, Numeric
from database import Base

class Polisa(Base):
    __tablename__ = "archiwum"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
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

class Firma(Base):
    __tablename__ = "firmy"

    id = Column(Integer, primary_key=True, index=True)
    nip = Column(String, index=True)
    regon = Column(String, index=True)
    ubezpieczajacy = Column(String, index=True)

class Ubezpieczony(Base):
    __tablename__ = "ubezpieczeni"

    id = Column(Integer, primary_key=True, index=True)
    numer_polisy = Column(String, index=True)
    ubezpieczony = Column(String, index=True)

class Platnosci(Base):
    __tablename__ = "platnosci"

    id = Column(Integer, primary_key=True, index=True)
    nazwa_towarzystwa = Column(String, nullable=False)
    numer_polisy = Column(String, index=True, unique=True)
    platnosci = Column(String) 
    kurtaz = Column(Numeric(10, 2))  # Dodano kolumnę kurtaz
