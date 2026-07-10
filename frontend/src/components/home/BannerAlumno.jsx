// Banner rojo superior del home del alumno.
// Muestra mensaje distinto según si tiene inscripciones o no.

import { useNavigate } from "react-router-dom";

export default function BannerAlumno({ usuario, tieneInscripciones }) {

    const navigate = useNavigate();
    const nombre = usuario.nombre.split(" ")[0];

    return (
        <div className="bg-red-800 text-white px-6 py-10">
            <div className="max-w-5xl mx-auto">

                {!tieneInscripciones && (
                    <span className="inline-block text-xs bg-red-700 border border-red-600/50 px-3 py-1 rounded-full mb-4">
                        ✦ ¡Bienvenido al sistema!
                    </span>
                )}

                <h1 className="text-3xl font-bold">
                    {tieneInscripciones
                        ? `Bienvenido de nuevo, ${nombre}`
                        : `Hola, ${nombre}`
                    }
                </h1>

                <p className="text-red-200 mt-1 text-sm">
                    {tieneInscripciones
                        ? `Legajo N° ${usuario.numero_legajo} · Integrante activo`
                        : "Tu legajo está listo"
                    }
                </p>

                {!tieneInscripciones && (
                    <p className="text-red-200 mt-3 max-w-md text-sm leading-relaxed">
                        Aún no tenés cursos ni actividades registradas.
                        Explorá las ofertas académicas disponibles y comenzá tu formación hoy.
                    </p>
                )}

                <button
                    onClick={() => navigate("/inscripciones")}
                    className="mt-5 inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
                >
                    Ver ofertas académicas →
                </button>

            </div>
        </div>
    );
}