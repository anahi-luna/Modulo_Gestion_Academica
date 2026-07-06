from enum import Enum
from extensions import db

class EstadoClase(Enum):
    PROGRAMADA = "Programada"
    DICTADA = "Dictada"
    SUSPENDIDA = "Supendida"
    REPROGRAMADA = "Reprogramada"

class Clase(db.Model):
    __tablename__ = "clase"

    id_clase = db.Column(
        db.Integer,
        primary_key = True
    )

    id_comision = db.Column(
        db.Integer,
        nullable = False
    )

    numero_clase = db.Column(
        db.Integer,
        nullable=False
    )

    fecha = db.Column(
        db.Date,
        nullable=False
    )

    hora_inicio = db.Column(
        db.Time,
        nullable=False
    )

    hora_fin = db.Column(
        db.Time,
        nullable=False
    )

    tema = db.Column(
        db.String(255),
        nullable=False
    )

    estado = db.Column(
        db.Enum(EstadoClase),
        nullable = False,
        default = EstadoClase.PROGRAMADA
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

    def __repr__(self):
        return (
            f"<Clase {self.numero_clase} - "
            f"Comisión {self.id_comision}>"
        )

