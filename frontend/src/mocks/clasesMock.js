
const delay = (ms = 300) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const CLASES = [
  {
    id_clase: 1,
    id_comision: 1,
    fecha: "2026-07-02",
    hora_inicio: "09:00",
    hora_fin: "12:00",
    lugar: "Sede Central",
  },
  {
    id_clase: 2,
    id_comision: 1,
    fecha: "2026-07-09",
    hora_inicio: "09:00",
    hora_fin: "12:00",
    lugar: "Sede Central",
  },
  {
    id_clase: 3,
    id_comision: 2,
    fecha: "2026-07-03",
    hora_inicio: "18:00",
    hora_fin: "21:00",
    lugar: "Anexo Norte",
  },
   {
    id_clase: 4,
    id_comision: 1,
    fecha: "2026-07-16",
    hora_inicio: "09:00",
    hora_fin: "12:00",
    lugar: "Sede Central",
  },
  {
    id_clase: 5,
    id_comision: 1,
    fecha: "2026-07-23",
    hora_inicio: "09:00",
    hora_fin: "12:00",
    lugar: "Sede Central",
  },
];

export async function getClases() {
  await delay();

  return {
    status: "success",
    data: CLASES,
    total: CLASES.length,
    message: "Legajo obtenido correctamente",
  };
}

export async function getClasePorId(idClase) {
    await delay();

    const clase = CLASES.find(
        cl => cl.id_clase === idClase
    );

    if (!idClase) {
        throw new Error(`No existe la clase ${idClase}`);
    }

    return {
        status: "success",
        data: clase,
        message: "Clase obtenida correctamente"
    };
}
