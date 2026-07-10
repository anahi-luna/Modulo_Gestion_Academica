from extensions import db
from models.modelo_tipo_evaluacion import TipoEvaluacion


def cargar_tipos_de_evaluacion():
    # Verifica si ya existen registros en la tabla.
    # Si existen, finaliza la ejecución.
    if TipoEvaluacion.query.count() > 0:
        return
    
    # Crea la lista de estados de asistencia predeterminados.
    tipos_evaluacion = [
        TipoEvaluacion(id_tipo_evaluacion = 1, nombre="Parcial"),
        TipoEvaluacion(id_tipo_evaluacion = 2, nombre="Recuperatorio"),
        TipoEvaluacion(id_tipo_evaluacion = 3, nombre="Final"),
        TipoEvaluacion(id_tipo_evaluacion = 4, nombre="Trabajo Práctico")
    ]

     # Agrega todos los estados a la sesión de la base de datos.
    db.session.add_all(tipos_evaluacion)
    # Guarda los cambios de forma permanente.
    db.session.commit()