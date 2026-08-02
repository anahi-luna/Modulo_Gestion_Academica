from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.evaluacion_controller import *

evaluacion_bp = Blueprint("evaluacion_bp", __name__)

# Crear evaluación
evaluacion_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.evaluaciones.crear")(agregar_evaluacion)
)

# Obtener todas las evaluaciones
evaluacion_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.evaluaciones.leer")(get_lista_de_evaluaciones)
)

# Obtener una evaluación
evaluacion_bp.route("/<int:id_evaluacion>", methods=["GET"])(
    requires_permission("inscripcion.evaluaciones.leer")(get_evaluacion)
)

# Modificar una evaluación
evaluacion_bp.route("/<int:id_evaluacion>", methods=["PUT"])(
    requires_permission("inscripcion.evaluaciones.actualizar")(actualizar_evaluacion)
)

# Eliminar una evaluación
evaluacion_bp.route("/<int:id_evaluacion>", methods=["DELETE"])(
    requires_permission("inscripcion.evaluaciones.eliminar")(eliminar_evaluacion_controller)
)