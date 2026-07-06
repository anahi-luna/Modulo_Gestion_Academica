from seed.seed_estado_inscripcion import cargar_estados_inscripcion
from seed.seed_estado_asistencia import cargar_estados_asistencia

# ============================================================
# Carga los datos iniciales del sistema.
# Este método ejecuta todas las funciones encargadas de poblar
# la base de datos con información necesaria para el
# funcionamiento de la aplicación.
# ============================================================

def cargar_datos_iniciales():
    # Carga los estados posibles de una inscripción.
    cargar_estados_inscripcion()

    # Carga los estados posibles de una asistencia.
    cargar_estados_asistencia()



