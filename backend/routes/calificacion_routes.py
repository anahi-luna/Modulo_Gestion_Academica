from flask import Blueprint

from controllers.calificacion_controller import *

calificacion_bp = Blueprint("calificacion_bp",__name__)

# Crear clase
calificacion_bp.route("/",methods=["POST"])(agregar_calificaciones)

# Obtener todas las clases
calificacion_bp.route("/",methods=["GET"])(get_lista_de_calificaciones)

# Obtener una clase
calificacion_bp.route( "/<int:id_calificacion>",methods=["GET"])(get_calificacion)

# Modificar una clase
calificacion_bp.route( "/<int:id_calificacion>",methods=["PUT"])(actualizar_calificacion)

# Eliminar una clase
calificacion_bp.route("/<int:id_calificacion>",methods=["DELETE"])(eliminar_calificacion_controller)