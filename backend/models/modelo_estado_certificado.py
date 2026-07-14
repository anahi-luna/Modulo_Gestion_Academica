from extensions import db

class EstadoCertificado(db.Model):

    __tablename__ = "estado_certificado"

    id_estado_certificado = db.Column(
        db.Integer,
        primary_key=True
    )

    nombre = db.Column(
        db.String(45),
        nullable=False,
        unique=True
    )