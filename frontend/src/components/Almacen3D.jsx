import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { obtenerPersonal, actualizarPaquete } from '../services/api';

const ESTANTES_CONFIG = [
  { nombre: 'E-01', pos: [2.7, 0, -0.55], rot: [0, 0, 0] },
  { nombre: 'E-02', pos: [-0.2, 0, -0.55], rot: [0, 0, 0] },
  { nombre: 'E-03', pos: [-3.1, 0, -0.55], rot: [0, 0, 0] },
  { nombre: 'E-04', pos: [-4.65, 0, 1.35], rot: [0, Math.PI / 2, 0] },
];

const NIVELES_Y = [0.5, 1.3, 2.1, 2.9];
const COLUMNAS_X = [-0.74, 0, 0.74];
const NOMBRES_COLUMNA = ['Izquierda', 'Centro', 'Derecha'];

function detectarRanuraCercana(worldPos) {
  let mejor = null;
  let menorDist = Infinity;

  for (const est of ESTANTES_CONFIG) {
    const rotY = est.rot[1] || 0;
    const cos = Math.cos(rotY);
    const sin = Math.sin(rotY);

    for (let nivel = 0; nivel < 4; nivel++) {
      for (let col = 0; col < 3; col++) {
        const lx = COLUMNAS_X[col];
        const ly = NIVELES_Y[nivel];
        const lz = 0;

        const wx = est.pos[0] + lx * cos + lz * sin;
        const wy = est.pos[1] + ly;
        const wz = est.pos[2] - lx * sin + lz * cos;

        const dx = worldPos.x - wx;
        const dy = worldPos.y - wy;
        const dz = worldPos.z - wz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < menorDist) {
          menorDist = dist;
          mejor = {
            estante: est.nombre,
            nivel,
            col,
            slot: nivel * 3 + col,
            etiqueta: `${est.nombre} • Nivel ${nivel + 1} (${NOMBRES_COLUMNA[col]})`,
          };
        }
      }
    }
  }

  return menorDist <= 1.35 ? mejor : null;
}

