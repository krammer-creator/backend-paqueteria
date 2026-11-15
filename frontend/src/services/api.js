import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-paqueteria.onrender.com/api/v1/paquetes';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const obtenerPaquetes = async () => {
  const response = await api.get('/');
  return response.data;
};

export const crearPaquete = async (datosPaquete) => {
  const response = await api.post('/', datosPaquete);
  return response.data;
};

export const entregarPaquete = async (idPaquete) => {
  try {
    const response = await api.patch(`/${idPaquete}`, { estado: 'ENTREGADO' });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 405) {
      const responsePut = await api.put(`/${idPaquete}`, { estado: 'ENTREGADO' });
      return responsePut.data;
    }
    throw error;
  }
};


export const moverPaqueteEstante = async (idPaquete, nuevoEstante) => {
  const response = await api.patch(`/${idPaquete}`, { ubicacion_estante: nuevoEstante });
  return response.data;
};
export default api;
