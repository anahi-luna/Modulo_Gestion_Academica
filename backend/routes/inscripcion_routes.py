from flask import Blueprint
from controllers.inscripcion_controllers import *

# Blueprint del módulo Inscripción
inscripcion_bp = Blueprint('inscripcion_bp',__name__)

# Crear una o varias inscripciones
inscripcion_bp.route('/', methods =['POST'])(agregar_inscripcion)

# Obtener todas las inscripciones
inscripcion_bp.route('/', methods =['GET'])(get_lista_de_inscripciones)

# Obtener una inscripción por ID
inscripcion_bp.route('/<int:id_inscripcion>', methods =['GET'])(get_inscripcion)

# Actualizar inscripción
inscripcion_bp.route('/<int:id_inscripcion>', methods =['PUT'])(actualizar_inscripcion)

# Eliminar inscripción
inscripcion_bp.route('/<int:id_inscripcion>', methods =['DELETE'])(inscripcion_eliminada)