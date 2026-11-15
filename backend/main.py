from typing import Optional, List
from datetime import datetime, timezone
import os
import requests
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Recepción y Entrega de Paquetes",
    version="1.1.0",
    description="Servicio Backend conectado a PostgreSQL en Supabase"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

@app.get("/api/v1/paquetes", response_model=List[schemas.PaqueteResponse], tags=["Paquetes"])
def list_paquetes(db: Session = Depends(get_db)):
    return db.query(models.Paquete).order_by(models.Paquete.id_paquete.desc()).all()

@app.post("/api/v1/paquetes", response_model=schemas.PaqueteResponse, status_code=status.HTTP_201_CREATED, tags=["Paquetes"])
def create_paquete(paquete: schemas.PaqueteCreate, db: Session = Depends(get_db)):
    db_existente = db.query(models.Paquete).filter(models.Paquete.codigo_rastreo == paquete.codigo_rastreo).first()
    if db_existente:
        raise HTTPException(status_code=400, detail="El código de rastreo ya se encuentra registrado.")

    datos = paquete.model_dump()
    datos["fecha_recepcion"] = datetime.now(timezone.utc)
    nuevo_paquete = models.Paquete(**datos)
    db.add(nuevo_paquete)
    db.commit()
    db.refresh(nuevo_paquete)

    if SLACK_WEBHOOK_URL:
        try:
            requests.post(
                SLACK_WEBHOOK_URL,
                json={"text": f"📦 *Nuevo paquete en custodia:* `{nuevo_paquete.codigo_rastreo}` | Destinatario: *{nuevo_paquete.destinatario_nombre}*"}
            )
        except Exception:
            pass

    return nuevo_paquete

class PaqueteEstadoUpdate(BaseModel):
    estado: Optional[str] = None
    ubicacion_estante: Optional[str] = None
    slot_3d: Optional[int] = None
    entregado_por: Optional[str] = None
    foto_paquete: Optional[str] = None

@app.patch("/api/v1/paquetes/{id_paquete}", response_model=schemas.PaqueteResponse, tags=["Paquetes"])
def update_estado_paquete(id_paquete: int, payload: PaqueteEstadoUpdate, db: Session = Depends(get_db)):
    paquete = db.query(models.Paquete).filter(models.Paquete.id_paquete == id_paquete).first()
    if not paquete:
        raise HTTPException(status_code=404, detail="Paquete no encontrado")

    if payload.estado is not None:
        paquete.estado = payload.estado
        if payload.estado.upper() == "ENTREGADO":
            paquete.fecha_entrega = datetime.now(timezone.utc)

    if payload.ubicacion_estante is not None:
        paquete.ubicacion_estante = payload.ubicacion_estante

    if payload.slot_3d is not None:
        paquete.slot_3d = payload.slot_3d

    if payload.entregado_por is not None:
        paquete.entregado_por = payload.entregado_por
    if payload.foto_paquete is not None:
        paquete.foto_paquete = payload.foto_paquete

    db.commit()
    db.refresh(paquete)
    return paquete

# --- ENDPOINTS DE PERSONAL EN TURNO (SUPERVISIÓN MULTI-DISPOSITIVO) ---

@app.get("/api/v1/personal", response_model=List[schemas.PersonalResponse], tags=["Personal"])
def list_personal(db: Session = Depends(get_db)):
    return db.query(models.PersonalPudo).order_by(models.PersonalPudo.id.asc()).all()

@app.post("/api/v1/personal", response_model=schemas.PersonalResponse, status_code=status.HTTP_201_CREATED, tags=["Personal"])
def create_personal(persona: schemas.PersonalCreate, db: Session = Depends(get_db)):
    existente = db.query(models.PersonalPudo).filter(models.PersonalPudo.codigo == persona.codigo).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ese código de empleado ya existe.")
    if persona.activo:
        db.query(models.PersonalPudo).update({models.PersonalPudo.activo: False})
    nuevo = models.PersonalPudo(**persona.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.patch("/api/v1/personal/{id_personal}/activar", response_model=List[schemas.PersonalResponse], tags=["Personal"])
def activar_personal(id_personal: int, db: Session = Depends(get_db)):
    db.query(models.PersonalPudo).update({models.PersonalPudo.activo: False})
    if id_personal > 0:
        persona = db.query(models.PersonalPudo).filter(models.PersonalPudo.id == id_personal).first()
        if persona:
            persona.activo = True
    db.commit()
    return db.query(models.PersonalPudo).order_by(models.PersonalPudo.id.asc()).all()

@app.delete("/api/v1/personal/{id_personal}", tags=["Personal"])
def delete_personal(id_personal: int, db: Session = Depends(get_db)):
    persona = db.query(models.PersonalPudo).filter(models.PersonalPudo.id == id_personal).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    db.delete(persona)
    db.commit()
    return {"ok": True}