import React, { useRef } from 'react';

function formatearFechaCorta(valor) {
  const fecha = valor ? new Date(valor) : new Date();
  if (isNaN(fecha.getTime())) return new Date().toLocaleString('es-BO');
  return fecha.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function construirUrlWhatsApp(telefono8Digitos, paquete, fechaIngreso) {
  const soloDigitos = String(telefono8Digitos || '').replace(/\D/g, '');
  const numeroBolivia = soloDigitos.startsWith('591')
    ? soloDigitos
    : `591${soloDigitos}`;

  const costoCustodia = parseFloat(paquete.costo_custodia) || 0;
  const montoProducto = parseFloat(paquete.monto_producto) || 0;
  const pagaComprador = (paquete.quien_paga_custodia || 'COMPRADOR') === 'COMPRADOR';
  const totalPagar = montoProducto + (pagaComprador ? costoCustodia : 0);

  const mensaje = [
    `📦 *COMPROBANTE DE RECOJO — PUNTO PUDO*`,
    `• *Código Rastreo:* ${paquete.codigo_rastreo}`,
    `• *Token de Retiro:* ${paquete.token_retiro}`,
    `• *Destinatario:* ${paquete.destinatario_nombre} (CI: ${paquete.destinatario_ci})`,
    `• *Hora de ingreso:* ${fechaIngreso}`,
    `• *Monto a cancelar al recoger:* ${
      totalPagar > 0 ? `${totalPagar.toFixed(2)} Bs` : '0.00 Bs (Pagado)'
    }`,
    `_Reenvía este mensaje a tu comprador. Debe presentar el código, el token y su CI en ventanilla._`,
  ].join('\n');

  return `https://wa.me/${numeroBolivia}?text=${encodeURIComponent(mensaje)}`;
}

export default function ModalTicketImagen({ paquete, bitacora, onCerrar }) {
  const tarjetaRef = useRef(null);

  if (!paquete) return null;

  const reg = bitacora || {};
  const fechaIngreso = formatearFechaCorta(
    reg.fechaRecepcion || paquete.fecha_recepcion || paquete.created_at
  );
  const fechaLimite = paquete.fecha_limite
    ? formatearFechaCorta(paquete.fecha_limite)
    : '7 días calendario';

  const costoCustodia = parseFloat(paquete.costo_custodia) || 0;
  const montoProducto = parseFloat(paquete.monto_producto) || 0;
  const pagaComprador = (paquete.quien_paga_custodia || 'COMPRADOR') === 'COMPRADOR';
  const totalPagarAlRecoger = montoProducto + (pagaComprador ? costoCustodia : 0);

  const telefonoRemitente = reg.remitenteTelefono || '';

  // Impresión compacta tipo voucher (80mm x 105mm) en blanco/negro para ahorrar tinta y papel
  const imprimirTicketVoucher = () => {
    const ventana = window.open('', '_blank', 'width=420,height=620');
    if (!ventana) {
      alert('Permite las ventanas emergentes para abrir la vista de impresión.');
      return;
    }

    const montoTexto =
      totalPagarAlRecoger > 0
        ? `${totalPagarAlRecoger.toFixed(2)} Bs (Cobrar al recoger)`
        : '0.00 Bs (PAGADO)';

    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Ticket ${paquete.codigo_rastreo}</title>
          <style>
            @page {
              size: 108mm 139mm;
              margin: 5mm;
            }
            * {
              box-sizing: border-box;
              font-family: 'Courier New', Courier, monospace;
              color: #000;
            }
            body {
              margin: 0;
              padding: 4px;
              width: 98mm;
              background: #fff;
            }
            .voucher {
              border: 1.5px dashed #000;
              padding: 8px;
            }
            .center { text-align: center; }
            .titulo { font-size: 15px; font-weight: bold; margin: 0; }
            .sub { font-size: 11.5px; margin: 2px 0 6px; }
            .linea { border-top: 1px dashed #000; margin: 6px 0; }
            .caja-codigos {
              border: 1.5px solid #000;
              padding: 6px 4px;
              margin: 6px 0;
              text-align: center;
            }
            .lbl { font-size: 9px; font-weight: bold; display: block; }
            .codigo { font-size: 24px; font-weight: bold; letter-spacing: 0.5px; }
            .token { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
            .fila {
              display: flex;
              justify-content: space-between;
              font-size: 11.5px;
              margin: 3px 0;
              gap: 6px;
            }
            .fila span:last-child { font-weight: bold; text-align: right; }
            .pago {
              border: 1px solid #000;
              padding: 5px;
              text-align: center;
              font-size: 11px;
              font-weight: bold;
              margin-top: 6px;
            }
            .pie {
              font-size: 9px;
              text-align: center;
              margin-top: 6px;
              line-height: 1.25;
            }
            .marca-corte {
              text-align: center;
              font-size: 9px;
              margin-top: 8px;
              color: #444;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="voucher">
            <p class="center titulo">PUNTO PUDO • CUSTODIA</p>
            <p class="center sub">COMPROBANTE DE RECEPCIÓN</p>
            <div class="linea"></div>

            <div class="fila"><span>Ingreso:</span><span>${fechaIngreso}</span></div>
            <div class="fila"><span>Estante:</span><span>${paquete.ubicacion_estante}</span></div>

            <div class="caja-codigos">
              <span class="lbl">CÓDIGO DE RASTREO</span>
              <span class="codigo">${paquete.codigo_rastreo}</span>
              <div class="linea"></div>
              <span class="lbl">TOKEN DE RETIRO</span>
              <span class="token">${paquete.token_retiro}</span>
            </div>

            <div class="fila"><span>Destinatario:</span><span>${paquete.destinatario_nombre}</span></div>
            <div class="fila"><span>CI:</span><span>${paquete.destinatario_ci}</span></div>
            <div class="fila"><span>Límite recojo:</span><span>${fechaLimite}</span></div>

            <div class="pago">
              PAGO AL RECOGER:<br/>${montoTexto}
            </div>

            <p class="pie">
              Entregue este comprobante o envíelo por foto al comprador. Debe presentar el TOKEN y su CI al recoger.
            </p>
          </div>
          <div class="marca-corte">✂ ---------------------------------- ✂</div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 400);
            };
          </script>
        </body>
      </html>
    `);
    ventana.document.close();
  };

  const descargarImagenPNG = () => {
    const canvas = document.createElement('canvas');
    const W = 720;
    const H = 1040;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, W, H);

    const pad = 40;
    const cardW = W - pad * 2;
    const cardH = H - pad * 2;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(pad, pad, cardW, cardH, 28);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(pad, pad, cardW, 145, [28, 28, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PUNTO PUDO • CUSTODIA Y ENTREGA DE PAQUETES', W / 2, pad + 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('COMPROBANTE PARA RECOJO', W / 2, pad + 92);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Recepcionado: ${fechaIngreso}`, W / 2, pad + 124);

    let y = pad + 185;
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(pad + 32, y, cardW - 64, 175, 18);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('CÓDIGO DE RASTREO', W / 2, y + 32);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 42px monospace';
    ctx.fillText(String(paquete.codigo_rastreo || 'TRK-BO-001'), W / 2, y + 78);

    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(pad + 60, y + 98);
    ctx.lineTo(W - pad - 60, y + 98);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('TOKEN DE RETIRO (PRESENTAR EN MOSTRADOR)', W / 2, y + 124);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(String(paquete.token_retiro || '0001'), W / 2, y + 164);

    y += 215;
    const leftX = pad + 40;
    const rightX = W - pad - 40;

    const dibujarFila = (etiqueta, valor, posY, colorValor = '#0f172a', boldValor = true) => {
      ctx.fillStyle = '#64748b';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(etiqueta, leftX, posY);

      ctx.fillStyle = colorValor;
      ctx.font = `${boldValor ? 'bold ' : ''}19px sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(String(valor), rightX, posY);
    };

    dibujarFila('Destinatario:', paquete.destinatario_nombre || 'Cliente', y);
    y += 42;
    dibujarFila('CI / Documento:', paquete.destinatario_ci || '---', y);
    y += 42;
    dibujarFila('Teléfono Destinatario:', paquete.destinatario_telefono || '---', y);
    y += 42;
    dibujarFila('Ubicación en almacén:', `Estante ${paquete.ubicacion_estante || 'E-01'}`, y, '#0284c7');
    y += 42;
    dibujarFila('Recoger antes de:', fechaLimite, y, '#475569', false);

    y += 38;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(pad + 24, y);
    ctx.lineTo(W - pad - 24, y);
    ctx.stroke();
    ctx.setLineDash([]);

    y += 32;
    ctx.fillStyle = totalPagarAlRecoger > 0 ? '#fef3c7' : '#dcfce7';
    ctx.beginPath();
    ctx.roundRect(pad + 32, y, cardW - 64, 130, 18);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = totalPagarAlRecoger > 0 ? '#92400e' : '#166534';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(
      totalPagarAlRecoger > 0
        ? 'MONTO A CANCELAR AL RECOGER EL PAQUETE'
        : 'ESTADO DE PAGO AL RECOGER',
      W / 2,
      y + 34
    );

    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(
      totalPagarAlRecoger > 0
        ? `${totalPagarAlRecoger.toFixed(2)} Bs`
        : '0.00 Bs (PAGADO)',
      W / 2,
      y + 82
    );

    ctx.font = '14px sans-serif';
    ctx.fillText(
      totalPagarAlRecoger > 0
        ? `Producto: ${montoProducto.toFixed(2)} Bs + Custodia: ${(pagaComprador ? costoCustodia : 0).toFixed(2)} Bs`
        : 'Solo presenta tu Token de Retiro y Cédula de Identidad',
      W / 2,
      y + 112
    );

    y += 172;
    ctx.fillStyle = '#475569';
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Para recoger tu paquete, muestra esta imagen en ventanilla', W / 2, y);
    ctx.fillText('junto con tu Cédula de Identidad física o digital.', W / 2, y + 24);

    const link = document.createElement('a');
    link.download = `Ticket-${paquete.codigo_rastreo || 'PUDO'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const abrirChatWhatsApp = (numero) => {
    const url = construirUrlWhatsApp(numero, paquete, fechaIngreso);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/90 border-b border-slate-700">
          <span className="text-sm font-bold text-white">🎫 Comprobante Digital / Impresión</span>
          <button
            type="button"
            onClick={onCerrar}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[68vh] overflow-y-auto">
          <div
            ref={tarjetaRef}
            className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-200"
          >
            <div className="bg-slate-900 text-white px-5 py-4 text-center">
              <div className="text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                Punto PUDO • Custodia y Entregas
              </div>
              <div className="text-base font-extrabold mt-0.5">COMPROBANTE DE RECOJO</div>
              <div className="text-[11px] text-slate-400 mt-1">Ingreso: {fechaIngreso}</div>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-100 rounded-xl p-3.5 text-center border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Código de Rastreo</div>
                <div className="text-2xl font-mono font-extrabold text-sky-600 tracking-wide">
                  {paquete.codigo_rastreo}
                </div>

                <div className="my-2.5 border-t border-dashed border-slate-300"></div>

                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  Token de Retiro (Mostrar al recoger)
                </div>
                <div className="text-3xl font-mono font-extrabold text-amber-600 tracking-widest">
                  {paquete.token_retiro}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destinatario:</span>
                  <strong className="text-slate-900">{paquete.destinatario_nombre}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CI / Documento:</span>
                  <strong className="font-mono text-slate-900">{paquete.destinatario_ci}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estante asignado:</span>
                  <strong className="font-mono text-sky-700">{paquete.ubicacion_estante}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recoger antes de:</span>
                  <span className="text-slate-700">{fechaLimite}</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-3">
                <div
                  className={`rounded-xl p-3 text-center ${
                    totalPagarAlRecoger > 0
                      ? 'bg-amber-50 border border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase">
                    {totalPagarAlRecoger > 0 ? 'Total a pagar al recoger' : 'Pago al recoger'}
                  </div>
                  <div className="text-xl font-extrabold mt-0.5">
                    {totalPagarAlRecoger > 0
                      ? `${totalPagarAlRecoger.toFixed(2)} Bs`
                      : '0.00 Bs (Pagado)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción: Imprimir Voucher, WhatsApp y Descargar PNG */}
        <div className="px-5 py-4 bg-slate-800/80 border-t border-slate-700 space-y-2">
          <button
            type="button"
            onClick={imprimirTicketVoucher}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition cursor-pointer shadow"
          >
            🖨️ Imprimir Ticket Compacto (Cuarto de hoja Carta / A6)
          </button>

          {telefonoRemitente && (
            <button
              type="button"
              onClick={() => abrirChatWhatsApp(telefonoRemitente)}
              className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              📲 Abrir Chat WhatsApp de Quien Dejó (+591 {telefonoRemitente})
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={descargarImagenPNG}
              className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              📥 Descargar PNG
            </button>
            {paquete.destinatario_telefono && (
              <button
                type="button"
                onClick={() => abrirChatWhatsApp(paquete.destinatario_telefono)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold text-xs transition cursor-pointer"
              >
                💬 WhatsApp Destinatario
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}