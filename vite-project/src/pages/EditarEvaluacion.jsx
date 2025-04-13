import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function EditarEvaluacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [notaMaxima, setNotaMaxima] = useState(0);
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    obtenerEvaluacion();
  }, []);

  const obtenerEvaluacion = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/evaluacion/${id}`);
      const data = await res.json();

      setTitulo(data.evaluacion.titulo || '');
      setNotaMaxima(data.evaluacion.notaMaxima || 0);
      setPreguntas(data.evaluacion.preguntas || []);
    } catch (err) {
      console.error('Error al obtener la evaluación:', err);
      Swal.fire('Error', 'No se pudo cargar la evaluación', 'error');
    }
  };

  const handlePreguntaChange = (index, field, value) => {
    const nuevasPreguntas = [...preguntas];
    if (field === 'opciones') {
      nuevasPreguntas[index][field] = value.split(',').map(op => op.trim());
    } else {
      nuevasPreguntas[index][field] = value;
    }
    setPreguntas(nuevasPreguntas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || notaMaxima <= 0 || preguntas.length === 0) {
      Swal.fire('Error', 'Todos los campos son obligatorios y debe haber al menos una pregunta', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/api/evaluacion/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, notaMaxima, preguntas }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Actualizado', 'La evaluación fue actualizada correctamente', 'success').then(() => {
        navigate('/Evaluacion');
      });
    } catch (err) {
      console.error('Error al actualizar:', err);
      Swal.fire('Error', 'No se pudo actualizar la evaluación', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h3>Editar Evaluación</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formNotaMaxima" className="mt-3">
              <Form.Label>Nota Máxima</Form.Label>
              <Form.Control
                type="number"
                value={notaMaxima}
                onChange={(e) => setNotaMaxima(Number(e.target.value))}
              />
            </Form.Group>

            <h5 className="mt-4">Preguntas</h5>
            {preguntas.map((pregunta, index) => (
              <div key={index} className="mb-4 p-3 border rounded">
                <Form.Group controlId={`enunciado-${index}`}>
                  <Form.Label>Enunciado</Form.Label>
                  <Form.Control
                    type="text"
                    value={pregunta.enunciado}
                    onChange={(e) => handlePreguntaChange(index, 'enunciado', e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId={`opciones-${index}`} className="mt-2">
                  <Form.Label>Opciones (separadas por coma)</Form.Label>
                  <Form.Control
                    type="text"
                    value={pregunta.opciones.join(', ')}
                    onChange={(e) => handlePreguntaChange(index, 'opciones', e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId={`respuesta-${index}`} className="mt-2">
                  <Form.Label>Respuesta Correcta</Form.Label>
                  <Form.Control
                    type="text"
                    value={pregunta.respuestaCorrecta}
                    onChange={(e) => handlePreguntaChange(index, 'respuestaCorrecta', e.target.value)}
                  />
                </Form.Group>
              </div>
            ))}

            <Button variant="success" type="submit" className="mt-3">
              Guardar Cambios
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EditarEvaluacion;
