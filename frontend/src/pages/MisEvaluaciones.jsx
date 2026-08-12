import { obtenerMisEvaluacionesPlano } from "../Services/evaluacionesAlumnoService";
import { obtenerIdLegajo } from "../config/legajo";
import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import EvaluacionesTable from "../components/evaluaciones/EvaluacionTable";


export default function MisEvaluaciones() {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    useEffect(() => {


        async function cargar() {
            setCargando(true);
            setError(null);
            try {
                setEvaluaciones(await obtenerMisEvaluacionesPlano());
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar tus evaluaciones.");
            } finally {
                setCargando(false);
            }
        }

        cargar();
    }, []);

    const evaluacionesFiltradas = evaluaciones.filter((evaluacion) => {
        if (filtroMateria && evaluacion.materia !== filtroMateria) return false;
        if (filtroComision && evaluacion.codigo !== filtroComision) return false;
        if (filtroDocente && evaluacion.docente !== filtroDocente) return false;
        if (filtroTipo && evaluacion.tipo !== filtroTipo) return false;
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {error && (
                <Alert
                    tipo="error"
                    titulo="Error"
                    mensaje={error}
                    onCerrar={() => setError(null)}
                />
            )}

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Mis evaluaciones
                </h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Evaluaciones de las comisiones en las que estás inscripto.
                </p>
            </div>

            {cargando ? (
                <p className="text-sm text-gray-400">Cargando...</p>
            ) : (
                <EvaluacionesTable
                    evaluaciones={evaluacionesFiltradas}
                    todasLasEvaluaciones={evaluaciones}
                    filtroMateria={filtroMateria}
                    setFiltroMateria={setFiltroMateria}
                    filtroComision={filtroComision}
                    setFiltroComision={setFiltroComision}
                    filtroDocente={filtroDocente}
                    setFiltroDocente={setFiltroDocente}
                    filtroTipo={filtroTipo}
                    setFiltroTipo={setFiltroTipo}
                    soloLectura
                />
            )}
        </div>
    );
}