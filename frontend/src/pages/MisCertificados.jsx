import { useEffect, useState } from "react";

import {
    obtenerMisCertificados,
    descargarCertificado,
} from "../Services/certificadosService";

import CertificadoCard from "../components/certificados/CertificadoCard";

export default function MisCertificados() {
  const [certificados, setCertificados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const data = await obtenerMisCertificados();
        setCertificados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  function handleDescargar(cert) {
    descargarCertificado(cert);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis certificados</h1>
        <p className="text-sm text-gray-500 mb-6">Certificados de participación y aprobación emitidos a tu nombre.</p>

        {error && <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">{error}</div>}
        {cargando && <p className="text-sm text-gray-400">Cargando certificados...</p>}

        {!cargando && certificados.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
            Todavía no tenés certificados.
          </div>
        )}

        <div className="space-y-3">
          {certificados.map((c) => (
            <CertificadoCard key={c.id} certificado={c} onDescargar={handleDescargar} />
          ))}
        </div>
      </main>
    </div>
  );
}