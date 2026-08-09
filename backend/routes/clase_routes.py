from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.clase_controllers import *

clase_bp = Blueprint("clase_bp", __name__)

# Crear clase
clase_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.clases.crear")(agregar_clase)
)

# Obtener todas las clases
clase_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.clases.leer")(get_lista_de_clases)
)

# Obtener una clase
clase_bp.route("/<int:id_clase>", methods=["GET"])(
    requires_permission("inscripcion.clases.leer")(get_clase)
)

# Obtener las clases del alumno autenticado
clase_bp.route("/mis-clases", methods=["GET"])(
    requires_permission("inscripcion.clases.leer_propio")(obtener_mis_clases)
)

# Modificar una clase
clase_bp.route("/<int:id_clase>", methods=["PUT"])(
    requires_permission("inscripcion.clases.actualizar")(actualizar_clase)
)

# Eliminar una clase
clase_bp.route("/<int:id_clase>", methods=["DELETE"])(
    requires_permission("inscripcion.clases.eliminar")(eliminar_clase_controller)
)