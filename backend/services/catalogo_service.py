from models import *

def obtener_estados_inscripcion():
    return EstadoInscripcion.query.order_by(
        EstadoInscripcion.id_estado
    ).all()


def obtener_estados_asistencia():
    return EstadoAsistencia.query.order_by(
        EstadoAsistencia.id_estado_asistencia
    ).all()


def obtener_estados_academicos():
    return EstadoAcademico.query.order_by(
        EstadoAcademico.id_estado_academico
    ).all()


def obtener_estados_resultado_plan():
    return EstadoResultadoPlan.query.order_by(
        EstadoResultadoPlan.id_estado_resultado_plan
    ).all()


def obtener_estados_certificado():
    return EstadoCertificado.query.order_by(
        EstadoCertificado.id_estado_certificado
    ).all()


def obtener_tipos_evaluacion():
    return TipoEvaluacion.query.order_by(
        TipoEvaluacion.id_tipo_evaluacion
    ).all()


def obtener_tipos_certificado():
    return TipoCertificado.query.order_by(
        TipoCertificado.id_tipo_certificado
    ).all()