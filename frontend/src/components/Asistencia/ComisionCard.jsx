export default function ComisionCard({

    comision,
    seleccionada,
    onClick,

}){

    return(

        <div
            onClick={onClick}
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
                {comision.materia}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
                {comision.codigo}
            </p>

            <p className="text-sm text-gray-500">
                {comision.docente}
            </p>

        </div>

    )

}