import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const ESTANTES_CONFIG = [
  { nombre: 'E-01', pos: [-3.2, 0, 0] },
  { nombre: 'E-02', pos: [0, 0, 0] },
  { nombre: 'E-03', pos: [3.2, 0, 0] },
];

function detectarEstantePorX(x) {
  if (x < -1.6) return 'E-01';
  if (x > 1.6) return 'E-03';
  return 'E-02';
}

function CajaArrastrable({
  pkg,
  position,
  index,
  onDragStart,
  onDragMove,
  onDragEnd,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { camera, gl } = useThree();
  const planoArrastre = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const puntoInterseccion = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (meshRef.current && !dragging) {
      meshRef.current.position.x = position[0];
      meshRef.current.position.z = position[2];
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.02;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
    gl.domElement.style.cursor = 'grabbing';
    e.target.setPointerCapture(e.pointerId);
    onDragStart(pkg);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    e.stopPropagation();
    if (e.ray.intersectPlane(planoArrastre.current, puntoInterseccion.current)) {
      const clampedX = Math.max(-4.3, Math.min(4.3, puntoInterseccion.current.x));
      const clampedY = Math.max(0.45, Math.min(2.85, puntoInterseccion.current.y));
      if (meshRef.current) {
        meshRef.current.position.set(clampedX, clampedY, 0.35);
      }
      onDragMove(detectarEstantePorX(clampedX));
    }
  };

  const handlePointerUp = (e) => {
    if (!dragging) return;
    e.stopPropagation();
    setDragging(false);
    gl.domElement.style.cursor = hovered ? 'grab' : 'auto';
    e.target.releasePointerCapture(e.pointerId);

    const finalX = meshRef.current ? meshRef.current.position.x : position[0];
    const estanteDestino = detectarEstantePorX(finalX);

    // Restaurar posición local al soltar mientras React actualiza el estado
    if (meshRef.current) {
      meshRef.current.position.set(position[0], position[1], position[2]);
    }
    onDragEnd(pkg, estanteDestino);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (!dragging) gl.domElement.style.cursor = 'grab';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        if (!dragging) gl.domElement.style.cursor = 'auto';
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <RoundedBox args={[0.72, 0.52, 0.72]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color={dragging ? '#38bdf8' : hovered ? '#eab308' : '#d99b52'}
          roughness={0.6}
        />
      </RoundedBox>
      <mesh position={[0, 0.265, 0]}>
        <boxGeometry args={[0.73, 0.01, 0.14]} />
        <meshStandardMaterial color="#f5e6c8" />
      </mesh>
      <Text
        position={[0, 0, 0.37]}
        fontSize={0.092}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
      >
        {pkg.codigo_rastreo || 'PKG'}
      </Text>
    </group>
  );
}

function Estante({
  position,
  nombre,
  paquetesPendientes,
  resaltado,
  onDragStart,
  onDragMove,
  onDragEnd,
}) {
  const nivelesY = [0.58, 1.53, 2.48];
  const columnasX = [-0.55, 0.55];

  return (
    <group position={position}>
      {/* Postes metálicos */}
      {[
        [-1.15, 1.45, -0.45],
        [1.15, 1.45, -0.45],
        [-1.15, 1.45, 0.45],
        [1.15, 1.45, 0.45],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <boxGeometry args={[0.07, 2.9, 0.07]} />
          <meshStandardMaterial
            color={resaltado ? '#38bdf8' : '#334155'}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* Repisas */}
      {[0.3, 1.25, 2.2, 2.85].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.38, 0.06, 0.98]} />
          <meshStandardMaterial
            color={resaltado ? '#0284c7' : '#475569'}
            metalness={0.4}
            roughness={0.45}
          />
        </mesh>
      ))}

      {/* Letrero superior */}
      <group position={[0, 3.25, 0]}>
        <RoundedBox args={[2.15, 0.44, 0.08]} radius={0.05}>
          <meshStandardMaterial
            color={
              resaltado
                ? '#0ea5e9'
                : paquetesPendientes.length >= 6
                ? '#d97706'
                : paquetesPendientes.length > 0
                ? '#0284c7'
                : '#1e293b'
            }
          />
        </RoundedBox>
        <Text
          position={[0, 0.07, 0.05]}
          fontSize={0.14}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`ESTANTE ${nombre}`}
        </Text>
        <Text
          position={[0, -0.1, 0.05]}
          fontSize={0.092}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          {paquetesPendientes.length === 0
            ? 'Vacío (0/6 sin recoger)'
            : `${paquetesPendientes.length}/6 sin recoger`}
        </Text>
      </group>

      {/* Cajas arrastrables */}
      {paquetesPendientes.slice(0, 6).map((pkg, idx) => {
        const nivel = Math.floor(idx / 2);
        const col = idx % 2;
        return (
          <CajaArrastrable
            key={pkg.id_paquete || idx}
            pkg={pkg}
            index={idx}
            position={[columnasX[col], nivelesY[nivel], 0]}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        );
      })}
    </group>
  );
}

