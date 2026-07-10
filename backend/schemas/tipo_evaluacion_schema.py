from extensions import ma

from models.modelo_tipo_evaluacion import TipoEvaluacion  

class TipoEvaluacionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TipoEvaluacion
        load_instance = False

tipo_evaluacion_schema = TipoEvaluacionSchema()
tipos_evaluaciones_schema = TipoEvaluacionSchema(many=True)