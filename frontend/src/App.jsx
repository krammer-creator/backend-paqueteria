import React, { useState, useEffect } from 'react';
import Almacen3D from './components/Almacen3D';
import PanelCustodia from './components/PanelCustodia';
import { obtenerPaquetes, moverPaqueteEstante } from './services/api';

export default function App() {
  const [vistaPanel, setVistaPanel] = useState(false);
  const [paquetes, setPaquetes] = useState([]);

  const cargarPaquetes = async () => {
    try {
      const data = await obtenerPaquetes();
      setPaquetes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando paquetes:', error);
    }
  };

  useEffect(() => {
    cargarPaquetes();
  }, [vistaPanel]);

  const manejarMoverPaquete = async (idPaquete, nuevoEstante) => {
    // Actualización optimista inmediata en pantalla
    setPaquetes((prev) =>
      prev.map((p) =>
        p.id_paquete === idPaquete ? { ...p, ubicacion_estante: nuevoEstante } : p
      )
    );
    try {
      await moverPaqueteEstante(idPaquete, nuevoEstante);
      await cargarPaquetes();
      return true;
    } catch (error) {
      console.error('Error al actualizar estante en backend:', error);
      await cargarPaquetes();
      return false;
    }
  };

  return vistaPanel ? (
    <PanelCustodia
      paquetesIniciales={paquetes}
      onVolver={() => setVistaPanel(false)}
      onBack={() => setVistaPanel(false)}
    />
  ) : (
    <Almacen3D
      paquetes={paquetes}
      onEntrarPanel={() => setVistaPanel(true)}
      onMoverPaquete={manejarMoverPaquete}
    />
  );
}