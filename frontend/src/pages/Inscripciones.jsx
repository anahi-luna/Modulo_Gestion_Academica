// Vista del alumno para solicitar una inscripción.
// Maneja el estado y los handlers del flujo de 3 pasos.
// Cada paso tiene su propio componente en components/inscripciones/.


import { useState } from "react";
import {
    buscarLegajo,
    obtenerComisionesDisponibles,
    crearSolicitudInscripcion
} from "../Services/inscripcionesService";

import StepIndicator       from "../components/inscripciones/StepIndicator";
import PasoLegajo          from "../components/inscripciones/PasoLegajo";
import PasoComision        from "../components/inscripciones/PasoComision";
import ResultadoInscripcion from "../components/ResultadoInscripcion";

export default function Inscripciones() {

    const [paso, setPaso]                       = useState(1);
    const [nroLegajo, setNroLegajo]             = useState("");
    const [legajoData, setLegajoData]           = useState(null);
    const [comisiones, setComisiones]           = useState([]);
    const [comisionElegida, setComisionElegida] = useState(null);
    const [resultado, setResultado]             = useState(null);
    const [historial, setHistorial]             = useState([]);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [cargando, setCargando]               = useState(false);
    const [error, setError]                     = useState(null);
    const [enviando, setEnviando]               = useState(false);

    async function handleBuscarLegajo(e) {
        e.preventDefault();
        setError(null);
        setCargando(true);
        try {
            const legajo = await buscarLegajo(nroLegajo.trim());
            setLegajoData(legajo);
            const lista = await obtenerComisionesDisponibles(nroLegajo.trim());
            setComisiones(lista);
            setHistorial([]);
            setPaso(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    async function handleConfirmar() {
        if (!comisionElegida) return;
        setError(null);
        setEnviando(true);
        try {
            const res = await crearSolicitudInscripcion(nroLegajo, comisionElegida.id);
            setResultado(res.data);
            setPaso(3);
        } catch (err) {
            setError("Error al procesar la inscripción: " + err.message);
        } finally {
            setEnviando(false);
        }
    }

    function handleNueva() {
        setPaso(1);
        setNroLegajo("");
        setLegajoData(null);
        setComisiones([]);
        setComisionElegida(null);
        setResultado(null);
        setHistorial([]);
        setMostrarHistorial(false);
        setError(null);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-5xl mx-auto px-4 py-6">

                <StepIndicator pasoActual={paso} />

                {paso === 1 && (
                    <PasoLegajo
                        nroLegajo={nroLegajo}
                        onChange={(e) => { setNroLegajo(e.target.value); setError(null); }}
                        onSubmit={handleBuscarLegajo}
                        error={error}
                        cargando={cargando}
                    />
                )}

                {paso === 2 && legajoData && (
                    <PasoComision
                        legajoData={legajoData}
                        comisiones={comisiones}
                        comisionElegida={comisionElegida}
                        onSeleccionarComision={setComisionElegida}
                        historial={historial}
                        mostrarHistorial={mostrarHistorial}
                        onToggleHistorial={() => setMostrarHistorial(v => !v)}
                        error={error}
                        enviando={enviando}
                        onConfirmar={handleConfirmar}
                        onCambiarLegajo={handleNueva}
                    />
                )}

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