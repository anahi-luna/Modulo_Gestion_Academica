export default function EstadisticaCard({

    titulo,
    cantidad

}){

    return(

        <div className="bg-white border rounded-xl shadow-sm p-5">

            <p className="text-gray-500">

                {titulo}

            </p>

            <h2 className="text-4xl font-bold mt-2">

                {cantidad}

            </h2>

        </div>

    )

}