const DIAS_SEMANA = { Lu: 1, Ma: 2, Mi: 3, Ju: 4, Vi: 5, Sa: 6, Do: 0 };
const NOMBRES_DIA = { 0: "Do", 1: "Lu", 2: "Ma", 3: "Mi", 4: "Ju", 5: "Vi", 6: "Sa" };

const MODALIDAD_REGEX = /^((?:(?:Lu|Ma|Mi|Ju|Vi|Sa|Do)\s*)+)(\d{2}:\d{2})\s*a\s*(\d{2}:\d{2})\s*hs$/;

// Interpreta el campo `modalidad` de la comisión (ej: "Lu Mi 18:00 a 20:00 hs")
// y devuelve los días de cursada permitidos y el horario esperado.
function parsearModalidad(modalidad) {

    if (!modalidad) return null;

    const match = MODALIDAD_REGEX.exec(modalidad.trim());

    if (!match) return null;

    const dias = match[1]
        .trim()
        .split(/\s+/)
        .map((d) => DIAS_SEMANA[d])
        .filter((d) => d !== undefined);

    return {
        dias,
        horaInicio: match[2],
        horaFin: match[3],
    };
}

// Valida que la fecha y el horario elegidos coincidan
// con la modalidad de cursada de la comisión.
export function validarContraModalidad(fecha, horaInicio, horaFin, comision) {

    const modalidad = parsearModalidad(comision?.modalidad);

    if (!modalidad) {
        return "La comisión no posee una modalidad de cursada configurada correctamente.";
    }

    // fecha viene como "AAAA-MM-DD" del input type="date".
    // Se arma como fecha local (no UTC) para no correr el día por husos horarios.
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaLocal = new Date(anio, mes - 1, dia);
    const diaSemana = fechaLocal.getDay();

    if (!modalidad.dias.includes(diaSemana)) {

        const diasLegibles = modalidad.dias.map((d) => NOMBRES_DIA[d]).join(", ");

        return `La fecha elegida (${NOMBRES_DIA[diaSemana]}) no coincide con los días de cursada de la comisión (${diasLegibles}).`;
    }

    if (horaInicio !== modalidad.horaInicio || horaFin !== modalidad.horaFin) {

        return `El horario debe coincidir con el de la comisión (${modalidad.horaInicio} a ${modalidad.horaFin} hs).`;
    }

    return null;
}