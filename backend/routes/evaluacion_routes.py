from flask import Blueprint

from controllers.evaluacion_controller import *

evaluacion_bp = Blueprint("evaluacion_bp",__name__)

# Crear clase
evaluacion_bp.route("/",methods=["POST"])(agregar_evaluacion)

# Obtener todas las clases
evaluacion_bp.route("/",methods=["GET"])(get_lista_de_evaluaciones)

# Obtener una clase
evaluacion_bp.route( "/<int:id_evaluacion>",methods=["GET"])(get_evaluacion)

# Modificar una clase
evaluacion_bp.route( "/<int:id_evaluacion>",methods=["PUT"])(actualizar_evaluacion)

# Eliminar una clase
evaluacion_bp.route("/<int:id_evaluacion>",methods=["DELETE"])(eliminar_evaluacion_controller)