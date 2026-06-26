const [inscripciones,    setInscripciones]    = useState([]);
const [inscripcionEdit,  setInscripcionEdit]  = useState(null);
const [inscripcionRechazo,   setInscripcionRechazo]   = useState(null);
const [saving,         setSaving]         = useState(false);



const handleAceptar = (insc) => {
    setInscripcionEdit(insc);
    setConfirmAbierto(true);
  };

  const handleRechazarClick = (insc) => {
    setLocalidadDel(insc);
    setConfirmAbierto(true);
  };

function colorEstado(estado) {
    switch(estado){
        case "APROBADA":
            return "bg-green-100 text-green-700 ring-green-600/20";

        case "PENDIENTE":
            return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";

        case "RECHAZADA":
            return "bg-red-100 text-red-700 ring-red-600/20";

        default:
            return "bg-gray-100 text-gray-700 ring-gray-600/20";

    }

        
        
}
export default function Example() {
  return (
    <ul role="list" className="divide-y divide-gray-100">
        <div className="flex min-w-0 gap-x-6">
            <div className="min-w-0">
                <p className="text-xs text-gray-500">N° Legajo</p>
                <p className="text-sm font-semibold text-gray-900">
                    {person.legajo}
                </p>
            </div>

            <div className="min-w-0">
                <p className="text-xs text-gray-500">Usuario</p>
                <p className="text-sm font-semibold text-gray-900">
                    {person.usuario}
                </p>
            </div>
        </div>
          <div className="hidden shrink-0 sm:flex sm:items-center sm:gap-2">
            <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorEstado(inscripcion.estado)}`}
            >
                {inscripcion.estado}
            </span>

            <button
                onClick={() => handleAceptar()}
                    className="px-3 py-1.5 rounded-md bg-green-100 hover:bg-green-200
                        dark:bg-green-900 text-green-700 dark:text-white-300
                        text-xs transition-colors"
                    >
                 Aceptar
            </button>
            <button
                onClick={() => handleRechazar()}
                    className="px-3 py-1.5 rounded-md bg-red-100 hover:bg-red-200
                        dark:bg-red-900 text-red-700 dark:text-white-300
                        text-xs transition-colors"
                    >
                 Rechazar
            </button>
          </div>
        
    </ul>
  )
}