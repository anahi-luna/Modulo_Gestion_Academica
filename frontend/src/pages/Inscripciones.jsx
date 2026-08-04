// Vista del alumno para solicitar una inscripción.
// El alumno ya llega logueado, así que su legajo se toma directo de
// la sesión (usuario.id_legajo) y se le muestran las comisiones
// disponibles apenas entra, sin pedirle que lo tipee.

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/hooks/useAuth";
import {
    cargarDatosInscripcion,
    crearSolicitudInscripcion
} from "../Services/inscripcionesService";

import StepIndicator        from "../components/inscripciones/StepIndicator";
import PasoComision          from "../components/inscripciones/PasoComision";
import ResultadoInscripcion from "../components/ResultadoInscripcion";

export default function Inscripciones() {

    const { user: usuario } = useAuth();
    const idLegajo = usuario?.id_legajo;

    const [paso, setPaso]                       = useState(1);
    const [legajoData, setLegajoData]           = useState(null);
    const [comisiones, setComisiones]           = useState([]);
    const [comisionElegida, setComisionElegida] = useState(null);
    const [resultado, setResultado]             = useState(null);
    const [historial, setHistorial]             = useState([]);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [cargando, setCargando]               = useState(true);
    const [error, setError]                     = useState(null);
    const [enviando, setEnviando]               = useState(false);
    const navigate = useNavigate();

    // Trae el legajo (del usuario logueado) y las comisiones disponibles.
    // Se usa al entrar a la página y también para refrescar cupos cuando
    // el alumno vuelve a "Nueva inscripción".
    const cargarDatos = useCallback(async () => {
        if (!idLegajo) {
            setCargando(false);
            setError("No pudimos identificar tu legajo. Volvé a iniciar sesión o contactá a soporte.");
            return;
        }
        setError(null);
        setCargando(true);
        try {
            const { legajo, comisiones: lista } = await cargarDatosInscripcion(idLegajo);
            setLegajoData(legajo);
            setComisiones(lista);
            setComisionElegida(null);
            setHistorial([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }, [idLegajo]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    async function handleConfirmar(idComisionAsignatura) {
        // Si no se pasó por parámetro, evaluamos con el estado general por seguridad
        const idAUsar = idComisionAsignatura || comisionElegida?.id_comision_asignatura;

        if (!idAUsar) return;

        setError(null);
        setEnviando(true);
        try {
            const res = await crearSolicitudInscripcion(idLegajo, idAUsar);
            setResultado(res.data);
            setPaso(2);
        } catch (err) {
            setError("Error al procesar la inscripción: " + err.message);
        } finally {
            setEnviando(false);
        }
    }

    // Vuelve a la selección de comisiones y refresca cupos/estado
    // (por si mientras tanto se llenó alguna comisión).
    function handleNueva() {
        setResultado(null);
        setPaso(1);
        cargarDatos();
    }

    // "Cerrar" en el modal de resultado va al home.
    function handleCerrar() {
        navigate("/");
    }

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-sm text-gray-400">Cargando ofertas académicas...</p>
            </div>
        );
    }

    // Si falló la carga inicial (legajo inactivo, sesión sin legajo, etc.)
    // mostramos el error sin llegar a dibujar los pasos.
    if (error && !legajoData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full text-center">
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                    <button
                        onClick={cargarDatos}
                        className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-lg"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-5xl mx-auto px-4 py-6">

                <StepIndicator pasoActual={paso} />

                {paso === 1 && legajoData && (
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
                    />
                )}

                {paso === 2 && resultado && (
                    <ResultadoInscripcion
                        resultado={resultado}
                        onNueva={handleNueva}
                        onCerrar={handleCerrar}
                    />
                )}

            </main>
        </div>
    );
}