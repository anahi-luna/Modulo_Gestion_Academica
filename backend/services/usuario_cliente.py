from mocks.mock_usuarios import USUARIOS

def obtener_usuario(id_usuario):

    for usuario in USUARIOS:

        if usuario["id_usuario"] == id_usuario:
            return usuario

    return None