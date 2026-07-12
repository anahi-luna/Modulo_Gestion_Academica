from flask import Blueprint

from controllers.resultado_academico_controller import *

resultado_academico_bp = Blueprint("resultado_academico_bp",__name__)

# Crear resultado academico
resultado_academico_bp.route("/",methods=["POST"])(agregar_resultado_academico)

# Obtener todas los resultados academicos
resultado_academico_bp.route("/",methods=["GET"])(get_lista_resultados_academicos)

# Obtener un resultado academico
resultado_academico_bp.route( "/<int:id_resultado_academico>",methods=["GET"])(get_resultado_academico)

# Modificar un resultado academico
resultado_academico_bp.route( "/<int:id_resultado_academico>",methods=["PUT"])(actualizar_resultado_academico)

# Eliminar un resultado academico
resultado_academico_bp.route("/<int:id_resultado_academico>",methods=["DELETE"])(eliminar_resultado_academico_controller)