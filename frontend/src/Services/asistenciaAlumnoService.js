import { getAsistenciasPorLegajo } from "../mocks/misAsistenciasMock";
import { getClases } from "../mocks/clasesMock";
import { getComisiones } from "../mocks/comisionesMock";

export async function obtenerMiAsistencia(idLegajo) {
  const [asistenciasRes, clasesRes, comisionesRes] = await Promise.all([
    getAsistenciasPorLegajo(idLegajo),
    getClases(),
    getComisiones(),
  ]);

  const asistencias = asistenciasRes.data;
  const clases = clasesRes.data;
  const comisiones = comisionesRes.data;

  const idsComisiones = [...new Set(asistencias.map((a) => a.id_comision))];

  const clasesDelAlumno = clases
    .filter((c) => idsComisiones.includes(c.id_comision))
    .map((clase) => {
      const comision = comisiones.find((c) => c.id === clase.id_comision);
      const asistencia = asistencias.find((a) => a.id_clase === clase.id_clase);
      return {
        id_clase: clase.id_clase,
        fecha: clase.fecha,
        hora_inicio: clase.hora_inicio,
        hora_fin: clase.hora_fin,
        lugar: clase.lugar,
        comision: comision?.codigo ?? "-",
        materia: comision?.materia ?? "-",
        estado: asistencia?.estado ?? "Pendiente",
        observacion: asistencia?.observacion ?? "",
      };
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const registradas = clasesDelAlumno.filter((c) => c.estado !== "Pendiente");
  const presentes = registradas.filter((c) => c.estado === "Presente").length;
  const tardes = registradas.filter((c) => c.estado === "Tarde").length;
  const ausentes = registradas.filter((c) => c.estado === "Ausente").length;
  const porcentaje =
    registradas.length > 0
      ? Math.round(((presentes + tardes) / registradas.length) * 100)
      : null;

  return {
    clases: clasesDelAlumno,
    resumen: { total: registradas.length, presentes, tardes, ausentes, porcentaje },
  };
}