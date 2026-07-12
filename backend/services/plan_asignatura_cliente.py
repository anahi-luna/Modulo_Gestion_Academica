from mocks.mock_plan_asignaturas import PLANES_ASIGNATURA


def obtener_plan_asignatura(id_plan_asignatura):

    for plan in PLANES_ASIGNATURA:

        if plan["id_plan_asignatura"] == id_plan_asignatura:
            return plan

    return None