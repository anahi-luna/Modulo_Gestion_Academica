from extensions import db

class EstadoAsistencia(db.Model):
    __tablename__ = "estado_asistencia"

    id_estado_asistencia= db.Column(
        db.Integer,
        primary_key=True,

    )

    nombre = db.Column(
        db.String(30),
        nullable = False,
        unique=True
    )

    def __repr__(self):
        return f"<EstadoAsistencia {self.nombre}>"