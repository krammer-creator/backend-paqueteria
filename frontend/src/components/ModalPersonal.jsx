import React, { useState } from 'react';

const PIN_DUENO = import.meta.env.VITE_OWNER_PIN || '2026';

function generarCodigoOperador(nombre, ci) {
  const inicial = (nombre.trim().charAt(0) || 'X').toUpperCase();
  const soloDigitos = ci.replace(/\D/g, '');
  const ultimosTres = soloDigitos.slice(-3).padStart(3, '0');
  return `${inicial}${ultimosTres}`;
}

export default function ModalPersonal({
  abierto,
  onCerrar,
  personal,
  setPersonal,
  activoId,
  setActivoId,
}) {
  const [pinIngresado, setPinIngresado] = useState('');
  const [autorizado, setAutorizado] = useState(false);
  const [errorPin, setErrorPin] = useState('');

  const [nombre, setNombre] = useState('');
  const [ci, setCi] = useState('');
  const [turno, setTurno] = useState('Mañana (08:00 - 14:00)');
  const [telefono, setTelefono] = useState('');

  if (!abierto) return null;

  const codigoVistaPrevia =
    nombre.trim() && ci.replace(/\D/g, '').length >= 3
      ? generarCodigoOperador(nombre, ci)
      : '---';

  const verificarPin = (e) => {
    e.preventDefault();
    if (pinIngresado.trim() === PIN_DUENO) {
      setAutorizado(true);
      setErrorPin('');
      setPinIngresado('');
    } else {
      setErrorPin('PIN incorrecto. Acceso exclusivo para el dueño.');
    }
  };

  const registrarOperador = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !ci.trim()) return;

    const codigoAsignado = generarCodigoOperador(nombre, ci);

    const nuevo = {
      id: Date.now().toString(),
      codigo: codigoAsignado,
      nombre: nombre.trim(),
      ci: ci.trim(),
      turno,
      telefono: telefono.trim() || 'Sin teléfono',
    };

    const listaActualizada = [...personal, nuevo];
    setPersonal(listaActualizada);
    localStorage.setItem('pudo_personal', JSON.stringify(listaActualizada));

    if (!activoId) {
      setActivoId(nuevo.id);
      localStorage.setItem('pudo_operador_activo', nuevo.id);
    }

    setNombre('');
    setCi('');
    setTelefono('');
  };

  const seleccionarActivo = (id) => {
    setActivoId(id);
    localStorage.setItem('pudo_operador_activo', id);
  };

  const eliminarOperador = (id) => {
    const filtrados = personal.filter((p) => p.id !== id);
    setPersonal(filtrados);
    localStorage.setItem('pudo_personal', JSON.stringify(filtrados));
    if (activoId === id) {
      const siguiente = filtrados[0]?.id || '';
      setActivoId(siguiente);
      localStorage.setItem('pudo_operador_activo', siguiente);
    }
  };

  const cerrarYBlocar = () => {
    setAutorizado(false);
    setPinIngresado('');
    setErrorPin('');
    onCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white">
              {autorizado ? 'Gestión de Personal y Código de Turno' : 'Acceso Restringido — Dueño'}
            </h2>
            <p className="text-xs text-slate-400">
              {autorizado
                ? 'El ID se genera automáticamente: Inicial del nombre + 3 últimos dígitos del CI.'
                : 'Ingresa el PIN de seguridad del propietario para administrar personal.'}
            </p>
          </div>
          <button
            onClick={cerrarYBlocar}
            className="text-slate-400 hover:text-white text-xl font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!autorizado ? (
          <form onSubmit={verificarPin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                PIN de Seguridad del Dueño
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinIngresado}
                onChange={(e) => setPinIngresado(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full text-center text-2xl tracking-[0.5em] bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500"
              />
              {errorPin && <p className="text-xs text-rose-400 mt-2">{errorPin}</p>}
              <p className="text-[11px] text-slate-500 mt-2">
                PIN predeterminado: <span className="text-slate-300 font-mono">2026</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={cerrarYBlocar}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm cursor-pointer"
              >
                Desbloquear
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={registrarOperador} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                  + Registrar encargado de atención
                </span>
                <span className="text-xs bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">
                  ID asignado: <strong className="font-mono text-amber-300">{codigoVistaPrevia}</strong>
                </span>
              </div>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo (ej. Carlos Mamani)"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                required
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                placeholder="CI / Carnet (ej. 8452190 LP)"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option>Mañana (08:00 - 14:00)</option>
                <option>Tarde (14:00 - 20:00)</option>
                <option>Tiempo Completo</option>
              </select>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Celular (ej. 76543210)"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="sm:col-span-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2 rounded-lg text-sm transition cursor-pointer"
              >
                Guardar y Generar ID
              </button>
            </form>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Personal Registrado ({personal.length}) — Habilitar turno (bloquea el ID)
              </div>

              {personal.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center border border-dashed border-slate-800 rounded-xl">
                  Aún no hay personal registrado. Agrega el primero arriba.
                </p>
              ) : (
                personal.map((op) => {
                  const esActivo = op.id === activoId;
                  const cod = op.codigo || generarCodigoOperador(op.nombre, op.ci);
                  return (
                    <div
                      key={op.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition ${
                        esActivo
                          ? 'bg-emerald-950/30 border-emerald-500/60'
                          : 'bg-slate-950/40 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            ID: {cod}
                          </span>
                          <span className="font-semibold text-sm text-white">{op.nombre}</span>
                          {esActivo && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Turno Habilitado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          CI: {op.ci} • {op.turno} • Tel: {op.telefono}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!esActivo && (
                          <button
                            type="button"
                            onClick={() => seleccionarActivo(op.id)}
                            className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold cursor-pointer"
                          >
                            Habilitar turno
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => eliminarOperador(op.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}