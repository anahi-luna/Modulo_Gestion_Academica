export default function Alert ({
    tipo = "info",
    titulo,
    mensaje,
    onCerrar,
}){
    const estilos = {
        success: "bg-green-50 border-green-500 text-green-700",
        error: "bg-red-50 border-red-500 text-red-700",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
        info: "bg-blue-50 border-blue-500 text-blue-700",
    };

    return(
        <div className={`rounded-x1 border-1-4 p-4 ${estilos[tipo]}`}
            
        >
            <div className="flex justify-between items-start">
                <div>
                    {titulo &&(
                        <h3 classname= "font-semibold">
                            {titulo}
                        </h3>
                    )}

                    <p className="text-sm mt-1">
                        {mensaje}
                    </p>
                </div>

                {onCerrar &&(
                    <button 
                        onClick={onCerrar}
                        className="m1-4 text-lg"
                    >
                        x
                    </button>
                )}
            </div>
        </div>
    );
}