// Simula tiempo de respuesta
const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));


const LEGAJOS = [

  {
    id_legajo: 1,
    numero_legajo: "000123",
    nombre: "Juan",
    apellido: "Pérez",
    activo: true,
    rango: "Bombero",
    materias_aprobadas: []
  },

  {
    id_legajo: 2,
    numero_legajo: "000124",
    nombre: "Ana",
    apellido: "Gómez",
    activo: true,
    rango: "Suboficial Mayor",
    materias_aprobadas: [1]
  },

  {
    id_legajo: 3,
    numero_legajo: "000125",
    nombre: "Carlos",
    apellido: "López",
    activo: false,
    rango: "Cabo",
    materias_aprobadas: [1, 2]
  },
  {
    id_legajo: 4,
    numero_legajo: "000126",
    nombre: "María",
    apellido: "Suárez",
    activo: true,
    rango: "Sargento",
    materias_aprobadas: [1]
  },
  {
    id_legajo: 5,
    numero_legajo: "000127",
    nombre: "Pedro",
    apellido: "Fernández",
    activo: true,
    rango: "Cabo",
    materias_aprobadas: []
  }

];

export async function getLegajo(nroLegajo) {
  await delay();

  const legajo = LEGAJOS.find(
    (l) => l.numero_legajo === nroLegajo
  );

  if (!legajo) {
    throw new Error(`No se encontró el legajo ${nroLegajo}`);
  }

  return {
    status: "success",
    data: legajo,
    message: "Legajo obtenido correctamente",
  };
}

export async function getLegajoPorId(idLegajo) {

    await delay();

    const legajo = LEGAJOS.find(
        l => l.id_legajo === idLegajo
    );

    if (!legajo) {
        throw new Error(`No existe el legajo ${idLegajo}`);
    }

    return {
        status: "success",
        data: legajo,
        message: "Legajo obtenido correctamente"
    };

}