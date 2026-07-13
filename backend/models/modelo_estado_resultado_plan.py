from extensions import db

class EstadoResultadoPlan(db.Model):

    __tablename__ = "estado_resultado_plan"

    id_estado_resultado_plan = db.Column(
        db.Integer,
        primary_key=True
    )

    nombre = db.Column(
        db.String(45),
        nullable=False,
        unique=True
    )