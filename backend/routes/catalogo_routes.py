from flask import Blueprint

from auth_common.decorador import requires_permission
from controllers.catalogo_controller import *

catalogo_bp = Blueprint("catalogo_bp", __name__)

# Estados
catalogo_bp.route("/estados-inscripcion", methods=["GET"])(
    requires_permission("estados_inscripcion.leer")(get_estados_inscripcion)
)

catalogo_bp.route("/estados-asistencia", methods=["GET"])(
    requires_permission("estados_asistencia.leer")(get_estados_asistencia)
)

catalogo_bp.route("/estados-academicos", methods=["GET"])(
    requires_permission("estados_academicos.leer")(get_estados_academicos)
)

catalogo_bp.route("/estados-resultados-plan", methods=["GET"])(
    requires_permission("estados_resultado_plan.leer")(get_estados_resultado_plan)
)

catalogo_bp.route("/estados-certificados", methods=["GET"])(
    requires_permission("estados_certificado.leer")(get_estados_certificado)
)

# Tipos
catalogo_bp.route("/tipos-evaluacion", methods=["GET"])(
    requires_permission("tipos_evaluacion.leer")(get_tipos_evaluacion)
)

catalogo_bp.route("/tipos-certificado", methods=["GET"])(
    requires_permission("tipos_certificado.leer")(get_tipos_certificado)
)