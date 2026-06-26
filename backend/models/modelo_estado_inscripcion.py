from extensions import db

class EstadoInscripcion(db.Model):
    __tablename__ = "estado_inscripcion"

    id_estado= db.Column(
        db.Integer,
        primary_key=True,

    )

    nombre = db.Column(
        db.String(30),
        nullable = False,
        unique=True
    )

    def __repr__(self):
        return f"<EstadoInscripcion {self.nombre}>"