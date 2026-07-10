from extensions import ma

from models.modelo_estado_asistencia import EstadoAsistencia 

class EstadoAsistenciaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EstadoAsistencia
        load_instance = False

estado_asistencia_schema = EstadoAsistenciaSchema()
estados_asistencia_schema = EstadoAsistenciaSchema(many=True)