// Simula el tiempo de respuesta del servidor
const delay = (ms = 300) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Comisiones disponibles (cada una tiene cupo, materia, etc)
const COMISIONES = [
    {
        id: 1,
        codigo: "COM-101-A",
        materia: "Matafuegos I",
        docente: "Prof. García",
        cupo: 30,
        inscriptos: 28,
        horario: "Lunes 18:00 - 21:00",
        correlativas: [],           // Sin correlativas: cualquiera puede inscribirse
        rango_minimo: null,         //CUALQUIERA puede inscribirse
    },
    {
        id: 2,
        codigo: "COM-202-B",
        materia: "Matafuegos II",
        docente: "Prof. López",
        cupo: 25,
        inscriptos: 10,
        horario: "Miércoles 18:00 - 21:00",
        correlativas: [1],          // Requiere haber aprobado Matafuegos I (id=1)
        rango_minimo: "Cabo",
    },
    {
        id: 3,
        codigo: "COM-303-C",
        materia: "Primeros auxilios",
        docente: "Prof. Martínez",
        cupo: 20,
        inscriptos: 20,           // Sin cupo disponible
        horario: "Viernes 17:00 - 20:00",
        correlativas: [1, 2], // Requiere haber aprobado Matafuegos I y II
        rango_minimo: "Sargento",
    },
    {
        id: 4,
        codigo: "COM-401-D",
        materia: "Rescate Vehicular",
        docente: "Prof. Benítez",
        cupo: 25,
        inscriptos: 8,
        horario: "Martes 18:00 - 21:00",
        correlativas: [1],
        rango_minimo: "Bombero",
    },

    {
        id: 5,
        codigo: "COM-402-E",
        materia: "Materiales Peligrosos",
        docente: "Prof. Díaz",
        cupo: 20,
        inscriptos: 15,
        horario: "Jueves 18:00 - 21:00",
        correlativas: [1, 2],
        rango_minimo: "Cabo",
    },

    {
        id: 6,
        codigo: "COM-403-F",
        materia: "Incendios Forestales",
        docente: "Prof. Romero",
        cupo: 25,
        inscriptos: 5,
        horario: "Sábado 09:00 - 12:00",
        correlativas: [],
        rango_minimo: null,
    },

    {
        id: 7,
        codigo: "COM-404-G",
        materia: "Rescate en Altura",
        docente: "Prof. Sánchez",
        cupo: 15,
        inscriptos: 7,
        horario: "Viernes 19:00 - 22:00",
        correlativas: [1, 2],
        rango_minimo: "Suboficial Mayor",
    },

    {
        id: 8,
        codigo: "COM-405-H",
        materia: "Emergencias Químicas",
        docente: "Prof. Morales",
        cupo: 20,
        inscriptos: 18,
        horario: "Lunes 15:00 - 18:00",
        correlativas: [1],
        rango_minimo: "Sargento",
    },

    {
        id: 9,
        codigo: "COM-406-I",
        materia: "Comando de Incidentes",
        docente: "Prof. Fernández",
        cupo: 30,
        inscriptos: 6,
        horario: "Miércoles 08:00 - 11:00",
        correlativas: [1, 2],
        rango_minimo: "Suboficial Mayor",
    }
];

// -------------------------------------------------------
// Devuelve todas las comisiones disponibles
// -------------------------------------------------------
export async function getComisiones() {
    await delay();
    return {
        status: "success",
        data: COMISIONES,
        total: COMISIONES.length,
        message: "Lista de comisiones obtenida",
    };
}