from flask import Blueprint

from controllers.certificado_controller import *

certificado_bp = Blueprint("certificado_bp", __name__)

# Emitir certificado.
certificado_bp.route("/", methods=["POST"])(agregar_certificado)

# Obtener todos los certificados.
certificado_bp.route("/", methods=["GET"])(get_lista_certificados)

# Obtener un certificado.
certificado_bp.route("/<int:id_certificado>", methods=["GET"])(get_certificado)

# Modificar certificado.
certificado_bp.route("/<int:id_certificado>", methods=["PUT"])(actualizar_certificado_controller)

# Eliminar certificado (solo desarrollo).
certificado_bp.route("/<int:id_certificado>", methods=["DELETE"])(eliminar_certificado_controller)
