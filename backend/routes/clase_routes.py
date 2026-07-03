from flask import Blueprint

from controllers.clase_controllers import *

clase_bp = Blueprint("clase_bp",__name__)

# Crear clase
clase_bp.route("/",methods=["POST"])(agregar_clase)

# Obtener todas las clases
clase_bp.route("/",methods=["GET"])(get_lista_de_clases)

# Obtener una clase
clase_bp.route( "/<int:id_clase>",methods=["GET"])(get_clase)

# Modificar una clase
clase_bp.route( "/<int:id_clase>",methods=["PUT"])(actualizar_clase)

# Eliminar una clase
clase_bp.route("/<int:id_clase>",methods=["DELETE"])(eliminar_clase_controller)