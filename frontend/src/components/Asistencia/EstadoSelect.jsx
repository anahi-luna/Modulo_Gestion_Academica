//function colorEstado(idEstado) {
//    switch (idEstado) {
//        case 1:
//            return "border-green-400 bg-green-50 text-green-700";
//
//        case 2:
//            return "border-red-400 bg-red-50 text-red-700";
//
//        case 3:
//            return "border-blue-400 bg-blue-50 text-blue-700";
//
//        case 4:
//            return "border-orange-400 bg-orange-50 text-orange-700";
//
//        default:
//            return "border-gray-300 bg-white text-gray-700";
//    }
//}


//${colorEstado(idEstado)} esto va dentro del className en caso de agregarlo


export default function EstadoSelect({
    idEstado,
    onCambiarEstado,
    soloLectura = false,
}) {

    return (

        <select
            disabled={soloLectura}
            value={idEstado ?? ""}
            onChange={(e) =>
                onCambiarEstado(Number(e.target.value))
            }
            className={`
                w-full max-w-56 rounded-lg border px-3 py-2
                text-sm font-medium outline-none transition
                focus:ring-2 focus:ring-red-100
                
            `}
        >
            <option value="" disabled hidden>Seleccionar estado</option>
            <option value={1}>Presente</option>
            <option value={2}>Ausente</option>
            <option value={3}>Justificado</option>
            <option value={4}>Tarde</option>
        </select>

    );

}