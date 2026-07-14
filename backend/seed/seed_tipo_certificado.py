from extensions import db
from models.modelo_tipo_certificado import TipoCertificado


def cargar_tipos_de_certificado():
    # Verifica si ya existen registros en la tabla.
    # Si existen, finaliza la ejecución.
    if TipoCertificado.query.count() > 0:
        return
    
    # Crea la lista de tipos de certificados predeterminados.
    tipos_certificado = [
        TipoCertificado(id_tipo_certificado = 1, nombre="Aprobación"),
        TipoCertificado(id_tipo_certificado = 2, nombre="Participación"),
    ]

     # Agrega todos los estados a la sesión de la base de datos.
    db.session.add_all(tipos_certificado)
    # Guarda los cambios de forma permanente.
    db.session.commit()