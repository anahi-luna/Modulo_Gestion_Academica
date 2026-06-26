from flask import Blueprint
from controllers.inscripcion_controllers import *

# Blueprint del módulo Inscripción
inscripcion_bp = Blueprint("inscripcion_bp",__name__)


# Obtener todas las inscripciones
inscripcion_bp.route("/", methods =["GET"])(get_lista_de_inscripciones)

# Obtener una inscripción por ID
inscripcion_bp.route("/<int:id_inscripcion>", methods =["GET"])(get_inscripcion)

# Crear una o varias inscripciones
inscripcion_bp.route("/", methods =["POST"])(agregar_inscripciones)

# Actualizar inscripción
inscripcion_bp.route("/<int:id_inscripcion>", methods =["PATCH"])(actualizar_inscripcion)

# Eliminar inscripción
inscripcion_bp.route("/<int:id_inscripcion>", methods =["DELETE"])(inscripcion_eliminada)