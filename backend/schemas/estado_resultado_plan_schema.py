from extensions import ma

from models.modelo_estado_resultado_plan import EstadoResultadoPlan 

class EstadoResultadoPlanSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EstadoResultadoPlan
        load_instance = False

estado_resultado_plan_schema = EstadoResultadoPlanSchema()
estados_resultados_planes_schema = EstadoResultadoPlanSchema(many=True)