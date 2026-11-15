import React, { useState } from 'react';
import Almacen3D from './components/Almacen3D';
import PanelCustodia from './components/PanelCustodia';

export default function App() {
  const [vistaActual, setVistaActual] = useState('almacen3d');

  return (
    <>
      {vistaActual === 'almacen3d' ? (
        <Almacen3D onIngresarPanel={() => setVistaActual('panel')} />
      ) : (
        <PanelCustodia onVolverAlmacen={() => setVistaActual('almacen3d')} />
      )}
    </>
  );
}
