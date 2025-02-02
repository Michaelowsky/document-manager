from sqlalchemy import Column, Integer, String, Date
from database import Base

class Dokument(Base):
    __tablename__ = "dokumenty"

    id = Column(Integer, primary_key=True, index=True)
    imie = Column(String, index=True)
    nazwisko = Column(String, index=True)
    data_zawarcia = Column(Date)
    data_zakonczenia = Column(Date)