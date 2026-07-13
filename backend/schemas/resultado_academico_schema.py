from extensions import ma
from marshmallow import fields

from models.modelo_resultado_academico import ResultadoAcademico

from schemas.estado_academico_schema import EstadoAcademicoSchema
from schemas.inscripcion_schema import InscripcionResumenSchema


# Convierte los objetos ResultadoAcademico a JSON.
# Incluye información resumida de la inscripción
# y del estado académico.
class ResultadoAcademicoSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = ResultadoAcademico
        load_instance = False
        include_fk = True

    estado = fields.Nested(
        EstadoAcademicoSchema,
        dump_only=True
    )

    inscripcion = fields.Nested(
        InscripcionResumenSchema,
        dump_only=True
    )


# Valida la creación de un resultado académico.
class ResultadoAcademicoRequestSchema(ma.Schema):

    id_comision = fields.Integer(
        required=True
    )



# Instancias de los schemas.
resultado_academico_schema = ResultadoAcademicoSchema()
resultados_academicos_schema = ResultadoAcademicoSchema(many=True)

resultado_academico_request_schema = ResultadoAcademicoRequestSchema()