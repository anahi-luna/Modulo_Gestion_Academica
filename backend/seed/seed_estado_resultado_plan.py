from extensions import db
from models.modelo_estado_resultado_plan import EstadoResultadoPlan

# ============================================================
# Inserta los estados de planes en la base de datos.
# La carga se realiza únicamente si la tabla está vacía,
# evitando duplicar registros.
# ============================================================

def cargar_estados_resultados_planes():
    # Verifica si ya existen registros en la tabla.
    # Si existen, finaliza la ejecución.
    if EstadoResultadoPlan.query.count() > 0:
        return
    
    # Crea la lista de estados planes predeterminados.
    estados = [
        EstadoResultadoPlan(id_estado_resultado_plan = 1, nombre="En curso"),
        EstadoResultadoPlan(id_estado_resultado_plan = 2, nombre="Finalizado"),
        EstadoResultadoPlan(id_estado_resultado_plan = 3, nombre="Incompleto"),
        EstadoResultadoPlan(id_estado_resultado_plan = 4, nombre="Abandonado"),
    ]

     # Agrega todos los estados a la sesión de la base de datos.
    db.session.add_all(estados)
    # Guarda los cambios de forma permanente.
    db.session.commit()