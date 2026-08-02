from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.calificacion_controller import *

calificacion_bp = Blueprint("calificacion_bp", __name__)

# Crear calificación
calificacion_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.calificaciones.crear")(agregar_calificaciones)
)

# Obtener todas las calificaciones
calificacion_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.calificaciones.leer")(get_lista_de_calificaciones)
)

# Obtener una calificación
calificacion_bp.route("/<int:id_calificacion>", methods=["GET"])(
    requires_permission("inscripcion.calificaciones.leer")(get_calificacion)
)

# Modificar una calificación
calificacion_bp.route("/<int:id_calificacion>", methods=["PUT"])(
    requires_permission("inscripcion.calificaciones.actualizar")(actualizar_calificacion)
)

# Eliminar una calificación
calificacion_bp.route("/<int:id_calificacion>", methods=["DELETE"])(
    requires_permission("inscripcion.calificaciones.eliminar")(eliminar_calificacion_controller)
)