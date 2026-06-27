from mocks.mock_legajos import LEGAJOS

def obtener_legajo(id_legajo):
    for legajo in LEGAJOS:
        if legajo["id_legajo"]== id_legajo:
            return legajo
    return None