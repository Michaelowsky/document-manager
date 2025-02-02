from sqlalchemy.orm import Session
import models, schemas

def dodaj_dokument(db: Session, dokument: schemas.DokumentCreate):
    nowy_dokument = models.Dokument(**dokument.dict())
    db.add(nowy_dokument)
    db.commit()
    db.refresh(nowy_dokument)
    return nowy_dokument

def pobierz_dokumenty(db: Session):
    return db.query(models.Dokument).all()