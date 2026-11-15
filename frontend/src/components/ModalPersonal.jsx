import React, { useState } from 'react';
import { crearPersonal, activarPersonal, eliminarPersonal } from '../services/api';

const PIN_DUENO_DEFAULT = '2026';

function generarCodigoEmpleado(nombre, ci, totalActual = 0) {
  const limpioNombre = String(nombre || '').trim().toUpperCase();
  const inicial = limpioNombre ? limpioNombre[0] : 'E';
  const digitosCi = String(ci || '').replace(/\D/g, '');
  const ultimos3 =
    digitosCi.length >= 3
      ? digitosCi.slice(-3)
      : String(totalActual + 1).padStart(3, '0');
  return `${inicial}${ultimos3}`;
}

export default function ModalPersonal({
  abierto,
  onCerrar,
  personal,
  setPersonal,
}) {
  const [pinIngresado, setPinIngresado] = useState('');
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [errorPin, setErrorPin] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [nuevo, setNuevo] = useState({
    nombre: '',
    ci: '',
    telefono: '',
    turno: 'Mañana (08:00 - 14:00)',
  });

  if (!abierto) return null;

  const pinGuardado = localStorage.getItem('pudo_pin_dueno') || PIN_DUENO_DEFAULT;
  const vistaPreviaCodigo =
    nuevo.nombre.trim() || nuevo.ci.trim()
      ? generarCodigoEmpleado(nuevo.nombre, nuevo.ci, personal.length)
      : '---';

  const verificarPin = (e) => {
    e.preventDefault();
    if (pinIngresado.trim() === pinGuardado) {
      setDesbloqueado(true);
      setErrorPin('');
      setPinIngresado('');
    } else {
      setErrorPin('PIN incorrecto. Por defecto es 2026.');
    }
  };

  const agregarEmpleado = async (e) => {
    e.preventDefault();
    if (!nuevo.nombre.trim() || !nuevo.ci.trim()) return;

    const codigoGenerado = generarCodigoEmpleado(nuevo.nombre, nuevo.ci, personal.length);

    setGuardando(true);
    setErrorPin('');
    try {
      const creado = await crearPersonal({
        codigo: codigoGenerado,
        nombre: nuevo.nombre.trim(),
        telefono: nuevo.telefono.trim(),
        turno: nuevo.turno,
        activo: personal.length === 0,
      });

      const actualizada = personal.length === 0
        ? [creado]
        : [...personal, creado];
      setPersonal(actualizada);
      setNuevo({ nombre: '', ci: '', telefono: '', turno: 'Mañana (08:00 - 14:00)' });
    } catch {
      setErrorPin(`No se pudo guardar (el código ${codigoGenerado} ya existe o hubo un error de red).`);
    } finally {
      setGuardando(false);
    }
  };

  const seleccionarTurno = async (id) => {
    setGuardando(true);
    try {
      const listaActualizada = await activarPersonal(id || 0);
      setPersonal(listaActualizada);
    } catch {
      setErrorPin('Error al cambiar el turno en Supabase.');
    } finally {
      setGuardando(false);
    }
  };

  const quitarEmpleado = async (id) => {
    setGuardando(true);
    try {
      await eliminarPersonal(id);
      setPersonal(personal.filter((p) => p.id !== id));
    } catch {
      setErrorPin('Error al eliminar el empleado.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">🔐 Gestión de Personal y Turnos</h3>
            <p className="text-xs text-slate-400">Sincronizado en Supabase para todos los dispositivos</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDesbloqueado(false);
              onCerrar();
            }}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!desbloqueado ? (
          <form onSubmit={verificarPin} className="space-y-4">
            <p className="text-sm text-slate-300">
              Ingresa el <strong>PIN de Dueño</strong> para registrar empleados o cambiar el encargado activo en el mostrador.
            </p>
            <input
              type="password"
              maxLength={8}
              value={pinIngresado}
              onChange={(e) => setPinIngresado(e.target.value)}
              placeholder="PIN (por defecto: 2026)"
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-sky-500"
            />
            {errorPin && <p className="text-xs text-rose-400 text-center">{errorPin}</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition cursor-pointer"
            >
              Desbloquear Panel de Personal
            </button>
          </form>
        ) : (
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {errorPin && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200">
                ⚠️ {errorPin}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">
                  Encargado en Turno Activo
                </span>
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => seleccionarTurno(0)}
                  className="text-xs text-amber-300 hover:underline cursor-pointer"
                >
                  Dejar sin encargado (Modo Dueño)
                </button>
              </div>

              {personal.length === 0 ? (
                <p className="text-xs text-slate-500 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  Aún no registraste empleados. Agrega uno abajo.
                </p>
              ) : (
                <div className="space-y-2">
                  {personal.map((emp) => {
                    const esActivo = Boolean(emp.activo);
                    return (
                      <div
                        key={emp.id}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          esActivo
                            ? 'bg-emerald-950/40 border-emerald-500/50'
                            : 'bg-slate-950/70 border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold text-white">
                            <span className="font-mono text-sky-400 mr-1.5">[{emp.codigo}]</span>
                            {emp.nombre}
                          </div>
                          <div className="text-xs text-slate-400">
                            {emp.turno} {emp.telefono ? `• Tel: ${emp.telefono}` : ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={guardando}
                            onClick={() => seleccionarTurno(emp.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                              esActivo
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            {esActivo ? '✓ En Turno' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            disabled={guardando}
                            onClick={() => quitarEmpleado(emp.id)}
                            className="px-2 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 text-xs cursor-pointer"
                            title="Eliminar empleado"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <form onSubmit={agregarEmpleado} className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">
                  + Registrar Nuevo Empleado
                </span>
                <span className="text-xs text-slate-400">
                  Código autogenerado:{' '}
                  <strong className="font-mono text-sky-400">{vistaPreviaCodigo}</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Nombre completo *"
                  value={nuevo.nombre}
                  onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                  className="col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="CI (ej. 6543210) *"
                  value={nuevo.ci}
                  onChange={(e) => setNuevo({ ...nuevo, ci: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="tel"
                  placeholder="Teléfono / WhatsApp"
                  value={nuevo.telefono}
                  onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <select
                  value={nuevo.turno}
                  onChange={(e) => setNuevo({ ...nuevo, turno: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Mañana (08:00 - 14:00)">Mañana (08:00 - 14:00)</option>
                  <option value="Tarde (14:00 - 20:00)">Tarde (14:00 - 20:00)</option>
                  <option value="Turno Completo">Turno Completo</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                {guardando ? 'Guardando en Supabase...' : '+ Guardar Empleado en Supabase'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}