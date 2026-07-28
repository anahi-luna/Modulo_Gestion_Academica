from mocks.mock_comisiones import COMISIONES

def obtener_comision(id_comision):

    for comision in COMISIONES:

        if comision["id_comision"] == id_comision:
            return comision

    return None

# Obtiene todas las comisiones pertenecientes a un plan de asignatura.
def obtener_comisiones_por_plan_asignatura(id_plan_asignatura):

    return [
        comision
        for comision in COMISIONES
        if comision["id_plan_asignatura"] == id_plan_asignatura
    ]