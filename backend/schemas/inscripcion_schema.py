from extensions import ma
from marshmallow import fields,validate
from models.modelo_inscripcion import Inscripcion
from schemas.estado_inscripcion_schema import EstadoInscripcionSchema

#Serializa SQLAlchemy el modelo de inscripcion
class InscripcionSchema(ma.SQLAlchemyAutoSchema):

    estado = ma.Nested(
        EstadoInscripcionSchema,
        attribute = "estado",
        dump_only = True
    )
    
    class Meta:
        model = Inscripcion
        load_instance = False
        include_fk = True

#Valida una inscripcion del POST (es decir la lista de inscripciones que envian desde otro sistema)
class InscripcionRequestSchema(ma.Schema):
    id_legajo = fields.Integer(
        required=True,
        error_messages={
            "required": "El id_legajo es obligatorio."
        }
    )

    id_comision = fields.Integer(
        required= True,
        error_messages={
            "required": "El id_comision es obligatorio."
        }
    )

#Valida el lote osea la lista
class ListaInscripcionesSchema(ma.Schema):
    inscripciones = fields.List(
        fields.Nested(InscripcionRequestSchema),
        required=True,
        validate=validate.Length(
            min=1, error="Debe enviar al menos una inscripción."
        )
    )

# Instancias del schema
inscripcion_schema= InscripcionSchema()             # Un objeto
inscripciones_schema = InscripcionSchema(many=True) # Lista de objetos

# Instancias para validar requests
inscripcion_request_schema = InscripcionRequestSchema()
lista_inscripciones_schema= ListaInscripcionesSchema()