from sqlalchemy import Column, Integer, String, Date
from database import Base

class Polisa(Base):
    __tablename__ = "polisy"

    id = Column(Integer, primary_key=True, index=True)
    rodzaj_polisy = Column(String, index=True)
    imie = Column(String, index=True)
    nazwisko = Column(String, index=True)
    data_zawarcia = Column(Date)
    data_zakonczenia = Column(Date)