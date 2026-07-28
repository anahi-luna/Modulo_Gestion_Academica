from extensions import ma
from marshmallow import fields

from models.modelo_evaluacion import Evaluacion
from schemas.tipo_evaluacion_schema import TipoEvaluacionSchema


# Convierte los objetos del modelo Evaluacion en formato JSON.
# También incluye la información del tipo de evaluación.
class EvaluacionSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = Evaluacion
        load_instance = False
        include_fk = True

    # Devuelve la información del tipo de evaluación.
    tipo_evaluacion = fields.Nested(
        TipoEvaluacionSchema,
        dump_only=True
    )


# Schema resumido de una evaluación.
# Se utiliza como objeto anidado en Calificación.
class EvaluacionResumenSchema(ma.Schema):

    id_evaluacion = fields.Integer()

    titulo = fields.String()

    fecha_evaluacion = fields.Date()

    puntaje_maximo = fields.Float()

    id_tipo_evaluacion = fields.Integer()


# Valida los datos enviados para crear una evaluación.
class EvaluacionRequestSchema(ma.Schema):

    id_comision_asignatura = fields.Integer(
        required=True,
        error_messages={
            "required": "La comisión asignatura es obligatoria."
        }
    )

    id_tipo_evaluacion = fields.Integer(
        required=True,
        error_messages={
            "required": "El tipo de evaluación es obligatorio."
        }
    )

    titulo = fields.String(
        required=True,
        error_messages={
            "required": "El título es obligatorio."
        }
    )

    fecha_evaluacion = fields.Date(
        required=True,
        error_messages={
            "required": "La fecha es obligatoria."
        }
    )

    puntaje_maximo = fields.Integer(
        required=True,
        error_messages={
            "required": "El puntaje máximo es obligatorio."
        }
    )

    id_evaluacion_origen = fields.Integer(
        required=False,
        allow_none=True
    )


# Valida los datos enviados para modificar una evaluación.
# Solo el id de la comisión asignatura es obligatorio;
# el resto de los campos pueden enviarse opcionalmente.
class ModificarEvaluacionSchema(ma.Schema):

    id_comision_asignatura = fields.Integer(
        required=True
    )

    id_tipo_evaluacion = fields.Integer(
        required=False
    )

    titulo = fields.String(
        required=False
    )

    fecha_evaluacion = fields.Date(
        required=False
    )

    puntaje_maximo = fields.Integer(
        required=False
    )

    id_evaluacion_origen = fields.Integer(
        required=False,
        allow_none=True
    )


# Instancias de los schemas utilizadas por los controladores.
evaluacion_schema = EvaluacionSchema()

evaluaciones_schema = EvaluacionSchema(many=True)

evaluacion_request_schema = EvaluacionRequestSchema()

modificar_evaluacion_schema = ModificarEvaluacionSchema()