export default function StatsAdminCards({
    inscripciones,
    comisiones,
    estadosInscripcion
}) {
    // OBTENER IDS DESDE EL CATÁLOGO
    const idEstadoAceptada = estadosInscripcion.find(
        (estado) => estado.nombre === "Aceptada"
    )?.id_estado;

    const idEstadoPendiente = estadosInscripcion.find(
        (estado) => estado.nombre === "Pendiente"
    )?.id_estado;

    // ESTADÍSTICAS
    const aceptadas = idEstadoAceptada == null
        ? 0
        : inscripciones.filter(
            (inscripcion) => inscripcion.id_estado === idEstadoAceptada
          ).length;

    const pendientes = idEstadoPendiente == null
        ? 0
        : inscripciones.filter(
            (inscripcion) => inscripcion.id_estado === idEstadoPendiente
          ).length;

    const stats = [
        {
            titulo: "Total inscripciones",
            valor: inscripciones.length,
            color: "text-gray-800",
        },
        {
            titulo: "Aceptadas",
            valor: aceptadas,
            color: "text-green-600",
        },
        {
            titulo: "Pendientes de validar",
            valor: pendientes,
            color: "text-yellow-600",
        },
        {
            titulo: "Comisiones activas",
            valor: comisiones.length,
            color: "text-gray-800",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
                <div key={stat.titulo} className="bg-white rounded-xl shadow p-4">
                    <p className="text-xs text-gray-400">
                        {stat.titulo}
                    </p>
                    <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                        {stat.valor}
                    </p>
                </div>
            ))}
        </div>
    );
}