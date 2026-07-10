// Vista Admin: emisión, firma y revocación de certificados.
// RBAC: certificados sólo pueden ser emitidos/firmados por autoridades habilitadas (Admin).

import { useEffect, useState } from "react";
import {
  obtenerTodosLosCertificados,
  emitir,
  revocar,
  descargarCertificado,
} from "../Services/certificadosService";
import TablaCertificadosAdmin from "../components/certificados/TablaCertificadosAdmin";
import ModalEmitirCertificado from "../components/certificados/ModalEmitirCertificado";

export default function GestionCertificados({ usuario }) {
  const [certificados, setCertificados] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    setCargando(true);
    setError(null);
    try {
      setCertificados(await obtenerTodosLosCertificados());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function abrirModalEmitir(cert) {
    setSeleccionado(cert);
    setModalAbierto(true);
  }

  async function handleEmitir(datos) {
    await emitir(datos);
    setModalAbierto(false);
    setSeleccionado(null);
    cargarDatos();
  }

  async function handleRevocar(cert) {
    if (!confirm(`¿Revocar el certificado de ${cert.alumno}?`)) return;
    try {
      await revocar(cert.idCertificado);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDescargar(cert) {
    descargarCertificado(cert, cert.alumno);
  }

  const filtrados = filtroEstado
    ? certificados.filter((c) => c.estado === filtroEstado)
    : certificados;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar certificados</h1>
        <p className="text-sm text-gray-500 mb-6">
          Emisión, firma y revocación de certificados académicos.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4 mb-6 flex items-center gap-3">
          <label className="text-xs text-gray-500">Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Emitido">Emitido</option>
            <option value="Revocado">Revocado</option>
          </select>
        </div>

        {cargando ? (
          <p className="text-sm text-gray-400">Cargando certificados...</p>
        ) : (
          <TablaCertificadosAdmin
            certificados={filtrados}
            onEmitir={abrirModalEmitir}
            onRevocar={handleRevocar}
            onDescargar={handleDescargar}
          />
        )}

        <ModalEmitirCertificado
          abierto={modalAbierto}
          certificado={seleccionado}
          usuario={usuario}
          onCerrar={() => setModalAbierto(false)}
          onEmitir={handleEmitir}
        />
      </main>
    </div>
  );
}