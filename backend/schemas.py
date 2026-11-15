from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PaqueteBase(BaseModel):
    codigo_rastreo: str
    token_retiro: str
    id_vendedor: int
    destinatario_nombre: str
    destinatario_telefono: str
    destinatario_ci: Optional[str] = None
    costo_custodia: float = 2.00
    monto_producto: float = 0.00
    quien_paga_custodia: str = "COMPRADOR"
    ubicacion_estante: Optional[str] = None
    fecha_limite: datetime
    recibido_por: Optional[str] = None
    entregado_por: Optional[str] = None
    remitente_nombre: Optional[str] = None
    remitente_telefono: Optional[str] = None
    foto_paquete: Optional[str] = None
    slot_3d: Optional[int] = None

class PaqueteCreate(PaqueteBase):
    pass

class PaqueteResponse(PaqueteBase):
    id_paquete: int
    estado: str
    fecha_ingreso: datetime
    fecha_recepcion: Optional[datetime] = None
    fecha_entrega: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PersonalBase(BaseModel):
    codigo: str
    nombre: str
    telefono: Optional[str] = None
    turno: str = "Mañana (08:00 - 14:00)"
    activo: bool = False

class PersonalCreate(PersonalBase):
    pass

class PersonalResponse(PersonalBase):
    id: int
    creado_en: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)