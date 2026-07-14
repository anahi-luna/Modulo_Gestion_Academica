from extensions import ma

from models.modelo_estado_certificado import EstadoCertificado 

class EstadoCertificadoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EstadoCertificado
        load_instance = False

estado_certificado_schema = EstadoCertificadoSchema()
estados_certificados_schema = EstadoCertificadoSchema(many=True)