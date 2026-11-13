from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

# Base compartida
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

# Datos requeridos al crear un paquete (POST)
class PaqueteCreate(PaqueteBase):
    pass

# Formato de respuesta que envía la API (incluye el id asignado por Supabase)
class PaqueteResponse(PaqueteBase):
    id_paquete: int
    estado: str
    fecha_ingreso: datetime

    model_config = ConfigDict(from_attributes=True)