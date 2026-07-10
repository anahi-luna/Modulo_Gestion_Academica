from functools import wraps

from flask import g

from utils.response import error_response


def requires_permission(permission):
    """
    Decorador para validar permisos sobre un endpoint.
    """

    def decorator(func):

        @wraps(func)
        def wrapper(*args, **kwargs):
            # Obtiene las acciones cargadas previamente
            # por before_request.py
            actions = getattr(g, "actions", [])

            # El administrador posee acceso total.
            if "*" in actions:
                return func(*args, **kwargs)

            # Si el usuario no posee el permiso requerido
            # se responde con HTTP 403.
            if permission not in actions:

                return error_response(
                    message="No tiene permisos para realizar esta acción.",
                    status_code=403
                )

            return func(*args, **kwargs)

        return wrapper

    return decorator