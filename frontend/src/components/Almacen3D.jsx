import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, ContactShadows } from '@react-three/drei';
import { Package, ArrowRight } from 'lucide-react';

function Estante({ position, label, paquetesCajas }) {
  return (
    <group position={position}>
      <Text position={[0, 2.35, 0]} fontSize={0.28} color="#38bdf8" anchorX="center" anchorY="middle">
        {label}
      </Text>
      {[
        [-1.1, 1, -0.45],
        [1.1, 1, -0.45],
        [-1.1, 1, 0.45],
        [1.1, 1, 0.45],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {[0.2, 1.0, 1.8].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.3, 0.06, 1.0]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {paquetesCajas.map((caja, i) => (
        <mesh key={i} position={caja.pos} castShadow receiveShadow>
          <boxGeometry args={caja.size} />
          <meshStandardMaterial color={caja.color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function EscenaAlmacen() {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  const cajasE1 = [
    { pos: [-0.6, 0.48, 0], size: [0.55, 0.5, 0.55], color: '#d97706' },
    { pos: [0.1, 0.43, 0.05], size: [0.45, 0.4, 0.45], color: '#b45309' },
    { pos: [-0.4, 1.28, 0], size: [0.6, 0.5, 0.5], color: '#0284c7' },
    { pos: [0.5, 1.23, -0.05], size: [0.4, 0.4, 0.4], color: '#d97706' },
    { pos: [0, 2.03, 0], size: [0.7, 0.4, 0.5], color: '#059669' },
  ];
  const cajasE2 = [
    { pos: [-0.5, 0.45, 0], size: [0.5, 0.45, 0.5], color: '#b45309' },
    { pos: [0.45, 0.5, 0], size: [0.6, 0.55, 0.55], color: '#d97706' },
    { pos: [0, 1.25, 0.05], size: [0.55, 0.45, 0.45], color: '#d97706' },
    { pos: [-0.55, 2.05, 0], size: [0.45, 0.45, 0.45], color: '#0284c7' },
  ];
  const cajasE3 = [
    { pos: [0, 0.48, 0], size: [0.75, 0.5, 0.6], color: '#d97706' },
    { pos: [-0.45, 1.23, 0], size: [0.45, 0.4, 0.45], color: '#059669' },
    { pos: [0.45, 1.28, 0], size: [0.5, 0.5, 0.5], color: '#b45309' },
    { pos: [0.1, 2.03, 0], size: [0.5, 0.4, 0.5], color: '#d97706' },
  ];

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <Estante position={[-3.2, 0, -0.5]} label="ESTANTE E-01" paquetesCajas={cajasE1} />
      <Estante position={[0, 0, -0.8]} label="ESTANTE E-02" paquetesCajas={cajasE2} />
      <Estante position={[3.2, 0, -0.5]} label="ESTANTE E-03" paquetesCajas={cajasE3} />
    </group>
  );
}

export default function Almacen3D({ onIngresarPanel }) {
  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl max-w-md shadow-2xl">
        <div className="flex items-center gap-3 text-sky-400 mb-2">
          <Package className="w-7 h-7" />
          <span className="text-xs font-bold uppercase tracking-widest">Sistema PUDO</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Centro de Custodia y Paquetería</h1>
        <p className="text-sm text-slate-400 mt-1">
          Visualización 3D del almacén. Arrastra con el mouse para inspeccionar las estanterías E-01, E-02 y E-03.
        </p>
      </div>

      <Canvas shadows camera={{ position: [0, 3.2, 7.5], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[-4, 4, 3]} intensity={0.5} color="#38bdf8" />
        <EscenaAlmacen />
        <ContactShadows position={[0, -0.09, 0]} opacity={0.4} scale={14} blur={2} />
        <Environment preset="city" />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={4} maxDistance={12} />
      </Canvas>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={onIngresarPanel}
          className="group flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-sky-500/30 transition-all duration-200 hover:scale-105"
        >
          <span>Ingresar al Panel de Control</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
