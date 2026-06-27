from extensions import ma

from models.modelo_estado_inscripcion import EstadoInscripcion

class EstadoInscripcionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EstadoInscripcion
        load_instance = False

estado_inscripcion_schema = EstadoInscripcionSchema()
estados_inscripcion_schema = EstadoInscripcionSchema(many=True)