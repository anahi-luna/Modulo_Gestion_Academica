from extensions import db

class Certificado(db.Model):

    __tablename__ = "certificado"

    id_certificado = db.Column(
        db.Integer,
        primary_key=True
    )

    id_resultado_plan = db.Column(
        db.Integer,
        db.ForeignKey(
            "resultado_plan.id_resultado_plan"
        ),
        nullable=False
    )

    id_tipo_certificado = db.Column(
        db.Integer,
        db.ForeignKey(
            "tipo_certificado.id_tipo_certificado"
        ),
        nullable=False
    )

    codigo_verificacion = db.Column(
        db.String(50),
        nullable=False,
        unique=True
    )

    fecha_emision = db.Column(
        db.Date,
        nullable=False
    )

    fecha_vencimiento = db.Column(
        db.Date,
        nullable=True
    )

    url_documento = db.Column(
        db.String(255),
        nullable=True
    )

    id_estado_certificado = db.Column(
        db.Integer,
        db.ForeignKey(
            "estado_certificado.id_estado_certificado"
        ),
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

    resultado_plan = db.relationship(
        "ResultadoPlan",
        backref=db.backref(
            "certificado",
            uselist=False
        )
    )

    tipo = db.relationship(
        "TipoCertificado",
        backref="certificados"
    )

    estado = db.relationship(
        "EstadoCertificado",
        backref="certificados"
    )
    
    def __repr__(self):
        return (
            f"<Certificado "
            f"{self.id_certificado} - "
            f"Código {self.codigo_verificacion}>"
        )