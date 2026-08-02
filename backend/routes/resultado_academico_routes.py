from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.resultado_academico_controller import *

resultado_academico_bp = Blueprint("resultado_academico_bp", __name__)

# Generar resultados académicos
resultado_academico_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.resultado_academico.generar")(agregar_resultado_academico)
)

# Obtener todos los resultados académicos
resultado_academico_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.resultado_academico.leer")(get_lista_resultados_academicos)
)

# Obtener un resultado académico
resultado_academico_bp.route("/<int:id_resultado_academico>", methods=["GET"])(
    requires_permission("inscripcion.resultado_academico.leer")(get_resultado_academico)
)

# Eliminar un resultado académico
resultado_academico_bp.route("/<int:id_resultado_academico>", methods=["DELETE"])(
    requires_permission("inscripcion.resultado_academico.eliminar")(eliminar_resultado_academico_controller)
)