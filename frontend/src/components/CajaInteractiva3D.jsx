import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';

function CajaEncomienda({ codigoRastreo, estante }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.5, 1.8]} />
        <meshStandardMaterial color="#c2813e" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.755, 0]}>
        <boxGeometry args={[2.22, 0.02, 0.25]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0.91]}>
        <planeGeometry args={[1.3, 0.85]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <Text position={[0, 0.25, 0.92]} fontSize={0.11} color="#0f172a" fontWeight="bold">
        PUDO CUSTODIA
      </Text>
      <Text position={[0, 0.03, 0.92]} fontSize={0.13} color="#0284c7">
        {codigoRastreo || 'TRK-BO-0000'}
      </Text>
      <Text position={[0, -0.2, 0.92]} fontSize={0.1} color="#475569">
        {`UBICACION: ${estante || 'E-01'}`}
      </Text>
    </group>
  );
}

export default function CajaInteractiva3D({ paqueteSeleccionado }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Inspección 3D de Encomienda</h3>
          <p className="text-xs text-slate-400">Usa el mouse para rotar 360° y hacer zoom</p>
        </div>
        <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-full font-mono">
          {paqueteSeleccionado?.codigo_rastreo || 'Vista Previa'}
        </span>
      </div>

      <div className="w-full h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80">
        <Canvas shadows camera={{ position: [2.8, 2.2, 3.2], fov: 40 }}>
          <color attach="background" args={['#090d16']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 4]} intensity={1.3} />
          <CajaEncomienda
            codigoRastreo={paqueteSeleccionado?.codigo_rastreo}
            estante={paqueteSeleccionado?.ubicacion_estante}
          />
          <Environment preset="warehouse" />
          <OrbitControls enablePan={false} minDistance={2.2} maxDistance={7} />
        </Canvas>
      </div>
    </div>
  );
}
