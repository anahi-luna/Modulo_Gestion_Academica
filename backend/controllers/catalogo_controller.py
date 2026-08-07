from flask import jsonify

from services.catalogo_service import (
    obtener_estados_inscripcion,
    obtener_estados_asistencia,
    obtener_estados_academicos,
    obtener_estados_resultado_plan,
    obtener_estados_certificado,
    obtener_tipos_evaluacion,
    obtener_tipos_certificado
)

from schemas.estado_inscripcion_schema import estados_inscripcion_schema
from schemas.estado_asistencia_schema import estados_asistencia_schema
from schemas.estado_academico_schema import estados_academicos_schema
from schemas.estado_resultado_plan_schema import estados_resultados_planes_schema
from schemas.estado_certificado_schema import estados_certificados_schema
from schemas.tipo_evaluacion_schema import tipos_evaluaciones_schema
from schemas.tipo_certificado_schema import tipos_certificados_schema


# Estados de inscripción
def get_estados_inscripcion():
    estados = obtener_estados_inscripcion()
    return jsonify(estados_inscripcion_schema.dump(estados)), 200


# Estados de asistencia
def get_estados_asistencia():
    estados = obtener_estados_asistencia()
    return jsonify(estados_asistencia_schema.dump(estados)), 200


# Estados académicos
def get_estados_academicos():
    estados = obtener_estados_academicos()
    return jsonify(estados_academicos_schema.dump(estados)), 200


# Estados de resultado de plan
def get_estados_resultado_plan():
    estados = obtener_estados_resultado_plan()
    return jsonify(estados_resultados_planes_schema.dump(estados)), 200


# Estados de certificado
def get_estados_certificado():
    estados = obtener_estados_certificado()
    return jsonify(estados_certificados_schema.dump(estados)), 200


# Tipos de evaluación
def get_tipos_evaluacion():
    tipos = obtener_tipos_evaluacion()
    return jsonify(tipos_evaluaciones_schema.dump(tipos)), 200


# Tipos de certificado
def get_tipos_certificado():
    tipos = obtener_tipos_certificado()
    return jsonify(tipos_certificados_schema.dump(tipos)), 200