function CajaArrastrable({
  pkg,
  slotActual,
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
  const destinoActualRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current && !dragging) {
      meshRef.current.position.x = position[0];
      meshRef.current.position.z = position[2];
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.018;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
    gl.domElement.style.cursor = 'grabbing';
    e.target.setPointerCapture(e.pointerId);

    const worldPos = new THREE.Vector3();
    if (meshRef.current) {
      meshRef.current.getWorldPosition(worldPos);
    }
    const normalCamara = new THREE.Vector3();
    camera.getWorldDirection(normalCamara);
    planoArrastre.current.setFromNormalAndCoplanarPoint(normalCamara, worldPos);

    onDragStart(pkg, slotActual);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    e.stopPropagation();
    if (e.ray.intersectPlane(planoArrastre.current, puntoInterseccion.current)) {
      const clampedX = Math.max(-5.1, Math.min(4.1, puntoInterseccion.current.x));
      const clampedY = Math.max(0.35, Math.min(3.35, puntoInterseccion.current.y));
      const clampedZ = Math.max(-0.95, Math.min(2.45, puntoInterseccion.current.z));

      const mundo = new THREE.Vector3(clampedX, clampedY, clampedZ);
      if (meshRef.current && meshRef.current.parent) {
        const localPos = meshRef.current.parent.worldToLocal(mundo.clone());
        meshRef.current.position.copy(localPos);
      }

      const ranura = detectarRanuraCercana(mundo);
      destinoActualRef.current = ranura;
      onDragMove(ranura);
    }
  };

  const handlePointerUp = (e) => {
    if (!dragging) return;
    e.stopPropagation();
    setDragging(false);
    gl.domElement.style.cursor = hovered ? 'grab' : 'auto';
    e.target.releasePointerCapture(e.pointerId);

    if (meshRef.current) {
      meshRef.current.position.set(position[0], position[1], position[2]);
    }

    const destino = destinoActualRef.current;
    destinoActualRef.current = null;
    onDragEnd(pkg, slotActual, destino);
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
      <RoundedBox args={[0.58, 0.42, 0.66]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color={dragging ? '#38bdf8' : hovered ? '#eab308' : '#d99b52'}
          roughness={0.6}
        />
      </RoundedBox>
      <mesh position={[0, 0.215, 0]}>
        <boxGeometry args={[0.59, 0.01, 0.12]} />
        <meshStandardMaterial color="#f5e6c8" />
      </mesh>
      <Text
        position={[0, 0, 0.34]}
        fontSize={0.076}
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
  rotation = [0, 0, 0],
  nombre,
  slotsAsignados,
  arrastrando,
  ranuraHover,
  onDragStart,
  onDragMove,
  onDragEnd,
}) {
  const cantidadOcupados = slotsAsignados.filter(Boolean).length;
  const estanteResaltado = arrastrando && ranuraHover?.estante === nombre;

  return (
    <group position={position} rotation={rotation}>
      {[
        [-1.15, 1.72, -0.45],
        [1.15, 1.72, -0.45],
        [-1.15, 1.72, 0.45],
        [1.15, 1.72, 0.45],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <boxGeometry args={[0.07, 3.44, 0.07]} />
          <meshStandardMaterial
            color={estanteResaltado ? '#38bdf8' : '#334155'}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
      ))}

      {[0.25, 1.05, 1.85, 2.65, 3.38].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.38, 0.055, 0.98]} />
          <meshStandardMaterial
            color={estanteResaltado ? '#0284c7' : '#475569'}
            metalness={0.4}
            roughness={0.45}
          />
        </mesh>
      ))}

      <group position={[0, 3.74, 0]}>
        <RoundedBox args={[2.15, 0.44, 0.08]} radius={0.05}>
          <meshStandardMaterial
            color={
              estanteResaltado
                ? '#0ea5e9'
                : cantidadOcupados >= 12
                ? '#d97706'
                : cantidadOcupados > 0
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
          fontSize={0.082}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          {cantidadOcupados === 0
            ? 'Vacío (0/12 sin recoger)'
            : `${cantidadOcupados}/12 sin recoger`}
        </Text>
      </group>

      {arrastrando &&
        Array.from({ length: 12 }).map((_, slotIdx) => {
          const nivel = Math.floor(slotIdx / 3);
          const col = slotIdx % 3;
          const esTarget =
            ranuraHover?.estante === nombre && ranuraHover?.slot === slotIdx;
          const ocupado = Boolean(slotsAsignados[slotIdx]);

          if (!esTarget && ocupado) return null;

          return (
            <mesh
              key={`ghost-${slotIdx}`}
              position={[COLUMNAS_X[col], NIVELES_Y[nivel], 0]}
            >
              <boxGeometry args={[0.56, 0.4, 0.64]} />
              <meshStandardMaterial
                color={
                  esTarget
                    ? ocupado
                      ? '#ef4444'
                      : '#10b981'
                    : '#38bdf8'
                }
                transparent
                opacity={esTarget ? 0.55 : 0.12}
              />
            </mesh>
          );
        })}

      {slotsAsignados.map((pkg, slotIdx) => {
        if (!pkg) return null;
        const nivel = Math.floor(slotIdx / 3);
        const col = slotIdx % 3;
        return (
          <CajaArrastrable
            key={pkg.id_paquete || `${nombre}-${slotIdx}`}
            pkg={pkg}
            slotActual={slotIdx}
            index={slotIdx}
            position={[COLUMNAS_X[col], NIVELES_Y[nivel], 0]}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        );
      })}
    </group>
  );
}

