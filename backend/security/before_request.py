from flask import g

from security.auth import obtener_usuario_actual
from utils.response import error_response

def cargar_contexto_usuario():
    """
    Carga el usuario autenticado en el contexto de la request.
    Actualmente utiliza el usuario mock.
    En el futuro obtendrá el usuario desde JWT + Redis.
    """

    usuario = obtener_usuario_actual()

    if usuario is None:
        return error_response(

            message="Usuario no autenticado.",

            status_code=401
        )

    # Información disponible durante toda la request.
    g.usuario = usuario
    g.id_usuario = usuario["id_usuario"]
    g.roles = usuario["roles"]
    g.actions = usuario["actions"]