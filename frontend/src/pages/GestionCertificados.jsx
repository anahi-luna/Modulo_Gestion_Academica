import { useEffect, useState } from "react";
import useAuth from "../auth/hooks/useAuth";
import { obtenerFilasCertificados, emitir, revocar, descargarCertificado, subirArchivo } from "../Services/certificadosService";
import { getEstadosResultadoPlan } from "../api/catalogosApi";
import { getComisiones } from "../api/comisiones";
import { generarResultadosAcademicos } from "../Services/resultadoAcademicoService";
import TablaCertificadosAdmin from "../components/certificados/TablaCertificadosAdmin";
import ModalEmitirCertificado from "../components/certificados/ModalEmitirCertificado";
import ModalAdjuntarArchivo from "../components/certificados/ModalAdjuntarArchivo";

export default function GestionCertificados() {
  const { hasPermission } = useAuth();
  const puedeEmitir = hasPermission("inscripcion.certificados.emitir");
  const puedeActualizar = hasPermission("inscripcion.certificados.actualizar");
  const puedeGenerarResultado = hasPermission("inscripcion.resultado_academico.generar");


  return <VistaPersonal puedeEmitir={puedeEmitir} puedeActualizar={puedeActualizar} puedeGenerarResultado={puedeGenerarResultado} />;
}

// GENERAR RESULTADOS ACADÉMICOS
function GenerarResultadosAcademicos() {
  const [comisiones, setComisiones] = useState([]);
  const [idComision, setIdComision] = useState("");
  const [generando, setGenerando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarComisiones() {
      try {
        const res = await getComisiones();
        setComisiones(res.data ?? []);
      } catch (err) {
        console.error("Error al obtener las comisiones", err);
      }
    }
    cargarComisiones();
  }, []);

  async function handleGenerar() {
    if (!idComision) return;
    setGenerando(true);
    setMensaje(null);
    setError(null);

    try {
      const resultados = await generarResultadosAcademicos(Number(idComision));
      setMensaje(resultados.length > 0 ? `Se generaron ${resultados.length} resultado(s) académico(s) correctamente.` : "Todos los alumnos de esa comisión ya tenían resultado académico generado.");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">Generar resultados académicos</h2>
      <p className="text-xs text-gray-400 mb-3">Elegí una comisión ya finalizada (todas sus clases dictadas) para calcular el promedio, la asistencia y el estado académico de cada alumno aceptado.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={idComision} onChange={(e) => setIdComision(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">Seleccioná una comisión</option>
          {comisiones.map((c) => (
            <option key={c.id_comision_asignatura} value={c.id_comision_asignatura}>
              {c.comision.descripcion} - {c.nombre}
            </option>
          ))}
        </select>
        <button onClick={handleGenerar} disabled={!idComision || generando} className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap">
          {generando ? "Generando..." : "Generar resultados académicos"}
        </button>
      </div>
      {mensaje && <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{mensaje}</p>}
      {error && <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
    </div>
  );
}

// VISTA DEL PERSONAL
function VistaPersonal({ puedeEmitir, puedeActualizar, puedeGenerarResultado }) {
  const [filas, setFilas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [certificadoParaArchivo, setCertificadoParaArchivo] = useState(null);
  const [estadosPlan, setEstadosPlan] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    cargarDatos();
    cargarEstadosPlan();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerFilasCertificados();
      setFilas(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarEstadosPlan() {
    try {
      const estados = await getEstadosResultadoPlan();
      setEstadosPlan(estados ?? []);
    } catch (err) {
      console.error("Error al obtener los estados del resultado de plan", err);
      setError("No se pudieron cargar los estados del plan.");
    }
  }

  function abrirModalEmitir(fila) {
    setFilaSeleccionada(fila);
    setModalAbierto(true);
  }

  async function handleEmitir(idResultadoPlan) {
    try {
      await emitir(idResultadoPlan);
      setModalAbierto(false);
      setFilaSeleccionada(null);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function handleRevocar(certificado) {
    if (!confirm("¿Revocar este certificado?")) return;
    try {
      await revocar(certificado.id);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDescargar(certificado) {
    descargarCertificado(certificado);
  }

  async function handleAdjuntar(idCertificado, archivo) {
    try {
      await subirArchivo(idCertificado, archivo);
      setCertificadoParaArchivo(null);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const filtradas = filtroEstado ? filas.filter((f) => f.estado_plan === filtroEstado) : filas;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">{puedeEmitir ? "Gestionar certificados" : "Certificados"}</h1>
        <p className="text-sm text-gray-500 mb-6">{puedeEmitir ? "Estado del plan de cada alumno y emisión/revocación de certificados." : "Consulta del estado del plan y certificados emitidos."}</p>

        {error && <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">{error}</div>}
        {puedeGenerarResultado && <GenerarResultadosAcademicos />}

        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="filtro-estado-plan" className="text-xs text-gray-500">Estado del plan:</label>
          <select id="filtro-estado-plan" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="border border-gray-200 rounded-md px-3 py-2 text-sm w-full sm:w-auto">
            <option value="">Todos</option>
            {estadosPlan.map((estado) => (
              <option key={estado.id_estado_resultado_plan} value={estado.nombre}>
                {estado.nombre}
              </option>
            ))}
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
            onAdjuntar={puedeEmitir ? setCertificadoParaArchivo : null}
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

        {puedeEmitir && (
          <ModalAdjuntarArchivo
            abierto={!!certificadoParaArchivo}
            certificado={certificadoParaArchivo}
            onCerrar={() => setCertificadoParaArchivo(null)}
            onAdjuntar={handleAdjuntar}
          />
        )}
      </main>
    </div>
  );
}
