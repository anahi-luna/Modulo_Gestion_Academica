from extensions import ma
from marshmallow import fields

from models.modelo_clase import Clase

class ClaseSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Clase
        load_instance = False
        include_fk = True

class ClaseRequestSchema(ma.Schema):
    id_comision = fields.Integer(
        required=True
    )

    numero_clase = fields.Integer(
        required=True,
        error_messages={
            "required": "El número de clase es obligatorio."
        }
    )

    fecha = fields.Date(
        required=True,
        error_messages={
            "required": "La fecha es obligatoria."
        }
    )

    hora_inicio = fields.Time(
        required=True,
        error_messages={
            "required": "La hora de inicio es obligatoria."
        }
    )

    hora_fin = fields.Time(
        required=True,
        error_messages={
            "required": "La hora de fin es obligatoria."
        }
    )

    tema = fields.String(
        required=True,
        error_messages={
            "required": "El tema es obligatorio."
        }
    )


class ModificarClaseSchema(ma.Schema):
    id_comision = fields.Integer(required=True)

    numero_clase = fields.Integer(required=False)

    fecha = fields.Date(required=False)

    hora_inicio = fields.Time(required=False)

    hora_fin = fields.Time(required=False)

    tema = fields.String(required=False)

    estado = fields.String(required=False)

clase_schema = ClaseSchema()
clases_schema = ClaseSchema(many=True)

clase_request_schema = ClaseRequestSchema()
modificar_clase_schema = ModificarClaseSchema()