from copy import deepcopy

from security.permission_loader import (
    cargar_roles,
    cargar_users
)

# Cargar la configuración una sola vez al iniciar la aplicación
USERS = cargar_users()["users"]
ROLES = cargar_roles()["roles"]

"""
    Obtiene todas las acciones asociadas a una lista de roles.
    Elimina acciones duplicadas.
 """
def _obtener_acciones_roles(lista_roles):
    acciones = set()

    for rol in lista_roles:

        rol_data = ROLES.get(rol)

        if not rol_data:
            continue

        acciones.update(rol_data.get("actions", []))

    return sorted(list(acciones))


#Devuelve las acciones correspondientes al usuario.
def obtener_acciones(usuario):
    return _obtener_acciones_roles(usuario.get("roles", []))

"""
    Obtiene un usuario por username y agrega automáticamente
    sus acciones según los roles asignados.
"""
def obtener_usuario(username):
    usuario = USERS.get(username)

    if usuario is None:
        return None

    # Se crea una copia para no modificar el contenido original
    # cargado desde el archivo YAML.
    usuario = deepcopy(usuario) 

    usuario["actions"] = obtener_acciones(usuario)

    return usuario


#Obtiene un usuario por id_usuario y agrega automáticamente sus acciones.
def obtener_usuario_por_id(id_usuario):

    for usuario in USERS.values():

        if usuario["id_usuario"] == id_usuario:

            usuario = deepcopy(usuario)

            usuario["actions"] = obtener_acciones(usuario)

            return usuario

    return None