from seed.seed_estado_inscripcion import cargar_estados_inscripcion
from seed.seed_estado_asistencia import cargar_estados_asistencia

def cargar_datos_iniciales():
    cargar_estados_inscripcion()
    cargar_estados_asistencia()



