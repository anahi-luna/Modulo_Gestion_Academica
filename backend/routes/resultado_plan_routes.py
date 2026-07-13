from flask import Blueprint

from controllers.resultado_plan_controller import *

resultado_plan_bp = Blueprint("resultado_plan_bp", __name__)

# Generar resultado del plan (solo desarrollo)
#resultado_plan_bp.route("/", methods=["POST"])(agregar_resultado_plan)

# Obtener todos los resultados
resultado_plan_bp.route("/", methods=["GET"])(get_lista_resultados_plan)

# Obtener un resultado
resultado_plan_bp.route("/<int:id_resultado_plan>", methods=["GET"])(get_resultado_plan)

# Modificar estado
resultado_plan_bp.route("/<int:id_resultado_plan>", methods=["PUT"])(actualizar_resultado_plan_controller)

# Eliminar (solo desarrollo)
resultado_plan_bp.route("/<int:id_resultado_plan>", methods=["DELETE"])(eliminar_resultado_plan_controller)
