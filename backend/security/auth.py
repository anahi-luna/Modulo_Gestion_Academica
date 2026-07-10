from flask import request
from security.auth_mock import (
    obtener_usuario,
    obtener_usuario_por_id
)

"""
    Obtiene el usuario autenticado.
    Actualmente utiliza un usuario mock.
    En el futuro obtendrá el usuario desde JWT + Redis.
    """
def obtener_usuario_actual():
    """
    Obtiene el usuario autenticado.

    Mientras no exista el MS3, se obtiene desde el header
    X-Mock-User.

    Si no se envía el header, se utiliza "docente".
    """
    username = request.headers.get(
        "X-Mock-User",
        "docente"
    )
    return obtener_usuario(username) 


def obtener_usuario_por_username(username):
    #Obtiene un usuario por username.
    return obtener_usuario(username)


def obtener_usuario_por_id_usuario(id_usuario):
    #Obtiene un usuario por id_usuario.
    return obtener_usuario_por_id(id_usuario)