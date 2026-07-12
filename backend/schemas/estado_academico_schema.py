from extensions import ma

from models.modelo_estado_academico import EstadoAcademico


class EstadoAcademicoSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = EstadoAcademico
        load_instance = False


estado_academico_schema = EstadoAcademicoSchema()

estados_academicos_schema = EstadoAcademicoSchema(many=True)