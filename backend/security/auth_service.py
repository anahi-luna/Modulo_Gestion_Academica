from copy import deepcopy

from security.yaml_loader import (
    cargar_users,
    cargar_roles,
)

# Carga la configuración una sola vez al iniciar la aplicación.
USUARIOS = cargar_users()["usuarios"]
ROLES = cargar_roles()["roles"]

# Índices para búsquedas rápidas.
USUARIOS_POR_USERNAME = {usuario["usuario"]: usuario for usuario in USUARIOS}

USUARIOS_POR_ID = {usuario["id"]: usuario for usuario in USUARIOS}

ROLES_POR_ID = {rol["id"]: rol for rol in ROLES}


# ROLES
def _obtener_roles_completos(usuario):

    roles = []

    for rol_usuario in usuario.get("roles", []):

        rol = ROLES_POR_ID.get(rol_usuario["id"])

        if rol:

            roles.append(deepcopy(rol))

    return roles


def obtener_roles_usuario(usuario):

    return [
        {"id": rol["id"], "nombre": rol["nombre"]} for rol in usuario.get("roles", [])
    ]


# PERMISOS

def obtener_permisos_usuario(usuario):

    permisos = set()

    for rol in _obtener_roles_completos(usuario):

        permisos.update(rol.get("acciones", []))

    return sorted(permisos)


# ARMADO DEL USUARIO

def _armar_usuario(usuario):

    usuario = deepcopy(usuario)

    usuario["roles"] = obtener_roles_usuario(usuario)

    usuario["permisos"] = obtener_permisos_usuario(usuario)

    return usuario


# CONSULTAS

def obtener_usuarios():

    return [_armar_usuario(usuario) for usuario in USUARIOS]


def obtener_usuario_por_username(username):

    usuario = USUARIOS_POR_USERNAME.get(username)

    if usuario is None:
        return None

    return _armar_usuario(usuario)


def obtener_usuario_por_id(id_usuario):

    usuario = USUARIOS_POR_ID.get(id_usuario)

    if usuario is None:
        return None

    return _armar_usuario(usuario)


def obtener_usuario_actual(username):

    return obtener_usuario_por_username(username)
