import React from 'react';

function formatearFechaHora(valor) {
  if (!valor) return null;
  try {
    const fecha = new Date(valor);
    if (isNaN(fecha.getTime())) return String(valor);
    return fecha.toLocaleString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return String(valor);
  }
}

export default function ModalDetallePaquete({ paquete, bitacora, onCerrar, onVerTicket }) {
  if (!paquete) return null;

  const entregado = (paquete.estado || '').toUpperCase() === 'ENTREGADO';
  const reg = bitacora || {};

  const fechaIngreso =
    formatearFechaHora(reg.fechaRecepcion) ||
    formatearFechaHora(paquete.fecha_recepcion) ||
    formatearFechaHora(paquete.created_at) ||
    'No registrada';

  const fechaSalida = entregado
    ? formatearFechaHora(reg.fechaEntrega) ||
      formatearFechaHora(paquete.fecha_entrega) ||
      formatearFechaHora(paquete.updated_at) ||
      'Entregado (sin marca de hora local)'
    : 'Pendiente de recojo';

  const fechaLimite = formatearFechaHora(paquete.fecha_limite) || 'No definida';

  const costoCustodia = parseFloat(paquete.costo_custodia) || 0;
  const montoProducto = parseFloat(paquete.monto_producto) || 0;
  const pagaComprador = (paquete.quien_paga_custodia || 'COMPRADOR') === 'COMPRADOR';
  const totalCobrar = montoProducto + (pagaComprador ? costoCustodia : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 font-mono font-bold text-sky-300 text-base">
              {paquete.codigo_rastreo}
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Ficha Completa y Trazabilidad</h2>
              <p className="text-xs text-slate-400">
                Token de retiro: <strong className="font-mono text-amber-300">{paquete.token_retiro}</strong> • Estante:{' '}
                <strong className="font-mono text-slate-200">{paquete.ubicacion_estante}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="text-slate-400 hover:text-white text-xl font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto text-sm">
          {/* Estado actual */}
          <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 px-4 py-3 rounded-xl">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Estado Actual del Paquete
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                entregado
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
              }`}
            >
              {entregado ? '✓ ENTREGADO / RETIRADO' : '⏳ EN CUSTODIA'}
            </span>
          </div>

          {/* Remitente (quién lo dejó) y Destinatario (quién lo recoge) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Origen / Quién lo dejó
              </div>
              <p className="text-slate-200 font-semibold">
                {reg.remitenteNombre || `Vendedor / Remitente ID #${paquete.id_vendedor || 1}`}
              </p>
              <p className="text-xs text-slate-400">
                ID Vendedor en sistema: <span className="font-mono text-slate-300">{paquete.id_vendedor || 1}</span>
              </p>
              <p className="text-xs text-slate-400">
                Vencimiento custodia: <span className="text-slate-300">{fechaLimite}</span>
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Destinatario / Quién recoge
              </div>
              <p className="text-white font-semibold">{paquete.destinatario_nombre}</p>
              <p className="text-xs text-slate-400">
                CI / Documento: <span className="text-slate-200 font-mono">{paquete.destinatario_ci}</span>
              </p>
              <p className="text-xs text-slate-400">
                Teléfono / WhatsApp: <span className="text-slate-200 font-mono">{paquete.destinatario_telefono}</span>
              </p>
            </div>
          </div>

          {/* Línea de tiempo de horarios y empleados */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Historial de Horarios y Personal Responsable
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-2 border-sky-500 pl-3 space-y-1">
                <div className="text-xs font-semibold text-sky-300">1. Recepción en Almacén</div>
                <div className="text-xs text-slate-300">
                  Fecha y hora: <strong>{fechaIngreso}</strong>
                </div>
                <div className="text-xs text-slate-400">
                  Recibido por empleado: <strong className="font-mono text-sky-300">{reg.recibidoPor || '---'}</strong>
                </div>
              </div>

              <div className={`border-l-2 ${entregado ? 'border-emerald-500' : 'border-slate-700'} pl-3 space-y-1`}>
                <div className={`text-xs font-semibold ${entregado ? 'text-emerald-300' : 'text-slate-400'}`}>
                  2. Retiro / Entrega al Cliente
                </div>
                <div className="text-xs text-slate-300">
                  Fecha y hora: <strong>{fechaSalida}</strong>
                </div>
                <div className="text-xs text-slate-400">
                  Entregado por empleado:{' '}
                  <strong className={`font-mono ${entregado ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {reg.entregadoPor || (entregado ? '---' : 'Pendiente')}
                  </strong>
                </div>
              </div>
            </div>
          </div>

                    {/* Fotografía original del paquete si fue subida */}
          {reg.fotoPaquete && (
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Evidencia Fotográfica de Recepción
              </div>
              <img
                src={reg.fotoPaquete}
                alt={`Foto ${paquete.codigo_rastreo}`}
                className="w-full max-h-64 object-contain rounded-lg bg-slate-900 border border-slate-800"
              />
            </div>
          )}

          {/* Detalle económico */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Detalle Económico
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Tarifa Custodia</span>
                <strong className="text-slate-200 text-sm">{costoCustodia.toFixed(2)} Bs</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Valor Producto</span>
                <strong className="text-slate-200 text-sm">{montoProducto.toFixed(2)} Bs</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Paga Custodia</span>
                <strong className="text-slate-200 text-sm">{paquete.quien_paga_custodia || 'COMPRADOR'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Total a Cobrar</span>
                <strong className="text-emerald-400 text-sm">{totalCobrar.toFixed(2)} Bs</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="px-6 py-3.5 bg-slate-800/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {onVerTicket ? (
            <button
              type="button"
              onClick={() => {
                onCerrar();
                onVerTicket(paquete);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer"
            >
              🎫 Generar Ficha Imagen para Comprador
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={onCerrar}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}