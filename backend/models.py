from sqlalchemy import Column, Integer, BigInteger, String, Numeric, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(BigInteger, primary_key=True, index=True)
    ci = Column(String(20), unique=True, nullable=False)
    nombre_completo = Column(String(120), nullable=False)
    telefono = Column(String(20), nullable=False)
    rol = Column(String(20), default="VENDEDOR", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Paquete(Base):
    __tablename__ = "paquetes"

    id_paquete = Column(BigInteger, primary_key=True, index=True)
    codigo_rastreo = Column(String(20), unique=True, nullable=False, index=True)
    token_retiro = Column(String(6), nullable=False)
    id_vendedor = Column(BigInteger, ForeignKey("usuarios.id_usuario"), nullable=False)
    destinatario_nombre = Column(String(120), nullable=False)
    destinatario_telefono = Column(String(20), nullable=False)
    destinatario_ci = Column(String(20), nullable=True)
    costo_custodia = Column(Numeric(6, 2), default=2.00, nullable=False)
    monto_producto = Column(Numeric(10, 2), default=0.00, nullable=False)
    quien_paga_custodia = Column(String(20), default="COMPRADOR", nullable=False)
    ubicacion_estante = Column(String(20), nullable=True)
    fecha_ingreso = Column(DateTime(timezone=True), server_default=func.now())
    fecha_limite = Column(DateTime(timezone=True), nullable=False)
    estado = Column(String(20), default="EN_CUSTODIA", nullable=False)

    # Columnas sincronizadas en Supabase
    recibido_por = Column(String(50), nullable=True)
    entregado_por = Column(String(50), nullable=True)
    fecha_recepcion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_entrega = Column(DateTime(timezone=True), nullable=True)
    remitente_nombre = Column(String(120), nullable=True)
    remitente_telefono = Column(String(30), nullable=True)
    foto_paquete = Column(Text, nullable=True)
    slot_3d = Column(Integer, nullable=True)

class EntregaPago(Base):
    __tablename__ = "entregas_pagos"

    id_entrega = Column(BigInteger, primary_key=True, index=True)
    id_paquete = Column(BigInteger, ForeignKey("paquetes.id_paquete"), unique=True, nullable=False)
    id_operador = Column(BigInteger, ForeignKey("usuarios.id_usuario"), nullable=False)
    dias_excedentes = Column(Integer, default=0, nullable=False)
    recargo_mora = Column(Numeric(6, 2), default=0.00, nullable=False)
    total_cobrado = Column(Numeric(10, 2), nullable=False)
    metodo_pago = Column(String(20), default="EFECTIVO", nullable=False)
    fecha_entrega = Column(DateTime(timezone=True), server_default=func.now())

class PersonalPudo(Base):
    __tablename__ = "personal_pudo"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(120), nullable=False)
    telefono = Column(String(30), nullable=True)
    turno = Column(String(80), default="Mañana (08:00 - 14:00)")
    activo = Column(Boolean, default=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())