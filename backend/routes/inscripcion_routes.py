from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.inscripcion_controllers import *

inscripcion_bp = Blueprint("inscripcion_bp", __name__)

# Crear una o varias inscripciones
inscripcion_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.inscripciones.crear")(agregar_inscripcion)
)

# Obtener todas las inscripciones
inscripcion_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.inscripciones.leer")(get_lista_de_inscripciones)
)

# Obtener una inscripción por ID
inscripcion_bp.route("/<int:id_inscripcion>", methods=["GET"])(
    requires_permission("inscripcion.inscripciones.leer")(get_inscripcion)
)

# Actualizar inscripción
inscripcion_bp.route("/<int:id_inscripcion>", methods=["PUT"])(
    requires_permission("inscripcion.inscripciones.actualizar")(actualizar_inscripcion)
)

# Eliminar inscripción
inscripcion_bp.route("/<int:id_inscripcion>", methods=["DELETE"])(
    requires_permission("inscripcion.inscripciones.eliminar")(inscripcion_eliminada)
)