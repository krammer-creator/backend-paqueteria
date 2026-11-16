const RAW_API = import.meta.env.VITE_API_URL || 'https://backend-paqueteria.onrender.com';
const API_BASE = RAW_API.replace(/\/api\/v1.*$/i, '').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const detalle = await res.text().catch(() => '');
    throw new Error(detalle || `Error HTTP ${res.status}`);
  }
  return res.json();
}

export function obtenerPaquetes() {
  return request('/api/v1/paquetes');
}

export function crearPaquete(payload) {
  return request('/api/v1/paquetes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function actualizarPaquete(idPaquete, datos) {
  return request(`/api/v1/paquetes/${idPaquete}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  });
}

export function moverPaqueteEstante(idPaquete, nuevoEstante, slot3d = null) {
  return actualizarPaquete(idPaquete, {
    ubicacion_estante: nuevoEstante,
    ...(slot3d !== null ? { slot_3d: slot3d } : {}),
  });
}

export function entregarPaquete(idPaquete, entregadoPor = null) {
  return actualizarPaquete(idPaquete, {
    estado: 'ENTREGADO',
    ...(entregadoPor ? { entregado_por: entregadoPor } : {}),
  });
}

// --- Personal en Turno (Supabase) ---
export function obtenerPersonal() {
  return request('/api/v1/personal');
}

export function crearPersonal(payload) {
  return request('/api/v1/personal', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function activarPersonal(idPersonal) {
  return request(`/api/v1/personal/${idPersonal}/activar`, {
    method: 'PATCH',
  });
}

export function eliminarPersonal(idPersonal) {
  return request(`/api/v1/personal/${idPersonal}`, {
    method: 'DELETE',
  });
}
export function limpiarPaquetesEntregadosApi() {
  return request('/api/v1/paquetes/entregados', {
    method: 'DELETE',
  });
}