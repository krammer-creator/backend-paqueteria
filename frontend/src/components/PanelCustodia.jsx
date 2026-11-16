import React, { useState, useEffect, useRef } from 'react';
import {
  obtenerPaquetes,
  crearPaquete,
  entregarPaquete,
  obtenerPersonal,
  actualizarPaquete,
} from '../services/api';
import ModalPersonal from './ModalPersonal';
import ModalDetallePaquete from './ModalDetallePaquete';
import ModalTicketImagen, { construirUrlWhatsApp } from './ModalTicketImagen';

const CAPACIDAD_MAX_ESTANTE = 12;
const LISTA_ESTANTES = ['E-01', 'E-02', 'E-03', 'E-04'];

function comprimirImagenBase64(file, maxAncho = 720, calidad = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, maxAncho / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', calidad));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PanelCustodia({ paquetesIniciales = [], onVolver3D, onVolver, onBack }) {

  function respaldarYLimpiarEntregados() {
    const entregados = paquetes.filter((p) => String(p.estado || '').trim().toUpperCase().includes('ENTREGADO'));
    if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      const apiFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
      apiFn.then(() => {
        if (typeof cargarDatos === 'function') {
          cargarDatos();
        } else {
          window.location.reload();
        }
      }).catch(err => {
        console.error(err);
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      const apiFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
      apiFn.then(() => {
        if (typeof cargarDatos === 'function') {
          cargarDatos();
        } else {
          window.location.reload();
        }
      }).catch(err => {
        console.error(err);
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      const apiFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
      apiFn.then(() => {
        if (typeof cargarDatos === 'function') {
          cargarDatos();
        } else {
          window.location.reload();
        }
      }).catch(err => {
        console.error(err);
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



      
        if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
          return;
        }
        try {
          const getVal = (p, keys) => {
            for (const k of keys) {
              if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
            }
            return 'N/A';
          };

          const w = window.open('', '_blank');
          w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
          w.document.close();

          const apiFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
          apiFn.then(() => {
            if (typeof cargarDatos === 'function') {
              cargarDatos();
            } else {
              window.location.reload();
            }
          }).catch(err => {
            console.error(err);
            window.location.reload();
          });
        } catch (err) {
          console.error(err);
          alert('Error al procesar el respaldo');
        }
      }



        if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
          return;
        }
        try {
          const getVal = (p, keys) => {
            for (const k of keys) {
              if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
            }
            return 'N/A';
          };

          const w = window.open('', '_blank');
          w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
          w.document.close();

          const apiFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
          apiFn.then(() => {
            if (typeof cargarDatos === 'function') {
              cargarDatos();
            } else {
              window.location.reload();
            }
          }).catch(err => {
            console.error(err);
            window.location.reload();
          });
        } catch (err) {
          console.error(err);
          alert('Error al procesar el respaldo');
        }
      }



  
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



      
        if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
          return;
        }
        try {
          const getVal = (p, keys) => {
            for (const k of keys) {
              if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
            }
            return 'N/A';
          };

          const w = window.open('', '_blank');
          w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
          w.document.close();

          if (typeof limpiarPaquetesEntregadosApi === 'function') {
            await limpiarPaquetesEntregadosApi();
          }
          if (typeof cargarDatos === 'function') {
            await cargarDatos();
          } else {
            window.location.reload();
          }
        } catch (err) {
          console.error(err);
          alert('Error al procesar el respaldo');
        }
      }



  
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      const limpiarFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
      limpiarFn.then(() => {
        if (typeof cargarDatos === 'function') {
          cargarDatos();
        } else {
          window.location.reload();
        }
      }).catch(err => {
        console.error(err);
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      const limpiarFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
      limpiarFn.then(() => {
        if (typeof cargarDatos === 'function') {
          cargarDatos();
        } else {
          window.location.reload();
        }
      }).catch(err => {
        console.error(err);
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }



  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();

      const limpiarFn = typeof limpiarPaquetesEntregadosApi === 'function' ? limpiarPaquetesEntregadosApi() : Promise.resolve();
      limpiarFn.then(() => {
        if (typeof cargarDatos === 'function') {
          cargarDatos();
        } else {
          window.location.reload();
        }
      }).catch(err => {
        console.error(err);
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }


  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();
      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  }
  if (entregados.length === 0) {
      alert('No hay paquetes entregados para respaldar.');
      return;
    }
    if (!window.confirm(`¿Deseas generar el reporte PDF y limpiar ${entregados.length} paquetes entregados?`)) {
      return;
    }
    try {
      const getVal = (p, keys) => {
        for (const k of keys) {
          if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
        }
        return 'N/A';
      };

      const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();
      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  };
  const w = window.open('', '_blank');
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join('')}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();
      if (typeof limpiarPaquetesEntregadosApi === 'function') {
        await limpiarPaquetesEntregadosApi();
      }
      if (typeof cargarDatos === 'function') {
        await cargarDatos();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar el respaldo');
    }
  };

  const w = window.open("", "_blank");
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento', 'nro_guia', 'nroGuia'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario', 'persona', 'destinatario_nombre'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono', 'contacto', 'telefono_destinatario'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero', 'rack', 'posicion'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join("")}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();
      if (typeof limpiarPaquetesEntregadosApi === 'function') await limpiarPaquetesEntregadosApi();
      if (typeof cargarDatos === 'function') await cargarDatos(); else window.location.reload();
    } catch(err) { console.error(err); alert('Error al procesar el respaldo'); }
  };
  const w = window.open("", "_blank");
      w.document.write(`<html><head><title>Reporte PDF</title><style>body{font-family:Arial;padding:20px}table{width:100%%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h1>Respaldo de Paquetes Entregados</h1><p>Fecha: ${new Date().toLocaleString()}</p><table><thead><tr><th>Código</th><th>Destinatario</th><th>Teléfono</th><th>Estante</th><th>Estado</th></tr></thead><tbody>${entregados.map(p=>`<tr><td>${getVal(p, ['codigo', 'tracking', 'id', 'codigo_seguimiento'])}</td><td>${getVal(p, ['destinatario', 'nombre', 'cliente', 'nombre_destinatario', 'persona'])}</td><td>${getVal(p, ['telefono', 'celular', 'whatsapp', 'fono', 'contacto'])}</td><td>${getVal(p, ['estante', 'ubicacion', 'casillero', 'rack', 'posicion'])}</td><td>${getVal(p, ['estado'])}</td></tr>`).join("")}</tbody></table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();
      if (typeof limpiarPaquetesEntregadosApi === 'function') await limpiarPaquetesEntregadosApi();
      if (typeof cargarDatos === 'function') await cargarDatos(); else window.location.reload();
    } catch(err) { console.error(err); alert('Error al procesar el respaldo'); }
  };
  const volverAl3D = onVolver3D || onVolver || onBack || (() => {});
  const inputFotoRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [paquetes, setPaquetes] = useState(paquetesIniciales);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [migrandoFotos, setMigrandoFotos] = useState(false);
  const [errorApi, setErrorApi] = useState('');
  const [mensajeOk, setMensajeOk] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [fotoPrevia, setFotoPrevia] = useState(null);
  const [remitenteTelefono, setRemitenteTelefono] = useState('');
  const [remitenteNombre, setRemitenteNombre] = useState('');

  const [camaraActiva, setCamaraActiva] = useState(false);
  const [listaCamaras, setListaCamaras] = useState([]);
  const [camaraSeleccionadaId, setCamaraSeleccionadaId] = useState('');
  const [errorCamara, setErrorCamara] = useState('');

  const [modalPersonalAbierto, setModalPersonalAbierto] = useState(false);
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null);
  const [paqueteTicket, setPaqueteTicket] = useState(null);

  const [personal, setPersonal] = useState([]);
  const operadorActivo = personal.find((p) => p.activo) || null;

  const [bitacoraLocal] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pudo_bitacora_empleados') || '{}');
    } catch {
      return {};
    }
  });

  const [formulario, setFormulario] = useState({
    id_vendedor: 1,
    codigo_rastreo: 'TRK-BO-001',
    token_retiro: '0001',
    destinatario_nombre: '',
    destinatario_telefono: '',
    destinatario_ci: '',
    costo_custodia: 2.0,
    monto_producto: 0.0,
    quien_paga_custodia: 'COMPRADOR',
    ubicacion_estante: 'E-01',
    fecha_limite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const calcularSiguientesCodigos = (listaPaquetes) => {
    let maxTrk = 0;
    let maxToken = 0;

    (listaPaquetes || []).forEach((p) => {
      const matchTrk = String(p.codigo_rastreo || '').match(/^TRK-BO-(\d{1,3})$/i);
      if (matchTrk) {
        const num = parseInt(matchTrk[1], 10);
        if (num > maxTrk) maxTrk = num;
      }

      const matchTok = String(p.token_retiro || '').match(/^(\d{4})$/);
      if (matchTok) {
        const numTok = parseInt(matchTok[1], 10);
        if (numTok < 1000 && numTok > maxToken) maxToken = numTok;
      }
    });

    const siguienteTrk = `TRK-BO-${String(maxTrk + 1).padStart(3, '0')}`;
    const siguienteToken = String(maxToken + 1).padStart(4, '0');
    return { siguienteTrk, siguienteToken };
  };

  const ocupacionPorEstante = LISTA_ESTANTES.reduce((acc, est) => {
    acc[est] = (paquetes || []).filter(
      (p) =>
        (p.estado || '').toUpperCase() !== 'ENTREGADO' &&
        (p.ubicacion_estante || 'E-01').toUpperCase() === est
    ).length;
    return acc;
  }, {});

  const estanteActual = (formulario.ubicacion_estante || 'E-01').toUpperCase();
  const estanteLleno = (ocupacionPorEstante[estanteActual] || 0) >= CAPACIDAD_MAX_ESTANTE;
  const estanteSugerido =
    LISTA_ESTANTES.find((est) => (ocupacionPorEstante[est] || 0) < CAPACIDAD_MAX_ESTANTE) || null;

  const cargarDatos = async () => {
    setCargando(true);
    setErrorApi('');
    try {
      const [data, listaPers] = await Promise.all([
        obtenerPaquetes(),
        obtenerPersonal().catch(() => []),
      ]);
      const lista = Array.isArray(data) ? data : [];
      setPaquetes(lista);
      if (Array.isArray(listaPers)) setPersonal(listaPers);
    } catch {
      setErrorApi('No se pudo conectar con la API de Render (puede estar despertando el servidor gratuito).');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    
  
  
  return () => detenerCamaraWeb();
  }, []);

  useEffect(() => {
    const { siguienteTrk, siguienteToken } = calcularSiguientesCodigos(paquetes);
    setFormulario((prev) => {
      const actual = (prev.ubicacion_estante || 'E-01').toUpperCase();
      const cantActual = (paquetes || []).filter(
        (p) =>
          (p.estado || '').toUpperCase() !== 'ENTREGADO' &&
          (p.ubicacion_estante || 'E-01').toUpperCase() === actual
      ).length;
      const libre = LISTA_ESTANTES.find(
        (est) =>
          (paquetes || []).filter(
            (p) =>
              (p.estado || '').toUpperCase() !== 'ENTREGADO' &&
              (p.ubicacion_estante || 'E-01').toUpperCase() === est
          ).length < CAPACIDAD_MAX_ESTANTE
      );
      return {
        ...prev,
        codigo_rastreo: siguienteTrk,
        token_retiro: siguienteToken,
        ubicacion_estante: cantActual >= CAPACIDAD_MAX_ESTANTE && libre ? libre : prev.ubicacion_estante,
      };
    });
  }, [paquetes]);

  const detenerCamaraWeb = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCamaraActiva(false);
  };

  const iniciarCamaraWeb = async (deviceIdPreferido = '') => {
    setErrorCamara('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorCamara('Tu navegador no soporta acceso directo a cámara web.');
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: deviceIdPreferido
          ? { deviceId: { exact: deviceIdPreferido } }
          : { facingMode: 'environment' },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setCamaraActiva(true);

      const dispositivos = await navigator.mediaDevices.enumerateDevices();
      const camarasVideo = dispositivos.filter((d) => d.kind === 'videoinput');
      setListaCamaras(camarasVideo);

      const trackActivo = stream.getVideoTracks()[0];
      const idActual =
        trackActivo?.getSettings()?.deviceId ||
        deviceIdPreferido ||
        camarasVideo[0]?.deviceId ||
        '';
      setCamaraSeleccionadaId(idActual);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch {
      setErrorCamara('No se pudo abrir la cámara. Verifica permisos en el navegador.');
      setCamaraActiva(false);
    }
  };

  const cambiarCamaraWeb = (nuevoDeviceId) => {
    setCamaraSeleccionadaId(nuevoDeviceId);
    iniciarCamaraWeb(nuevoDeviceId);
  };

  const capturarFotoDesdeWebcam = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const ancho = video.videoWidth || 640;
    const alto = video.videoHeight || 480;

    const escala = Math.min(1, 720 / ancho);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(ancho * escala);
    canvas.height = Math.round(alto * escala);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.75);
    setFotoPrevia(base64);
    detenerCamaraWeb();
  };

  const handleSeleccionarFoto = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    detenerCamaraWeb();
    try {
      const comprimida = await comprimirImagenBase64(archivo);
      setFotoPrevia(comprimida);
    } catch {
      setErrorApi('No se pudo procesar la imagen seleccionada.');
    }
  };

  const handleSoltarFoto = async (e) => {
    e.preventDefault();
    const archivo = e.dataTransfer.files?.[0];
    if (!archivo || !archivo.type.startsWith('image/')) return;
    detenerCamaraWeb();
    try {
      const comprimida = await comprimirImagenBase64(archivo);
      setFotoPrevia(comprimida);
    } catch {
      setErrorApi('No se pudo procesar la imagen arrastrada.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (estanteLleno) {
      setErrorApi(`El estante ${estanteActual} está lleno. Selecciona otro estante disponible.`);
      return;
    }

    setGuardando(true);
    setErrorApi('');
    setMensajeOk('');

    try {
      const estSel = (formulario.ubicacion_estante || 'E-01').toUpperCase();
      const ocupadosSlots = new Set(
        (paquetes || [])
          .filter(
            (p) =>
              (p.estado || '').toUpperCase() !== 'ENTREGADO' &&
              (p.ubicacion_estante || 'E-01').toUpperCase() === estSel &&
              typeof p.slot_3d === 'number'
          )
          .map((p) => p.slot_3d)
      );
      let primerSlotLibre = 0;
      while (ocupadosSlots.has(primerSlotLibre) && primerSlotLibre < 12) primerSlotLibre++;

      const telRemLimpio = remitenteTelefono.replace(/\D/g, '');
      const payload = {
        ...formulario,
        id_vendedor: Number(formulario.id_vendedor) || 1,
        costo_custodia: parseFloat(formulario.costo_custodia) || 0,
        monto_producto: parseFloat(formulario.monto_producto) || 0,
        fecha_limite: new Date(formulario.fecha_limite).toISOString(),
        recibido_por: operadorActivo?.codigo || 'DUEÑO',
        remitente_nombre: remitenteNombre.trim() || null,
        remitente_telefono: telRemLimpio || null,
        foto_paquete: fotoPrevia || null,
        slot_3d: primerSlotLibre < 12 ? primerSlotLibre : 0,
      };

      const creado = await crearPaquete(payload);
      const pkgFinal = creado || { ...payload };
      setPaqueteTicket(pkgFinal);

      if (telRemLimpio.length >= 7) {
        const horaAhora = new Date().toLocaleString('es-BO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const urlWa = construirUrlWhatsApp(telRemLimpio, pkgFinal, horaAhora);
        window.open(urlWa, '_blank', 'noopener,noreferrer');
      }

      setMensajeOk(`Paquete ${formulario.codigo_rastreo} registrado y sincronizado en Supabase.`);
      setFotoPrevia(null);
      setRemitenteTelefono('');
      setRemitenteNombre('');
      if (inputFotoRef.current) inputFotoRef.current.value = '';

      setFormulario((prev) => ({
        ...prev,
        destinatario_nombre: '',
        destinatario_telefono: '',
        destinatario_ci: '',
        monto_producto: 0.0,
      }));
      await cargarDatos();
    } catch {
      setErrorApi('Error al registrar el paquete. Verifica que el ID Vendedor exista en Supabase.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEntregar = async (pkg) => {
    setErrorApi('');
    setMensajeOk('');
    try {
      await entregarPaquete(pkg.id_paquete, operadorActivo?.codigo || 'DUEÑO');
      setMensajeOk(`Paquete ${pkg.codigo_rastreo} marcado como ENTREGADO.`);
      await cargarDatos();
    } catch {
      setErrorApi('No se pudo actualizar el estado de entrega en el servidor.');
    }
  };

  const construirBitacoraSupabase = (p) => {
    if (!p) return null;
    const loc = bitacoraLocal[p.codigo_rastreo] || {};
    return {
      recibidoPor: p.recibido_por || loc.recibidoPor || '---',
      entregadoPor: p.entregado_por || loc.entregadoPor || null,
      fechaRecepcion: p.fecha_recepcion || p.fecha_ingreso || loc.fechaRecepcion,
      fechaEntrega: p.fecha_entrega || loc.fechaEntrega || null,
      fotoPaquete: p.foto_paquete || loc.fotoPaquete || null,
      remitenteNombre: p.remitente_nombre || loc.remitenteNombre || '',
      remitenteTelefono: p.remitente_telefono || loc.remitenteTelefono || '',
    };
  };

  const pendientesMigrar = paquetes.filter(
    (p) => !p.foto_paquete && bitacoraLocal[p.codigo_rastreo]?.fotoPaquete
  );

  const migrarFotosAntiguas = async () => {
    if (pendientesMigrar.length === 0) return;
    setMigrandoFotos(true);
    setErrorApi('');
    try {
      for (const p of pendientesMigrar) {
        const fotoLoc = bitacoraLocal[p.codigo_rastreo]?.fotoPaquete;
        if (fotoLoc) {
          await actualizarPaquete(p.id_paquete, { foto_paquete: fotoLoc });
        }
      }
      setMensajeOk(`${pendientesMigrar.length} foto(s) antigua(s) subidas a Supabase.`);
      await cargarDatos();
    } catch {
      setErrorApi('Error al subir las fotos antiguas (espera 1 min a que Render termine de desplegar).');
    } finally {
      setMigrandoFotos(false);
    }
  };

  const paquetesFiltrados = paquetes.filter((p) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      String(p.codigo_rastreo || '').toLowerCase().includes(q) ||
      String(p.destinatario_nombre || '').toLowerCase().includes(q) ||
      String(p.destinatario_ci || '').toLowerCase().includes(q) ||
      String(p.token_retiro || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900/95 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">Atendiendo en turno:</span>
          {operadorActivo ? (
            <span className="font-semibold text-emerald-300">
              [{operadorActivo.codigo}] {operadorActivo.nombre}{' '}
              <span className="text-xs text-slate-400">({operadorActivo.turno})</span>
            </span>
          ) : (
            <span className="text-amber-300 font-medium">Sin encargado asignado (Modo Dueño)</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setModalPersonalAbierto(true)}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 font-semibold text-xs transition cursor-pointer"
        >
          🔐 Personal en Turno (PIN Dueño)
        </button>
      </div>

      <ModalDetallePaquete
        paquete={paqueteSeleccionado}
        bitacora={construirBitacoraSupabase(paqueteSeleccionado)}
        onCerrar={() => setPaqueteSeleccionado(null)}
        onVerTicket={(pkg) => setPaqueteTicket(pkg)}
      />

      <ModalTicketImagen
        paquete={paqueteTicket}
        bitacora={construirBitacoraSupabase(paqueteTicket)}
        onCerrar={() => setPaqueteTicket(null)}
      />

      <ModalPersonal
        abierto={modalPersonalAbierto}
        onCerrar={() => setModalPersonalAbierto(false)}
        personal={personal}
        setPersonal={setPersonal}
      />

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={volverAl3D}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition cursor-pointer"
            >
              ← Vista Almacén 3D
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Custodia y Entregas PUDO</h1>
              <p className="text-xs text-slate-400">Sincronizado en tiempo real con Supabase</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {paquetes.some((p) => String(p.estado || '').trim().toUpperCase().includes('ENTREGADO')) && (
  <button
    type="button"
                    placeholder="76543210"
                    className="w-full bg-transparent px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">CI Destinatario *</label>
                <input
                  type="text"
                  name="destinatario_ci"
                  required
                  value={formulario.destinatario_ci}
                  onChange={handleChange}
                  placeholder="Ej. 6543210 LP"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Custodia (Bs)</label>
                <input
                  type="number"
                  step="0.5"
                  name="costo_custodia"
                  value={formulario.costo_custodia}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Producto (Bs)</label>
                <input
                  type="number"
                  step="0.5"
                  name="monto_producto"
                  value={formulario.monto_producto}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Paga Custodia</label>
                <select
                  name="quien_paga_custodia"
                  value={formulario.quien_paga_custodia}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                >
                  <option value="COMPRADOR">COMPRADOR</option>
                  <option value="VENDEDOR">VENDEDOR</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={guardando || estanteLleno}
                className="w-full py-2.5 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                {guardando ? 'Guardando...' : 'Registrar Paquete'}
              </button>
            </div>
          </form>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold text-white">Foto del Paquete Original</h3>
              <p className="text-[11px] text-slate-400">
                Se guarda en Supabase para verse en cualquier equipo
              </p>
            </div>

            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleSeleccionarFoto}
              className="hidden"
            />

            {camaraActiva && listaCamaras.length > 0 && (
              <div className="mb-2">
                <select
                  value={camaraSeleccionadaId}
                  onChange={(e) => cambiarCamaraWeb(e.target.value)}
                  className="w-full bg-slate-950 border border-sky-500/50 rounded-lg px-2.5 py-1.5 text-xs text-sky-200 focus:outline-none"
                >
                  {listaCamaras.map((cam, idx) => (
                    <option key={cam.deviceId || idx} value={cam.deviceId}>
                      🎥 {cam.label || `Cámara Web ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {errorCamara && (
              <div className="mb-2 p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-200 text-center">
                {errorCamara}
              </div>
            )}

            {camaraActiva ? (
              <div className="relative w-full h-64 rounded-xl bg-black border border-sky-500/60 overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 backdrop-blur-sm p-2.5 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={capturarFotoDesdeWebcam}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer shadow"
                  >
                    📸 Capturar Foto
                  </button>
                  <button
                    type="button"
                    onClick={detenerCamaraWeb}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : fotoPrevia ? (
              <div className="relative w-full h-64 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden">
                <img
                  src={fotoPrevia}
                  alt="Foto del paquete"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 backdrop-blur-sm p-2 flex flex-wrap items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => iniciarCamaraWeb(camaraSeleccionadaId)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-pointer"
                  >
                    🎥 Nueva foto
                  </button>
                  <button
                    type="button"
                    onClick={() => inputFotoRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold cursor-pointer"
                  >
                    📁 Archivo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFotoPrevia(null);
                      if (inputFotoRef.current) inputFotoRef.current.value = '';
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleSoltarFoto}
                className="w-full h-64 rounded-xl bg-slate-950/80 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-4 text-center gap-3"
              >
                <div className="text-3xl">📦</div>
                <p className="text-xs text-slate-300">
                  Elige cómo capturar la evidencia del paquete:
                </p>

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => iniciarCamaraWeb(camaraSeleccionadaId)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    🎥 Usar Cámara Web
                  </button>
                  <button
                    type="button"
                    onClick={() => inputFotoRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sky-300 font-bold text-xs transition cursor-pointer"
                  >
                    📁 Subir Archivo
                  </button>
                </div>

                <p className="text-[10px] text-slate-500">
                  También puedes arrastrar una imagen aquí
                </p>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
              <span>Etiqueta lista:</span>
              <span className="font-mono font-bold text-sky-400">
                {formulario.codigo_rastreo} • {formulario.ubicacion_estante}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-bold text-white">
              Inventario de Paquetes en Almacén ({paquetesFiltrados.length})
            </h2>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por rastreo, token, cliente o CI..."
              className="w-full sm:w-72 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/60 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase">Rastreo</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase">Token</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase">Destinatario</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase">Estante</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase">Total Cobrar</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase">Auditoría (Rec / Ent)</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase">Estado / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {paquetesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No hay paquetes para mostrar.
                    </td>
                  </tr>
                ) : (
                  paquetesFiltrados.map((p) => {
                    const entregado = (p.estado || '').toUpperCase() === 'ENTREGADO';
                    const totalCobrar =
                      (parseFloat(p.monto_producto) || 0) +
                      ((p.quien_paga_custodia || 'COMPRADOR') === 'COMPRADOR'
                        ? parseFloat(p.costo_custodia) || 0
                        : 0);

                    const locFila = bitacoraLocal[p.codigo_rastreo] || {};
                    const fotoMostrar = p.foto_paquete || locFila.fotoPaquete;
                    const rec = p.recibido_por || locFila.recibidoPor || '---';
                    const ent = p.entregado_por || locFila.entregadoPor || (entregado ? '---' : 'Pendiente');

                    return (
                      <tr key={p.id_paquete} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono font-semibold">
                          <div className="flex items-center gap-2.5">
                            {fotoMostrar && (
                              <img
                                src={fotoMostrar}
                                alt={p.codigo_rastreo}
                                onClick={() => setPaqueteSeleccionado(p)}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-700 cursor-pointer"
                                title="Ver foto y ficha completa"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => setPaqueteSeleccionado(p)}
                              title="Haz clic para ver ficha completa, horarios y foto"
                              className="text-sky-400 hover:text-sky-300 underline decoration-sky-500/40 hover:decoration-sky-300 underline-offset-4 cursor-pointer"
                            >
                              {p.codigo_rastreo}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">
                          {p.token_retiro}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{p.destinatario_nombre}</div>
                          <div className="text-xs text-slate-400">
                            CI: {p.destinatario_ci} • Tel: {p.destinatario_telefono}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-slate-200">
                            {p.ubicacion_estante}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-300">
                          {totalCobrar.toFixed(2)} Bs
                        </td>
                        <td className="py-3 px-4 text-xs font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sky-300">
                              Rec: <strong>{rec}</strong>
                            </span>
                            <span className={ent === 'Pendiente' ? 'text-slate-500' : 'text-emerald-300'}>
                              Ent: <strong>{ent}</strong>
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPaqueteTicket(p)}
                              title="Ver y descargar comprobante imagen para enviar al comprador"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-xs transition cursor-pointer"
                            >
                              🎫 Ticket
                            </button>
                            {entregado ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                ✓ Entregado
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleEntregar(p)}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                              >
                                Entregar Paquete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
