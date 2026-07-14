from extensions import ma

from models.modelo_tipo_certificado import TipoCertificado  

class TipoCertificadoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TipoCertificado
        load_instance = False

tipo_certificado_schema = TipoCertificadoSchema()
tipos_certificados_schema = TipoCertificadoSchema(many=True)