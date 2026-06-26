from extensions import db

class Inscripcion(db.Model):
    __tablename__ = "inscripciones"

    id_inscripcion = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )

    id_legajo = db.Column(
        db.Integer,
        nullable=False
    )

    id_comision = db.Column(
        db.Integer,
        nullable=False
    )

    id_estado = db.Column(
        db.Integer,
        db.ForeignKey("estado_inscripcion.id_estado"),
        nullable = False
    )

    fecha_inscripcion = db.Column(
        db.DateTime,
        nullable=False
    )

    id_usuario_registro = db.Column(
        db.Integer,
        nullable=False
    )

    ts_creacion = db.Column(
        db.DateTime,
        nullable=False
    )

    ts_modificacion = db.Column(
        db.DateTime,
        nullable=True
    )

    estado = db.relationship(
        "EstadoInscripcion",
        backref= "inscripciones"
    )

def __repr__(self):
    return f"<Inscripcion {self.id_inscripcion}>"