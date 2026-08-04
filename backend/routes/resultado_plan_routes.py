from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.resultado_plan_controller import *

resultado_plan_bp = Blueprint("resultado_plan_bp", __name__)

# Obtener todos los resultados
resultado_plan_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.resultado_plan.leer")(get_lista_resultados_plan)
)

# Obtener un resultado
resultado_plan_bp.route("/<int:id_resultado_plan>", methods=["GET"])(
    requires_permission("inscripcion.resultado_plan.leer")(get_resultado_plan)
)

# Obtener el resultado del plan del alumno autenticado
resultado_plan_bp.route("/mi-resultado-plan", methods=["GET"])(
    requires_permission("inscripcion.resultado_plan.leer")(
        obtener_mi_resultado_plan
    )
)

# Modificar estado
resultado_plan_bp.route("/<int:id_resultado_plan>", methods=["PUT"])(
    requires_permission("inscripcion.resultado_plan.actualizar")(actualizar_resultado_plan_controller)
)

# Eliminar
resultado_plan_bp.route("/<int:id_resultado_plan>", methods=["DELETE"])(
    requires_permission("inscripcion.resultado_plan.eliminar")(eliminar_resultado_plan_controller)
)