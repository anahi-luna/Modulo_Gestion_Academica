from extensions import db
from models.modelo_estado_certificado import EstadoCertificado

# ============================================================
# Inserta los estados certificados en la base de datos.
# La carga se realiza únicamente si la tabla está vacía,
# evitando duplicar registros.
# ============================================================

def cargar_estados_certificados():
    # Verifica si ya existen registros en la tabla.
    # Si existen, finaliza la ejecución.
    if EstadoCertificado.query.count() > 0:
        return
    
    # Crea la lista de estados academicos predeterminados.
    estados = [
        EstadoCertificado(id_estado_certificado = 1, nombre="Emitido"),
        EstadoCertificado(id_estado_certificado = 2, nombre="Revocado")
        #EstadoCertificado(id_estado_certificado = 3, nombre="Pendiente"),
    ]

     # Agrega todos los estados a la sesión de la base de datos.
    db.session.add_all(estados)
    # Guarda los cambios de forma permanente.
    db.session.commit()