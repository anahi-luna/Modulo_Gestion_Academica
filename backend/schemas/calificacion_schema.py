from extensions import ma
from marshmallow import fields

from models.modelo_calificacion import Calificacion

from schemas.evaluacion_schema import EvaluacionSchema


# Convierte los objetos del modelo Calificacion a JSON.
# También incluye información de la evaluación.
class CalificacionSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Calificacion
        load_instance = False
        include_fk = True

    # Información de la evaluación.
    evaluacion = fields.Nested(
        EvaluacionSchema,
        dump_only=True
    )


# Valida una calificación individual.
class CalificacionItemSchema(ma.Schema):

    id_inscripcion = fields.Integer(
        required=True,
        error_messages={
            "required": "La inscripción es obligatoria."
        }
    )

    puntaje = fields.Float(
        required=True,
        error_messages={
            "required": "El puntaje es obligatorio."
        }
    )

    observacion = fields.String(
        required=False
    )


# Valida el registro masivo de calificaciones.
class CalificacionRequestSchema(ma.Schema):

    id_evaluacion = fields.Integer(
        required=True,
        error_messages={
            "required": "La evaluación es obligatoria."
        }
    )

    calificaciones = fields.List(
        fields.Nested(
            CalificacionItemSchema
        ),
        required=True,
        error_messages={
            "required": "Debe enviar la lista de calificaciones."
        }
    )


# Valida la modificación de una calificación.
class ModificarCalificacionSchema(ma.Schema):

    puntaje = fields.Float(
        required=False
    )

    observacion = fields.String(
        required=False
    )


# Instancias de los schemas.

calificacion_schema = CalificacionSchema()
calificaciones_schema = CalificacionSchema(many=True)

calificacion_request_schema = CalificacionRequestSchema()
modificar_calificacion_schema = ModificarCalificacionSchema()