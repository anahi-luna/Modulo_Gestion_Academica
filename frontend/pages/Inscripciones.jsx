//   1. El alumno ingresa su nro de legajo
//   2. Se busca el legajo en el mock (simula GET /legajos/:id)
//   3. Se muestran las comisiones disponibles
//   4. El alumno elige una comisión
//   5. Se envía la solicitud (simula POST /inscripciones)
//   6. El mock valida: cupo → rango → correlativas
//   7. Se muestra el resultado: Aceptada o Rechazada
// ============================================================

import { useState, useEffect } from "react";

import {
  generarNroLegajoAleatorio,
  getLegajo,
  getComisiones,
  postInscripcion,
  getInscripcionesPorLegajo,
} from "../src/Services/mockInscripciones";

import ComisionCard          from "../components/ComisionCard";
import ResultadoInscripcion  from "../components/ResultadoInscripcion";
import EstadoBadge           from "../components/EstadoBadge";

export default function Inscripciones() {

  // paso 1 = ingresar legajo
  // paso 2 = elegir comisión
  // paso 3 = resultado
  const [paso, setPaso] = useState(1);

  // ── Estado: datos del formulario y respuestas
  const [nroLegajo,        setNroLegajo]        = useState("");          // Lo que escribe el usuario
  const [legajoData,       setLegajoData]        = useState(null);        // Datos del legajo validado
  const [comisiones,       setComisiones]        = useState([]);          // Lista de comisiones del mock
  const [comisionElegida,  setComisionElegida]   = useState(null);        // Comisión seleccionada por el alumno
  const [resultado,        setResultado]         = useState(null);        // Respuesta del POST /inscripciones
  const [historial,        setHistorial]         = useState([]);          // Inscripciones previas del legajo
  const [mostrarHistorial, setMostrarHistorial]  = useState(false);       // sección historial

  // ── Estado: loading y errores
  const [cargando,  setCargando]  = useState(false);
  const [error,     setError]     = useState(null);
  const [enviando,  setEnviando]  = useState(false);

  // ── Al montar el componente, cargamos las comisiones disponibles
  useEffect(() => {
    getComisiones()
      .then((res) => setComisiones(res.data))
      .catch((err) => setError("No se pudieron cargar las comisiones: " + err.message));
  }, []);


  // PASO 1: Buscar el legajo

  const handleBuscarLegajo = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    setLegajoData(null);
    setHistorial([]);

    try {
      // Buscamos el legajo en el mock
      const res = await getLegajo(nroLegajo.trim());
      setLegajoData(res.data);

      const resHistorial = await getInscripcionesPorLegajo(nroLegajo.trim());
      setHistorial(resHistorial.data);

      // Si todo OK, pasamos al paso 2
      setPaso(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  
  // PASO 2: Confirmar y enviar la inscripción

  const handleConfirmar = async () => {
    if (!comisionElegida) return; // Botón no debería aparecer sin selección, pero por las dudas
    setError(null);
    setEnviando(true);

    try {
      // Enviamos la solicitud al mock (simula POST /inscripciones)
      const res = await postInscripcion({
        nro_legajo:   nroLegajo.trim(),
        id_comision:  comisionElegida.id,
      });
      setResultado(res.data);
      setPaso(3); // Pasamos a mostrar el resultado
    } catch (err) {
      setError("Error al procesar la inscripción: " + err.message);
    } finally {
      setEnviando(false);
    }
  };


  // Reiniciar todo para hacer una nueva inscripción
  const handleNueva = () => {
    setPaso(1);
    setNroLegajo("");
    setLegajoData(null);
    setComisionElegida(null);
    setResultado(null);
    setHistorial([]);
    setError(null);
    setMostrarHistorial(false);
  };

  // Genera un número aleatorio y lo pega en el input
  const handleGenerarLegajo = () => {
    // legajos de prueba que existen en el mock
    const legajosDePrueba = ["000125", "000124", "000123"];
    const random = legajosDePrueba[Math.floor(Math.random() * legajosDePrueba.length)];
    setNroLegajo(random);
    setError(null);
  };

  // vista
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── NAVBAR ── */}
      <nav className="bg-red-700 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <span className="text-2xl"></span>  {/* aca falta el logo que paso damian*/}
            <div>
              <p className="font-bold text-sm leading-tight">Sistema de Legajos</p>
              <p className="text-red-200 text-xs">Bomberos Voluntarios</p>
            </div>
          </div>
          {/* Indicador de módulo activo */}
          <span className="text-xs bg-red-800 px-3 py-1 rounded-full font-medium">
          Inscripciones
          </span>
        </div>
      </nav>


      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* INDICADOR DE PASOS*/}
        <StepIndicator pasoActual={paso} />

        {/* ── PASO 1: Ingresar legajo ── */}
        {paso === 1 && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow p-6">
              <h1 className="text-xl font-bold text-gray-800 mb-1">Solicitar inscripción</h1>
              <p className="text-sm text-gray-500 mb-6">
                Ingresá tu número de legajo para buscar las comisiones disponibles.
              </p>

              {/* Form de búsqueda de legajo */}
              <form onSubmit={handleBuscarLegajo} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nro. de Legajo *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nroLegajo}
                      onChange={(e) => {
                        setNroLegajo(e.target.value);
                        setError(null);
                      }}
                      placeholder="Ej: 000125"
                      maxLength={6}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
                                 focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <button
                      type="button"
                      onClick={handleGenerarLegajo}
                      title="Generar legajo de prueba"
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300
                                 rounded-lg text-xs text-gray-600 transition-colors whitespace-nowrap"
                    >
                     Aleatorio
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Legajos de prueba: 000123, 000124, 000125
                  </p>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                     {error}
                  </div>
                )}

                {/* Botón buscar */}
                <button
                  type="submit"
                  disabled={!nroLegajo.trim() || cargando}
                  className="w-full py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50
                             disabled:cursor-not-allowed text-white font-medium rounded-lg
                             text-sm transition-colors"
                >
                  {cargando ? "Buscando..." : "Buscar legajo"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── PASO 2: Elegir comisión ── */}
        {paso === 2 && legajoData && (
          <div className="space-y-6">

            {/* Datos del legajo encontrado */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row
                            sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">Legajo #{legajoData.nro_legajo}</p>
                <p className="font-bold text-gray-800">
                  {legajoData.nombre} {legajoData.apellido}
                </p>
                <p className="text-sm text-gray-500">{legajoData.rango}</p>
              </div>
              {/* Botón para volver al paso 1 */}
              <button
                onClick={handleNueva}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
               Cambiar legajo
              </button>
            </div>

            {/* Historial de inscripciones*/}
            {historial.length > 0 && (
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <button
                  onClick={() => setMostrarHistorial((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3
                             text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Historial de inscripciones ({historial.length})</span>
                  <span>{mostrarHistorial ? "▲" : "▼"}</span>
                </button>
                {mostrarHistorial && (
                  <div className="divide-y divide-gray-100">
                    {historial.map((ins) => (
                      <div key={ins.id} className="px-4 py-3 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{ins.materia}</p>
                          <p className="text-xs text-gray-400">{ins.comision} · {ins.horario}</p>
                        </div>
                        {/*estado */}
                        <EstadoBadge estado={ins.estado} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* parte de comisiones */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Elegir comisión</h2>
              <p className="text-sm text-gray-500 mb-4">
                Seleccioná la comisión en la que querés inscribirte.
                Las que aparecen opacas no tienen cupo disponible.
              </p>

              {/* Grilla de tarjetas*/}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {comisiones.map((com) => (
                  <ComisionCard
                    key={com.id}
                    comision={com}
                    seleccionada={comisionElegida?.id === com.id}
                    onSeleccionar={setComisionElegida}  // aca guarda
                  />
                ))}
              </div>

              {/* Error*/}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
                   {error}
                </div>
              )}

              {/* Panel de confirmación (aparece al elegir una comision) */}
              {comisionElegida && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4
                                flex flex-col sm:flex-row items-start sm:items-center
                                justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Seleccionaste: {comisionElegida.materia}
                    </p>
                    <p className="text-xs text-red-600">
                      {comisionElegida.codigo} · {comisionElegida.horario}
                    </p>
                  </div>
                  <button
                    onClick={handleConfirmar}
                    disabled={enviando}
                    className="w-full sm:w-auto px-6 py-2.5 bg-red-700 hover:bg-red-800
                               disabled:opacity-50 text-white font-medium rounded-lg
                               text-sm transition-colors"
                  >
                    {enviando ? "Procesando..." : "Confirmar inscripción"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PASO 3: Resultado ── */}
        {paso === 3 && resultado && (
          <ResultadoInscripcion
            resultado={resultado}
            onNueva={handleNueva}
            onCerrar={handleNueva} 
          />
        )}

      </main>
    </div>
  );
}

function StepIndicator({ pasoActual }) {
  const pasos = ["Legajo", "Comisión", "Resultado"];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {pasos.map((nombre, idx) => {
        const num     = idx + 1;
        const activo  = num === pasoActual;
        const pasado  = num < pasoActual;

        return (
          <div key={nombre} className="flex items-center gap-2">
            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${pasado  ? "bg-green-500 text-white" :
                activo  ? "bg-red-700 text-white" :
                          "bg-gray-200 text-gray-400"}
            `}>
              {pasado ? "✓" : num}
            </div>
          
            <span className={`
              hidden sm:inline text-xs font-medium
              ${activo ? "text-red-700" : "text-gray-400"}
            `}>
              {nombre}
            </span>
      
            {idx < pasos.length - 1 && (
              <div className={`w-8 h-0.5 ${pasado ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
