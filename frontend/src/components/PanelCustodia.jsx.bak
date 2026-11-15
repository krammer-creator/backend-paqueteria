import React, { useState, useEffect } from 'react';
import { obtenerPaquetes, crearPaquete, entregarPaquete } from '../services/api';
import CajaInteractiva3D from './CajaInteractiva3D';
import { PackageCheck, PlusCircle, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PanelCustodia({ onVolverAlmacen }) {
  const [paquetes, setPaquetes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');
  const [paqueteActivo, setPaqueteActivo] = useState(null);

  const [formulario, setFormulario] = useState({
    codigo_rastreo: '',
    token_retiro: '',
    id_vendedor: 1,
    destinatario_nombre: '',
    destinatario_telefono: '',
    destinatario_ci: '',
    costo_custodia: 5.0,
    monto_producto: 0.0,
    quien_paga_custodia: 'COMPRADOR',
    ubicacion_estante: 'E-01',
    fecha_limite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const cargarDatos = async () => {
    setCargando(true);
    setErrorApi('');
    try {
      const data = await obtenerPaquetes();
      const lista = Array.isArray(data) ? data : [];
      setPaquetes(lista);
      if (lista.length > 0 && !paqueteActivo) {
        setPaqueteActivo(lista[0]);
      }
    } catch (err) {
      setErrorApi('No se pudo conectar con la API de Render (puede estar despertando el servidor gratuito).');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: ['id_vendedor', 'costo_custodia', 'monto_producto'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formulario,
        fecha_limite: new Date(formulario.fecha_limite).toISOString(),
      };
      const nuevo = await crearPaquete(payload);
      setPaquetes((prev) => [nuevo, ...prev]);
      setPaqueteActivo(nuevo);
      setFormulario((prev) => ({
        ...prev,
        codigo_rastreo: '',
        token_retiro: '',
        destinatario_nombre: '',
        destinatario_telefono: '',
        destinatario_ci: '',
      }));
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al registrar el paquete. Verifica los datos y el id_vendedor.');
    }
  };

  const handleEntregar = async (idPaquete) => {
    setPaquetes((prev) =>
      prev.map((p) => (p.id_paquete === idPaquete ? { ...p, estado: 'ENTREGADO' } : p))
    );
    try {
      await entregarPaquete(idPaquete);
    } catch (err) {
      alert('No se pudo sincronizar la entrega con el servidor.');
      cargarDatos();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onVolverAlmacen}
              className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Vista Almacén 3D</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Custodia y Entregas PUDO</h1>
              <p className="text-xs text-slate-400">Conectado a FastAPI + Supabase</p>
            </div>
          </div>

          <button
            onClick={cargarDatos}
            className="flex items-center gap-2 text-sm bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 px-4 py-2 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
            <span>Actualizar Lista</span>
          </button>
        </div>

        {errorApi && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorApi}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleCrear}
            className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center gap-2 text-sky-400 font-semibold">
              <PlusCircle className="w-5 h-5" />
              <h2>Registrar Nuevo Paquete en Custodia</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Código Rastreo *</label>
                <input
                  required
                  name="codigo_rastreo"
                  value={formulario.codigo_rastreo}
                  onChange={handleChange}
                  placeholder="TRK-BO-4001"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Token Retiro *</label>
                <input
                  required
                  name="token_retiro"
                  value={formulario.token_retiro}
                  onChange={handleChange}
                  placeholder="8492"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">ID Vendedor *</label>
                <input
                  required
                  type="number"
                  name="id_vendedor"
                  value={formulario.id_vendedor}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nombre Destinatario *</label>
                <input
                  required
                  name="destinatario_nombre"
                  value={formulario.destinatario_nombre}
                  onChange={handleChange}
                  placeholder="Carlos Mamani"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Teléfono Destinatario *</label>
                <input
                  required
                  name="destinatario_telefono"
                  value={formulario.destinatario_telefono}
                  onChange={handleChange}
                  placeholder="78945612"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">CI Destinatario</label>
                <input
                  name="destinatario_ci"
                  value={formulario.destinatario_ci}
                  onChange={handleChange}
                  placeholder="4892301"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Custodia (Bs)</label>
                <input
                  type="number"
                  step="0.01"
                  name="costo_custodia"
                  value={formulario.costo_custodia}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Producto (Bs)</label>
                <input
                  type="number"
                  step="0.01"
                  name="monto_producto"
                  value={formulario.monto_producto}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Estante</label>
                <select
                  name="ubicacion_estante"
                  value={formulario.ubicacion_estante}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="E-01">E-01</option>
                  <option value="E-02">E-02</option>
                  <option value="E-03">E-03</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Paga Custodia</label>
                <select
                  name="quien_paga_custodia"
                  value={formulario.quien_paga_custodia}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="COMPRADOR">COMPRADOR</option>
                  <option value="VENDEDOR">VENDEDOR</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Fecha Límite Custodia</label>
                <input
                  type="datetime-local"
                  name="fecha_limite"
                  value={formulario.fecha_limite}
                  onChange={handleChange}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Guardar Paquete en Custodia
              </button>
            </div>
          </form>

          <CajaInteractiva3D paqueteSeleccionado={paqueteActivo} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-white">Inventario de Paquetes en Almacén</h2>
            <span className="text-xs text-slate-400">{paquetes.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Rastreo</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Destinatario</th>
                  <th className="px-4 py-3">Estante</th>
                  <th className="px-4 py-3">Custodia</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paquetes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                      {cargando ? 'Cargando paquetes desde Supabase...' : 'No hay paquetes registrados aún.'}
                    </td>
                  </tr>
                ) : (
                  paquetes.map((p) => (
                    <tr
                      key={p.id_paquete || p.codigo_rastreo}
                      onClick={() => setPaqueteActivo(p)}
                      className={`cursor-pointer transition hover:bg-slate-800/50 ${
                        paqueteActivo?.id_paquete === p.id_paquete ? 'bg-sky-500/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-medium text-sky-400">{p.codigo_rastreo}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">{p.token_retiro}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{p.destinatario_nombre}</div>
                        <div className="text-xs text-slate-400">{p.destinatario_telefono}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-800 px-2.5 py-1 rounded-md text-xs font-mono">
                          {p.ubicacion_estante}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">Bs {Number(p.costo_custodia).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            p.estado === 'ENTREGADO'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.estado === 'EN_CUSTODIA' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEntregar(p.id_paquete);
                            }}
                            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                          >
                            <PackageCheck className="w-4 h-4" />
                            <span>Entregar Paquete</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            Retirado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
