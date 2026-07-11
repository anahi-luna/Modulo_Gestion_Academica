from extensions import ma
from marshmallow import fields

from models.modelo_asistencia import Asistencia

from schemas.estado_asistencia_schema import EstadoAsistenciaSchema
from schemas.clase_schema import ClaseResumenSchema


# Convierte los objetos del modelo Asistencia en formato JSON.
# También incluye información del estado y de la clase.
class AsistenciaSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Asistencia
        load_instance = False
        include_fk = True

    # Devuelve la información del estado de asistencia.
    estado = fields.Nested(
        EstadoAsistenciaSchema,
        dump_only=True
    )

    # Devuelve la información de la clase.
    clase = fields.Nested(
        ClaseResumenSchema,
        dump_only=True
    )


# Valida los datos enviados al crear asistencias.
# Se recibe una lista de asistencias correspondientes
# a una misma clase.
class AsistenciaItemSchema(ma.Schema):

    id_inscripcion = fields.Integer(
        required=True,
        error_messages={
            "required": "La inscripción es obligatoria."
        }
    )

    id_estado = fields.Integer(
        required=True,
        error_messages={
            "required": "El estado de asistencia es obligatorio."
        }
    )

    observacion = fields.String(
        required=False
    )


class AsistenciaRequestSchema(ma.Schema):

    id_clase = fields.Integer(
        required=True,
        error_messages={
            "required": "La clase es obligatoria."
        }
    )

    asistencias = fields.List(
        fields.Nested(AsistenciaItemSchema),
        required=True,
        error_messages={
            "required": "Debe enviar la lista de asistencias."
        }
    )


# Valida la modificación de una asistencia.
class ModificarAsistenciaSchema(ma.Schema):

    id_estado = fields.Integer(
        required=False
    )

    observacion = fields.String(
        required=False
    )


# Instancias de los schemas.
asistencia_schema = AsistenciaSchema()
asistencias_schema = AsistenciaSchema(many=True)

asistencia_request_schema = AsistenciaRequestSchema()
modificar_asistencia_schema = ModificarAsistenciaSchema()