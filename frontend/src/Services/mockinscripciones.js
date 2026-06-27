// ============================================================
// Simula las respuestas del back, después reemplazamos estas funciones por
// llamadas reales a fetch().
// ============================================================


// Comisiones disponibles (cada una tiene cupo, materia, etc)
const COMISIONES = [
  {
    id: 1,
    codigo: "COM-101-A",
    materia: "Matafuegos I",
    docente: "Prof. García",
    cupo_maximo: 30,
    cupo_ocupado: 28,
    horario: "Lunes 18:00 - 21:00",
    correlativas: [],           // Sin correlativas: cualquiera puede inscribirse
    rango_minimo: null,         //CUALQUIERA puede inscribirse
  },
  {
    id: 2,
    codigo: "COM-202-B",
    materia: "Matafuegos II",
    docente: "Prof. López",
    cupo_maximo: 25,
    cupo_ocupado: 10,
    horario: "Miércoles 18:00 - 21:00",
    correlativas: [1],          // Requiere haber aprobado Matafuegos I (id=1)
    rango_minimo: "Cabo",       
  },
  {
    id: 3,
    codigo: "COM-303-C",
    materia: "Primeros auxilios",
    docente: "Prof. Martínez",
    cupo_maximo: 20,
    cupo_ocupado: 20,           // Sin cupo disponible
    horario: "Viernes 17:00 - 20:00",
    correlativas: [1, 2], // Requiere haber aprobado Matafuegos I y II
    rango_minimo: "Sargento",
  },
];

// Rangos disponibles en el sistema de bomberos
const RANGOS = [
  "Aspirante",
  "Bombero",
  "Cabo",
  "Sargento",
  "Suboficial Mayor",
  "Oficial",
];

// Materias aprobadas (para validar correlativas)
const MATERIAS_APROBADAS_POR_LEGAJO = {
  "000125": [1],        // Aprobó Matafuegos I
  "000124": [1, 2],     // Aprobó las dos primeras
  "000123": [],         // No aprobó nada aún
};

// Rango del legajo (para validar rango mínimo)
const RANGO_POR_LEGAJO = {
  "000125": "Suboficial Mayor",
  "000124": "Sargento Primero",
  "000123": "Cabo",
};

// Inscripciones ya registradas (para mostrar historial)
let INSCRIPCIONES = [
  {
    id: 1,
    id_legajo: "000124",
    id_comision: 2,
    fecha_inscripcion: "2026-15-03 10:30:00",
    estado: "Aceptada",
  },
];

// -------------------------------------------------------
// Función auxiliar: simula un delay de red (200-500ms) para que haga qe cargue
// -------------------------------------------------------
const delay = (ms = 300) =>
  new Promise((res) => setTimeout(res, ms + Math.random() * 200));

// -------------------------------------------------------
// Función auxiliar: genera un número de legajo aleatorio
// de 6 dígitos con ceros a la izquierda. Ejemplo: "000847"
// -------------------------------------------------------
export function generarNroLegajoAleatorio() {
  const num = Math.floor(Math.random() * 999) + 100; // entre 100 y 1099
  return String(num).padStart(6, "0");
}

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

// -------------------------------------------------------
// Busca un legajo por número. Si no existe devuelve error.
// -------------------------------------------------------
export async function getLegajo(nroLegajo) {
  await delay();

  // Verificamos si el legajo existe en nuestros datos mock
  const existe = RANGO_POR_LEGAJO[nroLegajo] !== undefined;

  if (!existe) {
    // Simulamos respuesta de error del servidor
    throw new Error(`No se encontró el legajo ${nroLegajo}`);
  }

  return {
    status: "success",
    data: {
      nro_legajo: nroLegajo,
      nombre: "Juan Pablo",         
      apellido: "González",
      rango: RANGO_POR_LEGAJO[nroLegajo],
      materias_aprobadas: MATERIAS_APROBADAS_POR_LEGAJO[nroLegajo] || [],
    },
    message: "Legajo obtenido correctamente",
  };
}

