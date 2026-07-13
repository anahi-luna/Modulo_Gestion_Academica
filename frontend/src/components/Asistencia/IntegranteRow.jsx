

export default function IntegranteRow({

    asistencia,
    onCambiarEstado,
    onCambiarObservacion

}){

    return(

        <tr className="border-b">

            <td className="py-4">

                {asistencia.alumno}

            </td>

            <td>

                {asistencia.id_legajo}

            </td>

            <td>

                <div className="flex gap-2">

                    <button
                        className="bg-green-100 text-green-700 rounded-lg px-3 py-1"
                        onClick={() => onCambiarEstado(asistencia.id_inscripcion, 1)}
                    >

                        Presente

                    </button>

                    <button
                        className="bg-yellow-100 text-yellow-700 rounded-lg px-3 py-1"
                        onClick={() => onCambiarEstado(asistencia.id_inscripcion, 2)}
                    >

                        Ausente

                    </button>

                    <button
                        className="bg-white-100 text-black-700 rounded-lg px-3 py-1"
                        onClick={() => onCambiarEstado(asistencia.id_inscripcion, 3)}
                    >

                        Justificado

                    </button>

                    <button
                        className="bg-red-100 text-red-700 rounded-lg px-3 py-1"
                        onClick={() => onCambiarEstado(asistencia.id_inscripcion, 4)}
                    >

                        Tarde

                    </button>

                    <td>
                        <input 
                            type="text"
                            value={asistencia.observacion ?? ""}
                            onChange={(e)=>
                                onCambiarObservacion(
                                    asistencia.id_inscripcion,
                                    e.target.value
                                )
                            }
                            placeholder="Observacion"
                            className="w-full rounded-lg border border-gray-300 px-2 py-1"
                         />
                    </td>

                </div>

            </td>

        </tr>

    )

}