import { useEffect, useState } from "react";
import IntegranteRow from "./IntegranteRow";
import {modificarAsistencia, obtenerAsistenciasPorClase} from "../../Services/asistenciaAdminService";

export default function AsistenciaTabla({idClase}) {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {

    if(idClase){
      cargarAsistencias();
    } else{
      setAsistencias([]);
    }
    
  }, [idClase]);

  async function cargarAsistencias() {
    try{

      const resultado = await obtenerAsistenciasPorClase(idClase);
      setAsistencias(resultado);

    }catch(error){

      console.error(error);

    }
    
  }
  
  async function actualizarEstado(idAsistencia, idEstado) {
    try{

      await modificarAsistencia(idAsistencia, idEstado);
      cargarAsistencias();

    }catch(error){

      console.error(error);

    }
    
  }

  return (
    <div className="px-6 pb-6">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Integrante</th>
            <th className="text-left">DNI</th>
            <th className="text-left">Asistencia</th>
          </tr>
        </thead>

        <tbody>
          {asistencias.map((a) => (
            <IntegranteRow
              key={a.id}
              asistencia={a}
              onActualizarEstado={actualizarEstado}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}