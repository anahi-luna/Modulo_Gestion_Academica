import AlumnoNotaRow from "./AlumnoNotaRow";

export default function CalificacionTabla({ calificaciones, onCambiarNota, onCambiarObservacion, soloLectura = false, onEliminarCalificacion }) {
    return (
        <div className="px-4 sm:px-6 pb-6">
            {/* overflow-x-auto: mismo criterio que AsistenciaTabla */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 pr-2">Integrante</th>
                            <th className="text-left pr-2">Legajo</th>
                            <th className="text-left pr-2">Nota</th>
                            <th className="text-left pr-2">Estado</th>
                            <th className="text-left">Observación</th>
                            <th className="text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calificaciones.map((c) => (
                            <AlumnoNotaRow
                                key={c.id_inscripcion}
                                calificacion={c}
                                onCambiarNota={onCambiarNota}
                                onCambiarObservacion={onCambiarObservacion}
                                onEliminarCalificacion={onEliminarCalificacion}
                                soloLectura={soloLectura}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}