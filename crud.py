from sqlalchemy.orm import Session
import models, schemas

def dodaj_polise(db: Session, polisa: schemas.PolisaCreate):
    nowa_polisa = models.Polisa(**polisa.dict())
    db.add(nowa_polisa)
    db.commit()
    db.refresh(nowa_polisa)
    return nowa_polisa

def pobierz_polisy(db: Session):
    return db.query(models.Polisa).all()