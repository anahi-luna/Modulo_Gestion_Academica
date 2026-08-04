from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.asistencia_controller import *

asistencia_bp = Blueprint("asistencia_bp", __name__)

# Crear asistencia
asistencia_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.asistencias.crear")(agregar_asistencias)
)

# Obtener todas las asistencias
asistencia_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.asistencias.leer")(get_lista_de_asistencias)
)

# Obtener la asistencia del alumno autenticado para una clase
asistencia_bp.route("/mi-asistencia/<int:id_clase>", methods=["GET"])(
    requires_permission("inscripcion.asistencias.leer")(obtener_mi_asistencia)
)

# Obtener una asistencia
asistencia_bp.route("/<int:id_asistencia>", methods=["GET"])(
    requires_permission("inscripcion.asistencias.leer")(get_asistencia)
)

# Modificar una asistencia
asistencia_bp.route("/<int:id_asistencia>", methods=["PUT"])(
    requires_permission("inscripcion.asistencias.actualizar")(actualizar_asistencia)
)

# Solo por desarrollo eliminar asistencia
asistencia_bp.route("/<int:id_asistencia>", methods=["DELETE"])(
    requires_permission("inscripcion.asistencias.eliminar")(
        eliminar_asistencia_controller
    )
)
