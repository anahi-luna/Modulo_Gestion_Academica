export default function StatsAdminCards({ inscripciones, comisiones }) {

    // cuento por categoría usando includes para no depender del string exacto
    const aceptadas  = inscripciones.filter(i => i.estado?.toLowerCase().includes("acepta")).length;
    const pendientes = inscripciones.filter(i => i.estado?.toLowerCase().includes("pendiente")).length;
    const rechazadas = inscripciones.filter(i => i.estado?.toLowerCase().includes("rechaza")).length;

    const stats = [
        {
            titulo: "Total inscripciones",
            valor:  inscripciones.length,
            color:  "text-gray-800",
        },
        {
            titulo: "Aceptadas",
            valor:  aceptadas,
            color:  "text-green-600",
        },
        {
            titulo: "Pendientes de validar",
            valor:  pendientes,
            color:  "text-yellow-600",
        },
        {
            titulo: "Comisiones activas",
            valor:  comisiones.length,
            color:  "text-gray-800",
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