// Página de certificados: vista para alumnos y personal, según el rol del usuario. 
// Si es alumno, ve solo sus certificados emitidos y puede descargarlos.
// Si es personal, ve la tabla con el estado del plan de cada alumno y puede emitir/revocar certificados
// según sus permisos. Además, si tiene el permiso de generar resultados académicos, puede hacerlo desde
// un botón que abre un modal para elegir la comisión.
import { useEffect, useState } from "react";
import useAuth from "../auth/hooks/useAuth";
import {
  obtenerFilasCertificados,
  obtenerMisCertificados,
  emitir,
  revocar,
  descargarCertificado,
} from "../Services/certificadosService";
import { generarResultadosAcademicos } from "../Services/resultadoAcademicoService";
import { getComisiones } from "../api/comisiones";
import CertificadoCard from "../components/certificados/CertificadoCard";
import TablaCertificadosAdmin from "../components/certificados/TablaCertificadosAdmin";
import ModalEmitirCertificado from "../components/certificados/ModalEmitirCertificado";

const ID_LEGAJO_ALUMNO_MOCK = 1; 

export default function Certificados() {
  const { user: usuario, hasPermission, hasRole } = useAuth();
  const esAlumno = hasRole("Alumno");

  const puedeEmitir = hasPermission("inscripcion.certificados.emitir");
  const puedeActualizar = hasPermission("inscripcion.certificados.actualizar");
  const puedeGenerarResultado = hasPermission("inscripcion.resultado_academico.generar");

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

// Sección para generar en bloque los resultados académicos de una
// comisión (por eso pide elegir la comisión, no un alumno puntual).
function GenerarResultadosAcademicos() {
  const [comisiones, setComisiones] = useState([]);
  const [idComision, setIdComision] = useState("");
  const [generando, setGenerando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getComisiones().then((res) => setComisiones(res.data));
  }, []);

  async function handleGenerar() {
    if (!idComision) return;
    setGenerando(true);
    setMensaje(null);
    setError(null);
    try {
      const resultados = await generarResultadosAcademicos(Number(idComision));
      setMensaje(
        resultados.length > 0
          ? `Se generaron ${resultados.length} resultado(s) académico(s) correctamente.`
          : "Todos los alumnos de esa comisión ya tenían resultado académico generado."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">
        Generar resultados académicos
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        Elegí una comisión ya finalizada (todas sus clases dictadas) para calcular
        el promedio, la asistencia y el estado académico de cada alumno aceptado.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={idComision}
          onChange={(e) => setIdComision(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Seleccioná una comisión</option>
          {comisiones.map((c) => (
            <option key={c.id_comision_asignatura} value={c.id_comision_asignatura}>{c.comision.descripcion} - {c.nombre}</option>
          ))}
        </select>
        <button
          onClick={handleGenerar}
          disabled={!idComision || generando}
          className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap"
        >
          {generando ? "Generando..." : "Generar resultados académicos"}
        </button>
      </div>

      {mensaje && (
        <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

// Vista del personal: tabla con el estado del plan de cada alumno. Si
// tiene el permiso de emitir/actualizar, ve los botones de acción; si
// solo tiene el de leer (por ejemplo un auditor), ve la tabla sin
// poder tocar nada.
function VistaPersonal({ puedeEmitir, puedeActualizar, puedeGenerarResultado }) {
  const [filas, setFilas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    setCargando(true);
    setError(null);
    try {
      setFilas(await obtenerFilasCertificados());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function abrirModalEmitir(fila) {
    setFilaSeleccionada(fila);
    setModalAbierto(true);
  }

  async function handleEmitir(idResultadoPlan) {
    await emitir(idResultadoPlan);
    setModalAbierto(false);
    setFilaSeleccionada(null);
    cargarDatos();
  }

  async function handleRevocar(certificado) {
    if (!confirm("¿Revocar este certificado?")) return;
    try {
      await revocar(certificado.id);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDescargar(certificado) {
    const fila = filas.find((f) => f.certificado?.id === certificado.id);
    descargarCertificado(certificado, fila?.alumno ?? "-");
  }

  const filtradas = filtroEstado
    ? filas.filter((f) => f.estado_plan === filtroEstado)
    : filas;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {puedeEmitir ? "Gestionar certificados" : "Certificados"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {puedeEmitir
            ? "Estado del plan de cada alumno y emisión/revocación de certificados."
            : "Consulta del estado del plan y certificados emitidos."}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {puedeGenerarResultado && <GenerarResultadosAcademicos />}

        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="filtro-estado-plan" className="text-xs text-gray-500">Estado del plan:</label>
          <select
            id="filtro-estado-plan"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="">Todos</option>
            <option value="En curso">En curso</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Incompleto">Incompleto</option>
            <option value="Abandonado">Abandonado</option>
          </select>
        </div>

        {cargando ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <TablaCertificadosAdmin
            filas={filtradas}
            onEmitir={puedeEmitir ? abrirModalEmitir : null}
            onRevocar={puedeActualizar ? handleRevocar : null}
            onDescargar={handleDescargar}
          />
        )}

        {puedeEmitir && (
          <ModalEmitirCertificado
            abierto={modalAbierto}
            fila={filaSeleccionada}
            onCerrar={() => setModalAbierto(false)}
            onEmitir={handleEmitir}
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
            <CertificadoCard key={c.id_comision_asignatura} certificado={c} onDescargar={handleDescargar} />
          ))}
        </div>
      </main>
    </div>
  );
}
