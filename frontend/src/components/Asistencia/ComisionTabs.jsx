export default function ComisionTabs({
    comisionSeleccionada,
    setComisionSeleccionada
}){

    return(

        <div className="flex border-b">

            <button
                className="px-6 py-4 border-b-2 border-red-600 text-red-700 font-semibold"
                onClick={() => setComisionSeleccionada(1)}
            >

                Comisión A

            </button>

            <button
                className="px-6 py-4 text-gray-500"
                onClick={() => setComisionSeleccionada(2)}
            >

                Comisión B

            </button>

            <button
                className="px-6 py-4 text-gray-500"
                onClick={() => setComisionSeleccionada(3)}
            >

                Comisión C

            </button>

        </div>

    )

}