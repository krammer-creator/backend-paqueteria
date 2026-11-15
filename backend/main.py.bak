import os
import requests
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Crea las tablas en Supabase automáticamente si aún no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Recepción y Entrega de Paquetes",
    version="1.0.0",
    description="Servicio Backend conectado a PostgreSQL en Supabase"
)

# Habilitar CORS para permitir llamadas desde Vercel o desarrollo local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # En producción puedes acotarlo al dominio de Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

# 1. Obtener todos los paquetes en custodia
@app.get("/api/v1/paquetes", response_model=List[schemas.PaqueteResponse], tags=["Paquetes"])
def list_paquetes(db: Session = Depends(get_db)):
    return db.query(models.Paquete).all()

# 2. Registrar un nuevo paquete
@app.post("/api/v1/paquetes", response_model=schemas.PaqueteResponse, status_code=status.HTTP_201_CREATED, tags=["Paquetes"])
def create_paquete(paquete: schemas.PaqueteCreate, db: Session = Depends(get_db)):
    db_existente = db.query(models.Paquete).filter(models.Paquete.codigo_rastreo == paquete.codigo_rastreo).first()
    if db_existente:
        raise HTTPException(status_code=400, detail="El código de rastreo ya se encuentra registrado.")
    
    nuevo_paquete = models.Paquete(**paquete.model_dump())
    db.add(nuevo_paquete)
    db.commit()
    db.refresh(nuevo_paquete)

    # Disparo opcional de notificación al registrar paquete
    if SLACK_WEBHOOK_URL:
        try:
            requests.post(
                SLACK_WEBHOOK_URL,
                json={"text": f"📦 *Nuevo paquete en custodia*: `{nuevo_paquete.codigo_rastreo}` | Destinatario: *{nuevo_paquete.destinatario_nombre}*"}
            )
        except Exception:
            pass

    return nuevo_paquete

# Esquema rápido para actualizar el estado
class PaqueteEstadoUpdate(BaseModel):
    estado: str

# 3. Actualizar estado del paquete (Entregar paquete)
@app.patch("/api/v1/paquetes/{id_paquete}", response_model=schemas.PaqueteResponse, tags=["Paquetes"])
def update_estado_paquete(id_paquete: int, payload: PaqueteEstadoUpdate, db: Session = Depends(get_db)):
    paquete = db.query(models.Paquete).filter(models.Paquete.id_paquete == id_paquete).first()
    if not paquete:
        raise HTTPException(status_code=404, detail="Paquete no encontrado")
    
    paquete.estado = payload.estado
    db.commit()
    db.refresh(paquete)
    return paquete