// -------------------------------------------------------
// POST /inscripciones
//   1. Verifica cupo disponible
//   2. Valida rango mínimo
//   3. Valida correlativas
// Devuelve el estado final: Aceptada o Rechazada
// -------------------------------------------------------
export async function postInscripcion({ nro_legajo, id_comision }) {
  await delay(600); // Un poco más lento para simular procesamiento

  const comision = COMISIONES.find((c) => c.id === id_comision);
  if (!comision) throw new Error("Comisión no encontrada");

  const legajoData = await getLegajo(nro_legajo).then((r) => r.data);

  // Paso 1: ¿Hay cupo disponible?
  const hayCupo = comision.cupo_ocupado < comision.cupo_maximo;
  if (!hayCupo) {
    return _respuestaRechazada(nro_legajo, id_comision, "Sin cupo disponible");
  }

  // Paso 2: ¿Cumple el rango mínimo?
  if (comision.rango_minimo) {
    const indexRangoAlumno = RANGOS.indexOf(legajoData.rango);
    const indexRangoReq    = RANGOS.indexOf(comision.rango_minimo);
    if (indexRangoAlumno < indexRangoReq) {
      return _respuestaRechazada(
        nro_legajo,
        id_comision,
        `Rango insuficiente. Requiere: ${comision.rango_minimo}`,
      );
    }
  }

  // Paso 3: ¿Cumple las correlativas?
  if (comision.correlativas.length > 0) {
    const aprobadas = legajoData.materias_aprobadas;
    const cumple = comision.correlativas.every((id) => aprobadas.includes(id));
    if (!cumple) {
      return _respuestaRechazada(
        nro_legajo,
        id_comision,
        "No cumple las correlativas requeridas",
      );
    }
  }

  // Todo OK, aceptada
  const nueva = {
    id: INSCRIPCIONES.length + 1,
    id_legajo: nro_legajo,
    id_comision,
    fecha_inscripcion: new Date().toISOString(),
    estado: "Aceptada",
  };
  INSCRIPCIONES.push(nueva);
  comision.cupo_ocupado += 1; // Actualizamos el cupo 

  return {
    status: "success",
    data: {
      ...nueva,
      comision: comision.codigo,
      materia: comision.materia,
      motivo: null,
    },
    message: "Inscripción aceptada correctamente",
  };
}

// -------------------------------------------------------
// Devuelve el historial de inscripciones de un legajo
// -------------------------------------------------------
export async function getInscripcionesPorLegajo(nroLegajo) {
  await delay();

  const resultado = INSCRIPCIONES.filter((i) => i.id_legajo === nroLegajo).map(
    (i) => {
      const com = COMISIONES.find((c) => c.id === i.id_comision);
      return {
        ...i,
        comision: com?.codigo || "-",
        materia: com?.materia || "-",
        horario: com?.horario || "-",
      };
    },
  );

  return {
    status: "success",
    data: resultado,
    total: resultado.length,
    message: "Historial de inscripciones obtenido",
  };
}

// -------------------------------------------------------
//respuesta de inscripción rechazada
// -------------------------------------------------------
function _respuestaRechazada(nro_legajo, id_comision, motivo) {
  const rechazada = {
    id: INSCRIPCIONES.length + 1,
    id_legajo: nro_legajo,
    id_comision,
    fecha_inscripcion: new Date().toISOString(),
    estado: "Rechazada",
  };
  INSCRIPCIONES.push(rechazada);

  return {
    status: "success",      
    data: {
      ...rechazada,
      comision: COMISIONES.find((c) => c.id === id_comision)?.codigo || "-",
      materia: COMISIONES.find((c) => c.id === id_comision)?.materia || "-",
      motivo,
    },
    message: `Inscripción rechazada: ${motivo}`,
  };
}
