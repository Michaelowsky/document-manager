import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import Polisa

# Ustawienia bazy danych
DATABASE_URL = r"postgresql+psycopg2://postgres:PostGres2025@localhost/archiwizacja"  # Użyj surowego ciągu znaków

# Utwórz silnik bazy danych
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Odczytaj plik Excel
file_path = r"C:\Users\aleks\Downloads\excel.xlsx"
df = pd.read_excel(file_path, engine='openpyxl')

# Wyświetl nazwy kolumn
print("Nazwy kolumn w DataFrame:", df.columns)

# Konwersja dat
df['Data zawarcia'] = pd.to_datetime(df['Data zawarcia'], format='%d.%m.%Y').dt.strftime('%Y-%m-%d')
df['Okres ochrony od'] = pd.to_datetime(df['Okres ochrony od'], format='%d.%m.%Y').dt.strftime('%Y-%m-%d')
df['Okres ochrony do'] = pd.to_datetime(df['Okres ochrony do'], format='%d.%m.%Y').dt.strftime('%Y-%m-%d')

# Przetwórz dane i zapisz do bazy danych
for index, row in df.iterrows():
    polisa = Polisa(
        rodzaj=row['Rodzaj'],
        typ=row['Typ'],
        numer_ubezpieczenia=row['Nr ubezpieczenia'],
        ubezpieczajacy=row['Ubezpieczający'],
        data_zawarcia=row['Data zawarcia'],
        towarzystwo=row['TU'],
        przedmiot_ubezpieczenia=row['Przedmioty ubezpieczenia'],
        ochrona_od=row['Okres ochrony od'],
        ochrona_do=row['Okres ochrony do'],
        skladka=row['Składka przypisana'],
        opiekun=row['Opiekunowie']
    )
    session.add(polisa)

# Zatwierdź transakcję
session.commit()

print("Dane zostały zaimportowane pomyślnie.")