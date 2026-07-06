export default function ClaseCard({

    nombre,
    fecha,
    cantidad,
    seleccionada

}){

    return(

        <div
            className={`

            border rounded-xl p-4 cursor-pointer transition

            ${

                seleccionada

                ? "bg-red-50 border-red-500"

                : "hover:bg-gray-50"

            }

            `}
        >

            <h3 className="font-semibold">

                {nombre}

            </h3>

            <p className="text-sm text-gray-500 mt-1">

                {fecha}

            </p>

            <span
                className="inline-block mt-3 bg-gray-100 rounded-full px-2 py-1 text-xs"
            >

                {cantidad} comisiones

            </span>

        </div>

    )

}