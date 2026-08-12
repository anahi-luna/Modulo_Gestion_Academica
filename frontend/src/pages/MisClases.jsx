import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import ClasesTable from "../components/clases/ClaseTable";
import { obtenerMisClasesPlano } from "../Services/clasesAlumnoService";



export default function MisClases() {
    const [clases, setClases] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroTema, setFiltroTema] = useState("");

    useEffect(() => {

        async function cargar() {
            setCargando(true);
            setError(null);
            try {
                setClases(await obtenerMisClasesPlano());
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar tus clases.");
            } finally {
                setCargando(false);
            }
        }
        cargar();
    }, []);

    const clasesFiltradas = clases.filter((clase) => {
        if (filtroMateria && clase.materia !== filtroMateria) return false;
        if (filtroComision && clase.codigo !== filtroComision) return false;
        if (filtroDocente && clase.docente !== filtroDocente) return false;
        if (filtroFecha && clase.fecha !== filtroFecha) return false;
        if (filtroTema && clase.tema !== filtroTema) return false;
        return true;
    });

    function limpiarFiltros() {
        setFiltroMateria("");
        setFiltroComision("");
        setFiltroDocente("");
        setFiltroFecha("");
        setFiltroTema("");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

            {error && (
                <Alert tipo="error" titulo="Error" mensaje={error} onCerrar={() => setError(null)} />
            )}

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mis clases</h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Clases de las comisiones en las que estás inscripto.
                </p>
            </div>

            {cargando ? (
                <p className="text-sm text-gray-400">Cargando...</p>
            ) : (
                <ClasesTable
                    clases={clasesFiltradas}
                    todasLasClases={clases}

                    filtroMateria={filtroMateria}
                    setFiltroMateria={setFiltroMateria}

                    filtroComision={filtroComision}
                    setFiltroComision={setFiltroComision}

                    filtroDocente={filtroDocente}
                    setFiltroDocente={setFiltroDocente}

                    filtroFecha={filtroFecha}
                    setFiltroFecha={setFiltroFecha}

                    filtroTema={filtroTema}
                    setFiltroTema={setFiltroTema}

                    soloLectura
                />
            )}
        </div>
    );
}
