import IntegranteRow from "./IntegranteRow";

export default function TablaAsistencia(){

    return(

        <div className="px-6 pb-6">

            <table className="w-full">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-3">

                            Integrante

                        </th>

                        <th className="text-left">

                            DNI

                        </th>

                        <th className="text-left">

                            Asistencia

                        </th>

                    </tr>

                </thead>

                <tbody>

                    <IntegranteRow
                        nombre="Juan Pérez"
                        dni="38124556"
                    />

                    <IntegranteRow
                        nombre="Lucas Romero"
                        dni="41880221"
                    />

                </tbody>

            </table>

        </div>

    )

}