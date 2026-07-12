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

    id_inscripcion = fields.Integer(
        required=True,
        error_messages={
            "required": "La inscripción es obligatoria."
        }
    )

    observacion = fields.String(
        required=False
    )


# Valida la modificación.
# Solamente permite modificar observaciones.
# El resto de los datos se recalculan automáticamente.
class ModificarResultadoAcademicoSchema(ma.Schema):

    observacion = fields.String(
        required=False
    )
    
    id_estado_academico = fields.Integer(
        required=False
    )


# Instancias de los schemas.

resultado_academico_schema = ResultadoAcademicoSchema()
resultados_academicos_schema = ResultadoAcademicoSchema(many=True)

resultado_academico_request_schema = ResultadoAcademicoRequestSchema()
modificar_resultado_academico_schema = ModificarResultadoAcademicoSchema()