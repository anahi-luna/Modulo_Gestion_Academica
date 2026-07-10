from flask import Blueprint

from controllers.asistencia_controller import *

asistencia_bp = Blueprint("asistencia_bp",__name__)

# Crear asistencia
asistencia_bp.route("/",methods=["POST"])(agregar_asistencias)

# Obtener todas las asistencias
asistencia_bp.route("/",methods=["GET"])(get_lista_de_asistencias)

# Obtener una asistencia
asistencia_bp.route( "/<int:id_asistencia>",methods=["GET"])(get_asistencia)

# Modificar una asistencia
asistencia_bp.route( "/<int:id_asistencia>",methods=["PUT"])(actualizar_asistencia)
