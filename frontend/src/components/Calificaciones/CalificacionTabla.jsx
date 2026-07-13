import AlumnoNotaRow from "./AlumnoNotaRow";

export default function CalificacionTabla({ calificaciones, onCambiarNota, onCambiarObservacion }) {

    return (
        <div className="px-6 pb-6">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3">Integrante</th>
                        <th className="text-left">Legajo</th>
                        <th className="text-left">Nota</th>
                        <th className="text-left">Estado</th>
                        <th className="text-left">Observación</th>
                    </tr>
                </thead>

                <tbody>
                    {calificaciones.map((c) => (
                        <AlumnoNotaRow
                            key={c.id_inscripcion}
                            calificacion={c}
                            onCambiarNota={onCambiarNota}
                            onCambiarObservacion={onCambiarObservacion}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
