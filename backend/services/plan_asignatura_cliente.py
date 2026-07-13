from mocks.mock_plan_asignaturas import PLANES_ASIGNATURA


# Obtiene un plan asignatura por ID.
def obtener_plan_asignatura(id_plan_asignatura):

    for plan in PLANES_ASIGNATURA:

        if plan["id_plan_asignatura"] == id_plan_asignatura:
            return plan

    return None


# Obtiene todas las asignaturas pertenecientes a un plan.
def obtener_planes_asignatura_por_plan(id_plan):

    return [
        plan for plan in PLANES_ASIGNATURA 
        if plan["id_plan"] == id_plan
    ]
