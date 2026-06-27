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

#Valida una inscripcion del POST "osea el request"
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

class ModificarInscripcionSchema(ma.Schema):

    id_estado = fields.Integer(
        required=False
    )

    id_comision = fields.Integer(
        required=False
    )

# Instancias del schema
inscripcion_schema= InscripcionSchema()             # Un objeto
inscripciones_schema = InscripcionSchema(many=True) # Lista de objetos

# Instancias para validar requests
inscripcion_request_schema = InscripcionRequestSchema()
modificar_inscripcion_schema = ModificarInscripcionSchema()