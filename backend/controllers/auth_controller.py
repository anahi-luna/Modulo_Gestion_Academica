from flask import request

from security.auth_service import (
    obtener_usuarios,
    obtener_usuario_por_id,
    obtener_usuario_por_username,
    obtener_usuario_actual,
)

from utils.response import (
    success_response,
    error_response,
)


def get_usuarios():

    usuarios = obtener_usuarios()

    return success_response(
        data=usuarios, message="Listado de usuarios.", total=len(usuarios)
    )


def get_usuario(id_usuario):

    usuario = obtener_usuario_por_id(id_usuario)

    if usuario is None:

        return error_response(message="Usuario no encontrado.", status_code=404)

    return success_response(data=usuario, message="Usuario encontrado.")


def get_usuario_username(username):

    usuario = obtener_usuario_por_username(username)

    if usuario is None:

        return error_response(message="Usuario no encontrado.", status_code=404)

    return success_response(data=usuario, message="Usuario encontrado.")


def get_usuario_logueado():

    username = request.args.get("usuario", "docente")

    usuario = obtener_usuario_actual(username)

    if usuario is None:

        return error_response(message="Usuario no encontrado.", status_code=404)

    return success_response(data=usuario, message="Usuario autenticado.")
