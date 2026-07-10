from extensions import db

class Calificacion(db.Model):
    __tablename__ = "calificacion"

    id_calificacion = db.Column(
        db.Integer,
        primary_key=True
    )

    id_evaluacion = db.Column(
        db.Integer,
        db.ForeignKey(
            "evaluacion.id_evaluacion"
        ),
        nullable=False
    )

    id_inscripcion = db.Column(
        db.Integer,
        db.ForeignKey(
            "inscripciones.id_inscripcion"
        ),
        nullable=False
    )

    puntaje = db.Column(
        db.Float,
        nullable=False
    )

    observacion = db.Column(
        db.String(255),
        nullable=True
    )

    id_usuario_creacion = db.Column(
        db.Integer,
        nullable=False
    )

    id_usuario_modificacion = db.Column(
        db.Integer,
        nullable=True
    )

    ts_creacion = db.Column(
        db.DateTime,
        nullable=False
    )

    ts_modificacion = db.Column(
        db.DateTime,
        nullable=True
    )

    # Relaciones ORM
    evaluacion = db.relationship(
        "Evaluacion",
        backref="calificaciones"
    )

    inscripcion = db.relationship(
        "Inscripcion",
        backref="calificaciones"
    )

    def __repr__(self):

        return (
            f"<Calificacion "
            f"{self.id_calificacion} - "
            f"Evaluacion {self.id_evaluacion}>"
        )