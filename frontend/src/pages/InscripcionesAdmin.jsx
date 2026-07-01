import { useEffect, useState } from "react";
import InscripcionCard from "../components/inscripciones/InscripcionCard";
import ModalEliminarInscripcion from "../components/inscripciones/ModalEliminarInscripcion";
import ModalValidarInscripcion from "../components/inscripciones/ModalValidarInscripcion";

import {
  obtenerInscripciones,
  actualizarSolicitud,
  eliminarSolicitud,
  obtenerComisiones
} from "../services/inscripcionesAdminService";

/*
 * Pantalla de administración de inscripciones.
 * Permite visualizar las solicitudes pendientes,
 * validarlas o eliminarlas.
 */
export default function InscripcionesAdmin() {
  const [inscripciones, setInscripciones] = useState([]);
  const [error, setError] = useState(null);
  const [modalValidar, setModalValidar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [comisiones, setComisiones] = useState([]);

  // Carga las inscripciones pendientes al iniciar la pantalla.
  useEffect(() => {
    cargarInscripciones();
  }, []);

  /*
   * Obtiene las inscripciones y las comisiones
   * disponibles para el proceso de validación.
   */
  async function cargarInscripciones() {
    try {
      const data = await obtenerInscripciones();
      // Solo muestra las PENDIENTES
      setInscripciones(data.filter(i => i.estado === "Pendiente"));

      const listaComisiones = await obtenerComisiones();
      setComisiones(listaComisiones);
    } catch (error) {
      setError(error.message);
    }
  }

  // Abre el modal de validación.
  function abrirModalValidar(inscripcion) {
    setInscripcionSeleccionada(inscripcion);
    setModalValidar(true);
  }

  // Abre el modal de eliminación.
  function abrirModalEliminar(inscripcion) {
    setInscripcionSeleccionada(inscripcion);
    setModalEliminar(true);
  }

  // Guarda los cambios realizados sobre la inscripción.
  async function guardarCambios(datos) {
    try {
      await actualizarSolicitud(inscripcionSeleccionada.id, datos);

      setModalValidar(false);
      setInscripcionSeleccionada(null);
      cargarInscripciones();
    }
    catch (err) {
      setError(err.message);
    }
  }

  // Elimina la inscripción seleccionada.
  async function confirmarEliminar() {
    try {

      await eliminarSolicitud(inscripcionSeleccionada.id);

      setModalEliminar(false);
      setInscripcionSeleccionada(null);
      cargarInscripciones();

    }
    catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Gestionar inscripciones</h1>

      {/* Mensaje de confirmación */}
      {error && (
        <div className="mb-5 rounded-lg bg-red-100 border border-red-300 p-3 text-red-700">
          {error}
        </div>
      )}

      {inscripciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-gray-400 text-sm">
          No hay inscripciones pendientes.
        </div>
      ) : (
        <div className="space-y-4">
          {inscripciones.map((ins) => (
            <InscripcionCard
              key={ins.id}
              inscripcion={ins}
              onValidar={abrirModalValidar}
              onEliminar={abrirModalEliminar}
            />
          ))}
        </div>
      )}
      <ModalValidarInscripcion 
        abierto={modalValidar}
        inscripcion={inscripcionSeleccionada}
        onCerrar={()=>{
          setModalValidar(false);
          setInscripcionSeleccionada(null);
        }}
        onGuardar={guardarCambios}
        comisiones={comisiones}
      />
      <ModalEliminarInscripcion
          abierto={modalEliminar}
          inscripcion={inscripcionSeleccionada}
          onCerrar={()=>{
            setModalEliminar(false);
            setInscripcionSeleccionada(null);
          }}      
          onConfirmar={confirmarEliminar}
      />
    </div>
  );
}