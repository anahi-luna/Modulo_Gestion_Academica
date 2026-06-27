from mocks.mock_comisiones import COMISIONES

def obtener_comision(id_comision):

    for comision in COMISIONES:

        if comision["id_comision"] == id_comision:
            return comision

    return None