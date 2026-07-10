from enum import Enum
from extensions import db

class TipoRegistro(Enum):
    MANUAL="MANUAL"
    QR = "QR"


class Asistencia(db.Model):
    __tablename__ = "asistencia"

    id_asistencia = db.Column(
        db.Integer,
        primary_key=True
    )

    id_inscripcion = db.Column(
        db.Integer,
        db.ForeignKey("inscripciones.id_inscripcion"),
        nullable=False
    )

    id_clase = db.Column(
        db.Integer,
        db.ForeignKey("clase.id_clase"),
        nullable=False
    )

    id_estado = db.Column(
        db.Integer,
        db.ForeignKey("estado_asistencia.id_estado_asistencia"),
        nullable=False
    )

    tipo_registro = db.Column(
        db.Enum(TipoRegistro),
        nullable=False,
        default=TipoRegistro.MANUAL
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

    # Relaciones ORM.
    inscripcion = db.relationship(
        "Inscripcion",
        backref="asistencias"
    )

    clase = db.relationship(
        "Clase",
        backref="asistencias"
    )

    estado = db.relationship(
        "EstadoAsistencia",
        backref="asistencias"
    )

    def __repr__(self):
        return (
            f"<Asistencia "
            f"{self.id_asistencia} - "
            f"Inscripción {self.id_inscripcion}>"
        )