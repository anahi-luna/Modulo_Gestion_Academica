//vista de certificados: si el usuario es un alumno, ve solo sus propios certificados; 
// si es personal, ve la tabla con todos los certificados y puede emitir/revocar según sus permisos.

import { useEffect, useState } from "react";
import { usePermissions } from "../context/PermissionsContext";
import { ACCIONES } from "../config/modulos";
import {
  obtenerMisCertificados,
  obtenerTodosLosCertificados,
  emitir,
  revocar,
  descargarCertificado,
} from "../Services/certificadosService";
import CertificadoCard from "../components/certificados/CertificadoCard";
import TablaCertificadosAdmin from "../components/certificados/TablaCertificadosAdmin";
import ModalEmitirCertificado from "../components/certificados/ModalEmitirCertificado";
import ModalGenerarResultadoAcademico from "../components/certificados/ModalGenerarResultadoAcademico";
import {
  obtenerResultadoAcademico,
  generarResultadoAcademico,
} from "../Services/resultadoAcademicoService";

const ID_LEGAJO_ALUMNO_MOCK = 1; // ver TODO arriba

export default function Certificados() {
  const { usuario, hasPermission } = usePermissions();
  const esAlumno = usuario?.usuario === "alumno";

  const puedeEmitir = hasPermission(ACCIONES.CERTIFICADOS_EMITIR);
  const puedeActualizar = hasPermission(ACCIONES.CERTIFICADOS_ACTUALIZAR);
  const puedeGenerarResultado = hasPermission(ACCIONES.RESULTADO_ACADEMICO_GENERAR);

  if (esAlumno) {
    return <VistaAlumno idLegajo={ID_LEGAJO_ALUMNO_MOCK} usuario={usuario} />;
  }

  return (
    <VistaPersonal
      puedeEmitir={puedeEmitir}
      puedeActualizar={puedeActualizar}
      puedeGenerarResultado={puedeGenerarResultado}
    />
  );
}

// Vista del personal: tabla con todos los certificados. Si tiene el
// permiso de emitir/actualizar, ve los botones de acción; si solo tiene
// el de leer (por ejemplo un auditor), ve la tabla sin poder tocar nada.
function VistaPersonal({ puedeEmitir, puedeActualizar, puedeGenerarResultado }) {
  const { usuario } = usePermissions();
  const [certificados, setCertificados] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");

  // Estado para el modal de "Generar resultado académico": necesito
  // guardar el certificado sobre el que se clickeó Y, si ya existía un
  // resultado académico para esa materia, precargarlo en el modal.
  const [modalResultadoAbierto, setModalResultadoAbierto] = useState(false);
  const [certParaResultado, setCertParaResultado] = useState(null);
  const [resultadoExistente, setResultadoExistente] = useState(null);

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

  // Al clickear "Generar resultado académico" primero busco si esa
  // materia ya tenía uno cargado (para precargar el modal en modo
  // corrección) y recién ahí abro el modal.
  async function abrirModalResultado(cert) {
    setCertParaResultado(cert);
    try {
      const existente = await obtenerResultadoAcademico(cert.id_legajo, cert.id_comision);
      setResultadoExistente(existente);
    } catch (err) {
      setResultadoExistente(null);
    }
    setModalResultadoAbierto(true);
  }

  async function handleGenerarResultado(datos) {
    await generarResultadoAcademico(datos);
    setModalResultadoAbierto(false);
    setCertParaResultado(null);
    setResultadoExistente(null);
  }

  const filtrados = filtroEstado
    ? certificados.filter((c) => c.estado === filtroEstado)
    : certificados;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {puedeEmitir ? "Gestionar certificados" : "Certificados"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {puedeEmitir
            ? "Emisión, firma y revocación de certificados académicos."
            : "Consulta de certificados académicos emitidos."}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs text-gray-500">Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
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
            onEmitir={puedeEmitir ? abrirModalEmitir : null}
            onRevocar={puedeActualizar ? handleRevocar : null}
            onDescargar={handleDescargar}
            onGenerarResultado={puedeGenerarResultado ? abrirModalResultado : null}
          />
        )}

        {puedeEmitir && (
          <ModalEmitirCertificado
            abierto={modalAbierto}
            certificado={seleccionado}
            usuario={usuario}
            onCerrar={() => setModalAbierto(false)}
            onEmitir={handleEmitir}
          />
        )}

        {puedeGenerarResultado && (
          <ModalGenerarResultadoAcademico
            abierto={modalResultadoAbierto}
            certificado={certParaResultado}
            resultadoExistente={resultadoExistente}
            usuario={usuario}
            onCerrar={() => setModalResultadoAbierto(false)}
            onGenerar={handleGenerarResultado}
          />
        )}
      </main>
    </div>
  );
}

// Vista del alumno: solo consulta y descarga de SUS certificados. 
function VistaAlumno({ idLegajo, usuario }) {
  const [certificados, setCertificados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const data = await obtenerMisCertificados(idLegajo);
        setCertificados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [idLegajo]);

  function handleDescargar(cert) {
    descargarCertificado(cert, usuario.nombre);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis certificados</h1>
        <p className="text-sm text-gray-500 mb-6">
          Certificados de participación y aprobación emitidos a tu nombre.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cargando && <p className="text-sm text-gray-400">Cargando certificados...</p>}

        {!cargando && certificados.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
            Todavía no tenés certificados.
          </div>
        )}

        <div className="space-y-3">
          {certificados.map((c) => (
            <CertificadoCard key={c.idCertificado} certificado={c} onDescargar={handleDescargar} />
          ))}
        </div>
      </main>
    </div>
  );
}
