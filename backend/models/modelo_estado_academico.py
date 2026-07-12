from extensions import db


class EstadoAcademico(db.Model):
    __tablename__ = "estado_academico"

    id_estado_academico = db.Column(
        db.Integer,
        primary_key=True
    )

    nombre = db.Column(
        db.String(45),
        nullable=False,
        unique=True
    )

    def __repr__(self):
        return f"<EstadoAcademico {self.nombre}>"