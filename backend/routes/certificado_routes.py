from flask import Blueprint
from auth_common.decorador import requires_permission
from controllers.certificado_controller import *

certificado_bp = Blueprint("certificado_bp", __name__)

# Emitir certificado
certificado_bp.route("/", methods=["POST"])(
    requires_permission("inscripcion.certificados.emitir")(agregar_certificado)
)

# Obtener todos los certificados
certificado_bp.route("/", methods=["GET"])(
    requires_permission("inscripcion.certificados.leer")(get_lista_certificados)
)

# Obtener los certificados del alumno autenticado
certificado_bp.route("/mis-certificados", methods=["GET"])(
    requires_permission("inscripcion.certificados.leer")(obtener_mis_certificados)
)

# Obtener un certificado
certificado_bp.route("/<int:id_certificado>", methods=["GET"])(
    requires_permission("inscripcion.certificados.leer")(get_certificado)
)

# Modificar certificado
certificado_bp.route("/<int:id_certificado>", methods=["PUT"])(
    requires_permission("inscripcion.certificados.actualizar")(
        actualizar_certificado_controller
    )
)

# Eliminar certificado
certificado_bp.route("/<int:id_certificado>", methods=["DELETE"])(
    requires_permission("inscripcion.certificados.eliminar")(
        eliminar_certificado_controller
    )
)
