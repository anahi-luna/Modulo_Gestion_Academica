from extensions import ma
from marshmallow import fields

from models.modelo_clase import Clase

# Convierte los objetos del modelo en formato JSON y viceversa.
class ClaseSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Clase # Modelo asociado al schema.
        load_instance = False # Indica que no se crearán automáticamente instancias del modelo.
        include_fk = True # Incluye las claves foráneas al serializar.


# Este schema valida todos los datos para la creacióm de una clase
# Todos los campos son obligatorios.
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

#Valida los datos enviados para modificar una clase existente
# Solo el id_comision es obligatorio; el resto de los campos
# pueden enviarse de forma opcional.
class ModificarClaseSchema(ma.Schema):
    # Comisión a la que pertenece la clase.
    id_comision = fields.Integer(required=True)
    #Después se valida todos los datos nuevos de la clase
    numero_clase = fields.Integer(required=False)

    fecha = fields.Date(required=False)

    hora_inicio = fields.Time(required=False)

    hora_fin = fields.Time(required=False)

    tema = fields.String(required=False)

    estado = fields.String(required=False)

# ============================================================
# Instancias de los schemas utilizadas por los controladores.
# ============================================================

clase_schema = ClaseSchema() # Schema para una única clase.
clases_schema = ClaseSchema(many=True) # Schema para una lista de clases.

# Schema utilizado al crear una clase.
clase_request_schema = ClaseRequestSchema()
 # Schema utilizado al modificar una clase.
modificar_clase_schema = ModificarClaseSchema()