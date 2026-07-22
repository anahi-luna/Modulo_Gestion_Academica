from flask import Blueprint

from controllers.auth_controller import (
    get_usuarios,
    get_usuario,
    get_usuario_username,
    get_usuario_logueado,
)

auth_bp = Blueprint("auth", __name__, url_prefix="/mock/auth")

auth_bp.route("/usuarios", methods=["GET"])(get_usuarios)

auth_bp.route("/usuarios/<int:id_usuario>", methods=["GET"])(get_usuario)

auth_bp.route("/usuarios/username/<string:username>", methods=["GET"])(get_usuario_username)

auth_bp.route("/me", methods=["GET"])(get_usuario_logueado)
