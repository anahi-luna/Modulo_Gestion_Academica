from extensions import db


class ResultadoAcademico(db.Model):
    __tablename__ = "resultado_academico"

    id_resultado_academico = db.Column(
        db.Integer,
        primary_key=True
    )

    id_inscripcion = db.Column(
        db.Integer,
        db.ForeignKey("inscripciones.id_inscripcion"),
        nullable=False,
        unique=True
    )

    porcentaje_asistencia = db.Column(
        db.Float,
        nullable=False
    )

    promedio_final = db.Column(
        db.Float,
        nullable=False
    )

    id_estado_academico = db.Column(
        db.Integer,
        db.ForeignKey("estado_academico.id_estado_academico"),
        nullable=False
    )

    fecha_resultado = db.Column(
        db.Date,
        nullable=False
    )

    id_usuario_creacion = db.Column(
        db.Integer,
        nullable=False
    )

    ts_creacion = db.Column(
        db.DateTime,
        nullable=False
    )

    # Relaciones
    inscripcion = db.relationship(
        "Inscripcion",
        backref="resultado_academico"
    )

    estado = db.relationship(
        "EstadoAcademico",
        backref="resultados_academicos"
    )

    def __repr__(self):
        return (
            f"<ResultadoAcademico "
            f"{self.id_resultado_academico} - "
            f"Inscripción {self.id_inscripcion}>"
        )