function MostradorAtencion({ position = [5.6, 0, -0.35], operador }) {
  const personaRef = useRef();

  useFrame((state) => {
    if (personaRef.current) {
      personaRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.025;
      personaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    }
  });

  const tieneOperador = Boolean(operador);
  const tituloOperador = tieneOperador
    ? `[${operador.codigo || 'EMP'}] ${operador.nombre}`
    : 'MODO DUEÑO (Sin turno)';
  const subtituloTurno = tieneOperador
    ? `${operador.turno} • Tel: ${operador.telefono || '---'}`
    : 'Asigna personal en Panel de Custodia';

  return (
    <group position={position}>
      <group ref={personaRef} position={[0, 0, -0.35]}>
        <RoundedBox args={[0.56, 0.72, 0.32]} radius={0.08} position={[0, 1.15, 0]} castShadow>
          <meshStandardMaterial
            color={tieneOperador ? '#0284c7' : '#475569'}
            roughness={0.5}
          />
        </RoundedBox>
        <mesh position={[0, 1.18, 0.165]}>
          <boxGeometry args={[0.52, 0.08, 0.01]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 1.72, 0]} castShadow>
          <sphereGeometry args={[0.21, 24, 24]} />
          <meshStandardMaterial color="#f1c29b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.86, 0.02]} castShadow>
          <cylinderGeometry args={[0.215, 0.22, 0.11, 20]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.82, 0.18]}>
          <boxGeometry args={[0.26, 0.025, 0.16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <RoundedBox args={[0.14, 0.48, 0.14]} radius={0.04} position={[-0.36, 1.12, 0.12]} rotation={[0.45, 0, 0]}>
          <meshStandardMaterial color={tieneOperador ? '#0369a1' : '#334155'} />
        </RoundedBox>
        <RoundedBox args={[0.14, 0.48, 0.14]} radius={0.04} position={[0.36, 1.12, 0.12]} rotation={[0.45, 0, 0]}>
          <meshStandardMaterial color={tieneOperador ? '#0369a1' : '#334155'} />
        </RoundedBox>
      </group>

      <RoundedBox args={[2.25, 1.02, 0.85]} radius={0.05} position={[0, 0.51, 0.22]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.6} />
      </RoundedBox>

      <RoundedBox args={[2.35, 0.07, 0.94]} radius={0.02} position={[0, 1.04, 0.22]} castShadow>
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
      </RoundedBox>

      <mesh position={[0, 0.84, 0.652]}>
        <boxGeometry args={[2.1, 0.045, 0.01]} />
        <meshStandardMaterial
          color={tieneOperador ? '#10b981' : '#f59e0b'}
          emissive={tieneOperador ? '#10b981' : '#f59e0b'}
          emissiveIntensity={0.8}
        />
      </mesh>

      <Text
        position={[0, 0.52, 0.655]}
        fontSize={0.13}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
      >
        VENTANILLA PUDO
      </Text>

      <group position={[0.45, 1.08, 0.18]} rotation={[0, -0.25, 0]}>
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.46, 0.025, 0.32]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 0.16, -0.14]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.46, 0.3, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.16, -0.128]} rotation={[-0.25, 0, 0]}>
          <planeGeometry args={[0.42, 0.26]} />
          <meshStandardMaterial color="#0284c7" emissive="#0ea5e9" emissiveIntensity={0.35} />
        </mesh>
      </group>

      <group position={[0, 2.58, -0.15]}>
        <RoundedBox args={[2.65, 0.68, 0.08]} radius={0.06}>
          <meshStandardMaterial
            color={tieneOperador ? '#064e3b' : '#1e293b'}
            roughness={0.4}
          />
        </RoundedBox>
        <mesh position={[0, 0.32, 0.045]}>
          <boxGeometry args={[2.55, 0.03, 0.01]} />
          <meshStandardMaterial
            color={tieneOperador ? '#34d399' : '#fbbf24'}
            emissive={tieneOperador ? '#10b981' : '#f59e0b'}
            emissiveIntensity={0.7}
          />
        </mesh>

        <Text
          position={[0, 0.19, 0.05]}
          fontSize={0.085}
          color={tieneOperador ? '#6ee7b7' : '#fcd34d'}
          anchorX="center"
          anchorY="middle"
        >
          ENCARGADO EN TURNO
        </Text>
        <Text
          position={[0, 0.01, 0.05]}
          fontSize={0.125}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.45}
        >
          {tituloOperador}
        </Text>
        <Text
          position={[0, -0.18, 0.05]}
          fontSize={0.082}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.45}
        >
          {subtituloTurno}
        </Text>
      </group>
    </group>
  );
}

