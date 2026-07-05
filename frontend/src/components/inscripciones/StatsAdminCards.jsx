// Tarjetas de estadísticas para el panel de administración.
// Recibe todas las inscripciones y calcula los totales.

export default function StatsAdminCards({ inscripciones, comisiones }) {

    const stats = [
        {
            titulo: "Total inscripciones",
            valor: inscripciones.length,
            color: "text-gray-800"
        },
        {
            titulo: "Aceptadas",
            valor: inscripciones.filter(i => i.estado === "Aceptada").length,
            color: "text-green-600"
        },
        {
            titulo: "Pendientes de validar",
            valor: inscripciones.filter(i => i.estado === "Pendiente").length,
            color: "text-yellow-600"
        },
        {
            titulo: "Comisiones activas",
            valor: comisiones.length,
            color: "text-gray-800"
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
                <div key={s.titulo} className="bg-white rounded-xl shadow p-4">
                    <p className="text-xs text-gray-400">{s.titulo}</p>
                    <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.valor}</p>
                </div>
            ))}
        </div>
    );
}