from extensions import ma
from marshmallow import fields

from models.modelo_resultado_plan import ResultadoPlan

from schemas.estado_resultado_plan_schema import (
    EstadoResultadoPlanSchema,
)


class ResultadoPlanSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = ResultadoPlan
        load_instance = False
        include_fk = True

    estado = fields.Nested(
        EstadoResultadoPlanSchema,
        dump_only=True
    )


# Se utiliza únicamente para crear o actualizar
# automáticamente el resultado del plan.
class ResultadoPlanRequestSchema(ma.Schema):

    id_legajo = fields.Integer(
        required=True
    )

    id_plan = fields.Integer(
        required=True
    )


# Solo el administrativo podrá modificar el estado
# (por ejemplo Abandonado).
class ModificarResultadoPlanSchema(ma.Schema):

    id_estado_resultado_plan = fields.Integer(
        required=True
    )


resultado_plan_schema = ResultadoPlanSchema()

resultados_plan_schema = ResultadoPlanSchema(many=True)

resultado_plan_request_schema = ResultadoPlanRequestSchema()

modificar_resultado_plan_schema = ModificarResultadoPlanSchema()