export default function Almacen3D({ paquetes = [], onEntrarPanel, onMoverPaquete }) {
  const [arrastrando, setArrastrando] = useState(false);
  const [estanteHover, setEstanteHover] = useState(null);
  const [avisoMovimiento, setAvisoMovimiento] = useState('');

  const pendientes = paquetes.filter(
    (p) => (p.estado || '').toUpperCase() !== 'ENTREGADO'
  );

  const manejarSoltar = async (pkg, estanteDestino) => {
    setArrastrando(false);
    setEstanteHover(null);

    const origen = (pkg.ubicacion_estante || 'E-01').toUpperCase();
    if (!estanteDestino || estanteDestino === origen) return;

    const ocupadosDestino = pendientes.filter(
      (p) => (p.ubicacion_estante || 'E-01').toUpperCase() === estanteDestino
    ).length;

    if (ocupadosDestino >= 6) {
      setAvisoMovimiento(`⚠️ El estante ${estanteDestino} ya está lleno (6/6).`);
      setTimeout(() => setAvisoMovimiento(''), 4000);
      return;
    }

    setAvisoMovimiento(`Moviendo ${pkg.codigo_rastreo} de ${origen} a ${estanteDestino}...`);
    if (onMoverPaquete) {
      const ok = await onMoverPaquete(pkg.id_paquete, estanteDestino);
      setAvisoMovimiento(
        ok
          ? `✅ ${pkg.codigo_rastreo} reubicado en ${estanteDestino} y guardado en base de datos.`
          : `⚠️ Error al guardar el cambio de estante en el servidor.`
      );
      setTimeout(() => setAvisoMovimiento(''), 4000);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090d16', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute top-5 left-5 right-5 z-10 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-800 px-5 py-3.5 rounded-2xl pointer-events-auto">
          <h1 className="text-lg font-bold text-white">Almacén PUDO — Vista 3D Interactiva</h1>
          <p className="text-xs text-slate-400">
            {pendientes.length === 0
              ? 'Estantes vacíos (0 paquetes pendientes).'
              : `Arrastra cualquier caja con el mouse hacia otro estante para reubicarla • Total: ${pendientes.length} sin recoger`}
          </p>
        </div>

        <button
          onClick={onEntrarPanel}
          className="pointer-events-auto bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-3 rounded-xl shadow-lg transition cursor-pointer"
        >
          Abrir Panel de Custodia →
        </button>
      </div>

      {avisoMovimiento && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-sky-500/50 text-sky-200 px-5 py-2.5 rounded-xl text-sm font-medium shadow-xl">
          {avisoMovimiento}
        </div>
      )}

      <Canvas shadows camera={{ position: [0, 3.2, 8.2], fov: 45 }}>
        <color attach="background" args={['#090d16']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 10, 6]} intensity={1.4} castShadow />
        <pointLight position={[-6, 6, -4]} intensity={0.6} color="#38bdf8" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
        <gridHelper args={[18, 18, '#1e293b', '#1e293b']} position={[0, 0.002, 0]} />

        {ESTANTES_CONFIG.map((est) => {
          const delEstante = pendientes.filter(
            (p) => (p.ubicacion_estante || 'E-01').toUpperCase() === est.nombre
          );
          return (
            <Estante
              key={est.nombre}
              position={est.pos}
              nombre={est.nombre}
              paquetesPendientes={delEstante}
              resaltado={arrastrando && estanteHover === est.nombre}
              onDragStart={() => setArrastrando(true)}
              onDragMove={(estDestino) => setEstanteHover(estDestino)}
              onDragEnd={manejarSoltar}
            />
          );
        })}

        <OrbitControls
          enabled={!arrastrando}
          enablePan={false}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={4}
          maxDistance={13}
        />
      </Canvas>
    </div>
  );
}