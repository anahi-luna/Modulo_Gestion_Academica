// Vista principal del alumno.
// Muestra estado vacío si no tiene inscripciones,
// o resumen activo si ya está inscripto en alguna comisión.

import { useState, useEffect } from "react";
import { obtenerMisInscripciones } from "../Services/inscripcionesService";
import BannerAlumno from "../components/home/BannerAlumno";
import ResumenVacio from "../components/home/ResumenVacio";
import ResumenActivo from "../components/home/ResumenActivo";

export default function HomeAlumno({ usuario }) {

    const [inscripciones, setInscripciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarInscripciones();
    }, []);

    async function cargarInscripciones() {
        try {
            const data = await obtenerMisInscripciones(usuario.id_legajo);
            setInscripciones(data);
        } catch {
            // Si el backend no responde mostramos estado vacío
            setInscripciones([]);
        } finally {
            setCargando(false);
        }
    }

    if (cargando) {
        return (
            <div className="flex justify-center py-20 text-gray-400 text-sm">
                Cargando...
            </div>
        );
    }

    const tieneInscripciones = inscripciones.length > 0;

    return (
        <div className="min-h-screen bg-gray-100">
            <BannerAlumno
                usuario={usuario}
                tieneInscripciones={tieneInscripciones}
            />
            <div className="max-w-5xl mx-auto px-4 py-6">
                {tieneInscripciones
                    ? <ResumenActivo inscripciones={inscripciones} />
                    : <ResumenVacio />
                }
            </div>
        </div>
    );
}