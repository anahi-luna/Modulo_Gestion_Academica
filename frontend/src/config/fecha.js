// Esta función evita el problema tomando el año/mes/día directamente
// del string, sin crear un Date en UTC. Así la fecha que se muestra
// es siempre la fecha real cargada, sin depender de la zona horaria.
export function formatearFecha(fecha) {

    if (!fecha) return "";

    const soloFecha = String(fecha).split("T")[0];
    const [anio, mes, dia] = soloFecha.split("-");

    if (!anio || !mes || !dia) return "";

    return `${dia}/${mes}/${anio}`;

}