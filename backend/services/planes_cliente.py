from mocks.mock_plan import PLANES

def obtener_plan(id_plan):

    for plan in PLANES:

        if plan["id_plan"] == id_plan:
            return plan

    return None