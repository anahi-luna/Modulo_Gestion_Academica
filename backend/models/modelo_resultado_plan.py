from extensions import db


class ResultadoPlan(db.Model):
    __tablename__ = "resultado_plan"

    id_resultado_plan = db.Column(
        db.Integer,
        primary_key=True
    )

    id_legajo = db.Column(
        db.Integer,
        nullable=False
    )

    id_plan = db.Column(
        db.Integer,
        nullable=False
    )

    materias_totales = db.Column(
        db.Integer,
        nullable=False
    )

    materias_aprobadas = db.Column(
        db.Integer,
        nullable=False
    )

    materias_finalizadas = db.Column(
    db.Integer,
    nullable=False
    )

    id_estado_resultado_plan = db.Column(
        db.Integer,
        db.ForeignKey(
            "estado_resultado_plan.id_estado_resultado_plan"
        ),
        nullable=False
    )

    fecha_actualizacion = db.Column(
        db.Date,
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

    # Relaciones

    estado = db.relationship(
        "EstadoResultadoPlan",
        backref="resultados_plan"
    )

    def __repr__(self):

        return (
            f"<ResultadoPlan "
            f"{self.id_resultado_plan} - "
            f"Legajo {self.id_legajo}>"
        )