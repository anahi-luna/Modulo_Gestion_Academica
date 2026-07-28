from extensions import db


class Evaluacion(db.Model):
    __tablename__ = "evaluacion"

    id_evaluacion = db.Column(
        db.Integer,
        primary_key=True
    )

    # Comisión asignatura a la que pertenece la evaluación.
    id_comision_asignatura = db.Column(
        db.Integer,
        nullable=False
    )

    id_tipo_evaluacion = db.Column(
        db.Integer,
        db.ForeignKey("tipo_evaluacion.id_tipo_evaluacion"),
        nullable=False
    )

    titulo = db.Column(
        db.String(100),
        nullable=False
    )

    fecha_evaluacion = db.Column(
        db.Date,
        nullable=False
    )

    # Si la evaluación es un recuperatorio,
    # referencia la evaluación original.
    id_evaluacion_origen = db.Column(
        db.Integer,
        db.ForeignKey("evaluacion.id_evaluacion"),
        nullable=True
    )

    puntaje_maximo = db.Column(
        db.Integer,
        nullable=False
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
    tipo_evaluacion = db.relationship(
        "TipoEvaluacion",
        backref="evaluaciones"
    )

    evaluacion_origen = db.relationship(
        "Evaluacion",
        remote_side=[id_evaluacion],
        backref="recuperatorios"
    )

    def __repr__(self):
        return (
            f"<Evaluacion "
            f"{self.id_evaluacion} - "
            f"{self.titulo}>"
        )