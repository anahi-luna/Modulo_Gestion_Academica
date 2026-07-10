

export default function IntegranteRow({

    asistencia,
    onActualizarEstado

}){

    return(

        <tr className="border-b">

            <td className="py-4">

                {nombre}

            </td>

            <td>

                {dni}

            </td>

            <td>

                <div className="flex gap-2">

                    <button
                        className="bg-green-100 text-green-700 rounded-lg px-3 py-1"
                        onClick={() => onActualizarEstado(asistencia.id, 1)}
                    >

                        Presente

                    </button>

                    <button
                        className="bg-yellow-100 text-yellow-700 rounded-lg px-3 py-1"
                        onClick={() => onActualizarEstado(asistencia.id, 2)}
                    >

                        Tarde

                    </button>

                    <button
                        className="bg-red-100 text-red-700 rounded-lg px-3 py-1"
                        onClick={() => onActualizarEstado(asistencia.id, 3)}
                    >

                        Ausente

                    </button>

                </div>

            </td>

        </tr>

    )

}