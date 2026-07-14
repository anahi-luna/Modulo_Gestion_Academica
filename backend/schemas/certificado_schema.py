from extensions import ma
from marshmallow import fields

from models.modelo_certificado import Certificado
from schemas.estado_certificado_schema import EstadoCertificadoSchema
from schemas.tipo_certificado_schema import TipoCertificadoSchema
from schemas.resultado_plan_schema import ResultadoPlanSchema

class CertificadoSchema(ma.SQLAlchemyAutoSchema):

    class Meta:

        model = Certificado

        load_instance = False

        include_fk = True

    estado = fields.Nested(
        EstadoCertificadoSchema,
        dump_only=True
    )

    tipo = fields.Nested(
        TipoCertificadoSchema,
        dump_only=True
    )

    resultado_plan = fields.Nested(
        ResultadoPlanSchema,
        dump_only=True
    )

class CertificadoRequestSchema(ma.Schema):

    id_resultado_plan = fields.Integer(
        required=True
    )

class ModificarCertificadoSchema(ma.Schema):

    id_estado_certificado = fields.Integer(
        required=False
    )

    url_documento = fields.String(
        required=False
    )

    fecha_vencimiento = fields.Date(
        required=False
    )

certificado_schema = CertificadoSchema()
certificados_schema = CertificadoSchema(many=True)

certificado_request_schema = CertificadoRequestSchema()
modificar_certificado_schema = ModificarCertificadoSchema()