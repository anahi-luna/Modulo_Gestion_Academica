import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComisiones } from "../mocks/comisionesMock";

export default function HomeProfesor({ usuario }) {
    const [comision, setComision] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarMiComision() {
            const respuesta = await getComisiones();
            const miComision = respuesta.data.find(
                (c) => c.id === usuario.id_comision
            );
            setComision(miComision ?? null);
            setCargando(false);
        }
        cargarMiComision();
    }, [usuario]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Banner de bienvenida */}
            <div className="bg-red-800 text-white rounded-2xl px-8 py-10 mb-8">
                <span className="inline-block bg-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    ✦ Panel del docente
                </span>
                <h1 className="text-3xl font-bold mb-1">Hola, {usuario.nombre}</h1>
                <p className="text-red-100">
                    Este es el resumen de tu curso a cargo.
                </p>
            </div>

            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Mi curso
            </h2>

            {cargando && (
                <p className="text-sm text-gray-400">Cargando información del curso...</p>
            )}

            {!cargando && !comision && (
                <div className="bg-white rounded-xl shadow px-6 py-8 text-center text-sm text-gray-400">
                    No tenés ningún curso asignado todavía.
                </div>
            )}

            {!cargando && comision && (
                <div className="bg-white rounded-xl shadow px-6 py-6">
                    <span className="text-xs text-gray-400">{comision.codigo}</span>
                    <h3 className="text-xl font-bold text-gray-800">{comision.materia}</h3>
                    <p className="text-sm text-gray-500 mt-1">{comision.horario}</p>

                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-600"
                                style={{ width: `${(comision.inscriptos / comision.cupo) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500">
                            {comision.inscriptos}/{comision.cupo} alumnos
                        </span>
                    </div>

                    <Link
                        to="/AsistenciaAdmin"
                        className="mt-6 inline-block bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-800 transition"
                    >
                        Ver asistencia 
                    </Link>
                </div>
            )}
        </div>
    );
}