function EstructuraLocalComercial() {
  const anchoLocal = 13.5;
  const fondoLocal = 4.8;
  const centroX = 1.25;
  const centroZ = 0.6;
  const altoMuro = 4.5;
  const colorParedSuave = '#cbd5e1';

  return (
    <group>
      <mesh position={[centroX, 0.01, centroZ]} receiveShadow>
        <boxGeometry args={[anchoLocal, 0.04, fondoLocal]} />
        <meshStandardMaterial color="#334155" roughness={0.75} metalness={0.1} />
      </mesh>

      <mesh position={[centroX, altoMuro / 2, -1.8]} receiveShadow castShadow>
        <boxGeometry args={[anchoLocal + 0.3, altoMuro, 0.18]} />
        <meshStandardMaterial color={colorParedSuave} roughness={0.85} />
      </mesh>

      <mesh position={[centroX, 3.92, -1.7]}>
        <boxGeometry args={[anchoLocal, 0.1, 0.02]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>

      <group position={[1.1, 4.18, -1.69]}>
        <Text fontSize={0.2} color="#1e293b" anchorX="center" anchorY="middle">
          PUNTO PUDO • ALMACÉN Y CUSTODIA DE PAQUETES
        </Text>
      </group>

      <mesh position={[-5.5, altoMuro / 2, centroZ]} receiveShadow castShadow>
        <boxGeometry args={[0.18, altoMuro, fondoLocal]} />
        <meshStandardMaterial color={colorParedSuave} roughness={0.85} />
      </mesh>

      <mesh position={[8.0, altoMuro / 2, -0.65]} receiveShadow castShadow>
        <boxGeometry args={[0.18, altoMuro, 2.3]} />
        <meshStandardMaterial color={colorParedSuave} roughness={0.85} />
      </mesh>

      <mesh position={[8.0, 3.35, 1.45]} receiveShadow castShadow>
        <boxGeometry args={[0.18, 1.5, 1.9]} />
        <meshStandardMaterial color={colorParedSuave} roughness={0.85} />
      </mesh>

      <mesh position={[8.0, altoMuro / 2, 2.7]} receiveShadow castShadow>
        <boxGeometry args={[0.18, altoMuro, 0.6]} />
        <meshStandardMaterial color={colorParedSuave} roughness={0.85} />
      </mesh>

      <group position={[8.0, 0, 1.45]}>
        <mesh position={[0, 1.3, -0.78]}>
          <boxGeometry args={[0.22, 2.6, 0.08]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.3, 0.78]}>
          <boxGeometry args={[0.22, 2.6, 0.08]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.58, 0]}>
          <boxGeometry args={[0.22, 0.08, 1.64]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>

        <group position={[0, 0, 0.72]} rotation={[0, 0.42, 0]}>
          <mesh position={[0, 1.28, -0.7]}>
            <boxGeometry args={[0.04, 2.48, 1.4]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              transparent
              opacity={0.28}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0, 0.06, -0.7]}>
            <boxGeometry args={[0.07, 0.12, 1.44]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
          <mesh position={[0, 2.5, -0.7]}>
            <boxGeometry args={[0.07, 0.12, 1.44]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.28, -1.4]}>
            <boxGeometry args={[0.07, 2.54, 0.08]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
          <mesh position={[-0.08, 1.15, -1.26]}>
            <boxGeometry args={[0.04, 0.36, 0.04]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        <group position={[-0.12, 2.86, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <RoundedBox args={[1.25, 0.3, 0.06]} radius={0.04}>
            <meshStandardMaterial color="#065f46" emissive="#059669" emissiveIntensity={0.45} />
          </RoundedBox>
          <Text position={[0, 0, 0.04]} fontSize={0.12} color="#ecfdf5" anchorX="center" anchorY="middle">
            ENTRADA • ABIERTO
          </Text>
        </group>
      </group>

      <mesh position={[centroX, 0.08, -1.7]}>
        <boxGeometry args={[anchoLocal, 0.14, 0.04]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[-5.4, 0.08, centroZ]}>
        <boxGeometry args={[0.04, 0.14, fondoLocal]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  );
}

export default function Almacen3D({ paquetes = [], onEntrarPanel, onMoverPaquete }) {
  const [arrastrando, setArrastrando] = useState(false);
  const [ranuraHover, setRanuraHover] = useState(null);
  const [avisoMovimiento, setAvisoMovimiento] = useState('');
  const [operadorActivo, setOperadorActivo] = useState(null);
  const [overridesLocales, setOverridesLocales] = useState({});

  useEffect(() => {
    obtenerPersonal()
      .then((lista) => {
        const activo = (lista || []).find((p) => p.activo) || null;
        setOperadorActivo(activo);
      })
      .catch(() => setOperadorActivo(null));
  }, [paquetes]);

  const pendientes = useMemo(
    () =>
      paquetes
        .filter((p) => (p.estado || '').toUpperCase() !== 'ENTREGADO')
        .map((p) => ({
          ...p,
          ...(overridesLocales[p.id_paquete] || {}),
        })),
    [paquetes, overridesLocales]
  );

  const slotsPorEstante = useMemo(() => {
    const resultado = {
      'E-01': Array(12).fill(null),
      'E-02': Array(12).fill(null),
      'E-03': Array(12).fill(null),
      'E-04': Array(12).fill(null),
    };

    const sinAsignar = [];

    pendientes.forEach((pkg) => {
      const est = (pkg.ubicacion_estante || 'E-01').toUpperCase();
      if (!resultado[est]) return;

      const s = pkg.slot_3d;
      if (typeof s === 'number' && s >= 0 && s < 12 && resultado[est][s] === null) {
        resultado[est][s] = pkg;
      } else {
        sinAsignar.push(pkg);
      }
    });

    sinAsignar.forEach((pkg) => {
      const est = (pkg.ubicacion_estante || 'E-01').toUpperCase();
      if (!resultado[est]) return;
      const libre = resultado[est].findIndex((item) => item === null);
      if (libre !== -1) {
        resultado[est][libre] = pkg;
      }
    });

    return resultado;
  }, [pendientes]);

  const manejarSoltar = async (pkg, slotOrigen, destino) => {
    setArrastrando(false);
    setRanuraHover(null);

    if (!destino) return;

    const origenEstante = (pkg.ubicacion_estante || 'E-01').toUpperCase();
    const { estante: destinoEstante, slot: destinoSlot, etiqueta } = destino;

    if (origenEstante === destinoEstante && slotOrigen === destinoSlot) return;

    const ocupante = slotsPorEstante[destinoEstante]?.[destinoSlot];
    if (ocupante && ocupante.id_paquete !== pkg.id_paquete) {
      setAvisoMovimiento(`⚠️ El espacio ${etiqueta} ya está ocupado por ${ocupante.codigo_rastreo}.`);
      setTimeout(() => setAvisoMovimiento(''), 4000);
      return;
    }

    setOverridesLocales((prev) => ({
      ...prev,
      [pkg.id_paquete]: { ubicacion_estante: destinoEstante, slot_3d: destinoSlot },
    }));

    setAvisoMovimiento(`Guardando ${pkg.codigo_rastreo} en ${etiqueta}...`);
    try {
      await actualizarPaquete(pkg.id_paquete, {
        ubicacion_estante: destinoEstante,
        slot_3d: destinoSlot,
      });
      if (onMoverPaquete && origenEstante !== destinoEstante) {
        await onMoverPaquete(pkg.id_paquete, destinoEstante);
      }
      setAvisoMovimiento(`✅ ${pkg.codigo_rastreo} guardado en ${etiqueta} (Supabase).`);
    } catch {
      setAvisoMovimiento(`⚠️ Error al sincronizar la posición en Supabase.`);
    }
    setTimeout(() => setAvisoMovimiento(''), 3500);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090d16', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute top-5 left-5 right-5 z-10 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-800 px-5 py-3.5 rounded-2xl pointer-events-auto">
          <h1 className="text-lg font-bold text-white">Almacén PUDO — Vista 3D Interactiva</h1>
          <p className="text-xs text-slate-400">
            {arrastrando && ranuraHover
              ? `Soltar en: ${ranuraHover.etiqueta}`
              : pendientes.length === 0
              ? 'Local abierto • Estantes E-01 a E-04 vacíos (0/48 paquetes).'
              : `Arrastra cualquier caja y elige el estante, nivel (1-4) y posición • Total: ${pendientes.length}/48`}
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

      <Canvas shadows camera={{ position: [1.2, 3.6, 10.6], fov: 46 }}>
        <color attach="background" args={['#090d16']} />
        <ambientLight intensity={0.95} />
        <directionalLight position={[5, 11, 8]} intensity={1.45} castShadow />
        <pointLight position={[-4, 5, 2]} intensity={0.65} color="#38bdf8" />
        <pointLight position={[6, 4, 2]} intensity={0.75} color="#10b981" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0, 0]} receiveShadow>
          <planeGeometry args={[28, 20]} />
          <meshStandardMaterial color="#0b1120" roughness={0.9} />
        </mesh>
        <gridHelper args={[28, 28, '#172033', '#172033']} position={[1, 0.002, 0]} />

        <EstructuraLocalComercial />

        {ESTANTES_CONFIG.map((est) => (
          <Estante
            key={est.nombre}
            position={est.pos}
            rotation={est.rot}
            nombre={est.nombre}
            slotsAsignados={slotsPorEstante[est.nombre] || Array(12).fill(null)}
            arrastrando={arrastrando}
            ranuraHover={ranuraHover}
            onDragStart={() => setArrastrando(true)}
            onDragMove={(ranura) => setRanuraHover(ranura)}
            onDragEnd={manejarSoltar}
          />
        ))}

        <MostradorAtencion position={[5.6, 0, -0.35]} operador={operadorActivo} />

        <OrbitControls
          target={[1.2, 1.4, -0.2]}
          enabled={!arrastrando}
          enablePan={false}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 - 0.06}
          minDistance={4.5}
          maxDistance={16}
        />
      </Canvas>
    </div>
  );
}