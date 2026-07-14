from extensions import db

class TipoCertificado(db.Model):
    __tablename__ = "tipo_certificado"

    id_tipo_certificado= db.Column(
        db.Integer,
        primary_key=True,

    )

    nombre = db.Column(
        db.String(30),
        nullable = False,
        unique=True
    )

    def __repr__(self):
        return f"<TipoCertificado {self.nombre}>"