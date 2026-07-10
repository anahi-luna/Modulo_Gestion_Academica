from extensions import db

class TipoEvaluacion(db.Model):
    __tablename__ = "tipo_evaluacion"

    id_tipo_evaluacion= db.Column(
        db.Integer,
        primary_key=True,

    )

    nombre = db.Column(
        db.String(30),
        nullable = False,
        unique=True
    )

    def __repr__(self):
        return f"<TipoEvaluacion {self.nombre}>"