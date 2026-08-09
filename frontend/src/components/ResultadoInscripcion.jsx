// Componente de modal que muestra el resultado de una inscripción,
// con los datos de la comisión, materia, legajo, estado y motivo.

import { useEffect, useState } from "react";
import { useModalAccessibility } from "../hooks/useModalAccessibility";
import { getEstadosInscripcion } from "../api/catalogosApi";

export default function ResultadoInscripcion({ resultado, onCerrar, onNueva }) {
    const modalRef = useModalAccessibility(true, onCerrar);
    const [estadosInscripcion, setEstadosInscripcion] = useState([]);

    useEffect(() => {
        async function cargarEstados() {
            try {
                const estados = await getEstadosInscripcion();
                setEstadosInscripcion(estados);
            } catch (error) {
                console.error("Error al obtener estados de inscripción:", error);
            }
        }
        cargarEstados();
    }, []);

    // IDS DEL CATÁLOGO
    const idEstadoPendiente = estadosInscripcion.find(
        (estado) => estado.nombre === "Pendiente"
    )?.id_estado;

    const idEstadoAceptada = estadosInscripcion.find(
        (estado) => estado.nombre === "Aceptada"
    )?.id_estado;

    // RESULTADO
    const esAceptada =
        resultado?.id_estado === idEstadoPendiente ||
        resultado?.id_estado === idEstadoAceptada;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in"
            >
                {/* Ícono */}
                <div
                    className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                        esAceptada ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                    {esAceptada ? "SI" : "NO"}
                </div>

                {/* Título */}
                <h2
                    className={`text-xl font-bold mb-1 ${
                        esAceptada ? "text-green-700" : "text-red-700"
                    }`}
                >
                    Inscripción {resultado?.estado}
                </h2>

                {/* Datos */}
                <div className="bg-gray-50 rounded-xl p-4 my-4 text-left space-y-2">
                    <Row label="Comisión" valor={resultado?.comision} />
                    <Row label="Materia" valor={resultado?.materia} />
                    <Row label="Legajo" valor={resultado?.id_legajo} />
                    <Row label="Estado" valor={resultado?.estado} />
                    <Row
                        label="Fecha"
                        valor={
                            resultado?.fecha_inscripcion
                                ? new Date(resultado.fecha_inscripcion).toLocaleString()
                                : "-"
                        }
                    />
                    {resultado?.motivo && (
                        <Row
                            label="Motivo"
                            valor={resultado.motivo}
                            colorValor="text-red-600"
                        />
                    )}
                </div>

                {/* ID */}
                <p className="text-xs text-gray-400 mb-6">
                    Nro. de solicitud: #{resultado?.id}
                </p>

                {/* Botones */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onNueva}
                        className="w-full py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium text-sm transition-colors"
                    >
                        Nueva inscripción
                    </button>
                    <button
                        onClick={onCerrar}
                        className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

// FILA AUXILIAR
function Row({ label, valor, colorValor = "text-gray-800" }) {
    return (
        <div className="flex justify-between gap-3">
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`text-xs font-medium text-right ${colorValor}`}>
                {valor ?? "-"}
            </span>
        </div>
    );
}