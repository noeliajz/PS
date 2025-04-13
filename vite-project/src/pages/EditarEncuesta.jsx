import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function EditarEncuesta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [encuestador, setEncuestador] = useState('');
  const [encuestado, setEncuestado] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    obtenerEncuesta();
  }, []);

  const obtenerEncuesta = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/encuesta/${id}`);
      if (!res.ok) throw new Error('Encuesta no encontrada');
      
      const data = await res.json();
      const encuesta = data.encuesta;
  
      setEncuestador(encuesta.encuestador || '');
      setEncuestado(encuesta.encuestado || '');
      setPreguntas(encuesta.preguntas || []);
      setFecha(encuesta.fecha ? encuesta.fecha.slice(0, 10) : '');
    } catch (err) {
      console.error('Error al obtener la encuesta:', err);
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handlePreguntaChange = (index, value) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index] = value;
    setPreguntas(nuevasPreguntas);
  };

  const agregarPregunta = () => {
    setPreguntas([...preguntas, '']);
  };

  const eliminarPregunta = (index) => {
    const nuevas = preguntas.filter((_, i) => i !== index);
    setPreguntas(nuevas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!encuestador.trim() || !encuestado.trim() || preguntas.length === 0) {
      Swal.fire('Error', 'Todos los campos son obligatorios y debe haber al menos una pregunta', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/api/encuesta/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ encuestador, encuestado, preguntas, fecha }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Actualizado', 'La encuesta fue actualizada correctamente', 'success').then(() => {
        navigate('/Encuesta');
      });
    } catch (err) {
      console.error('Error al actualizar la encuesta:', err);
      Swal.fire('Error', 'No se pudo actualizar la encuesta', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h3>Editar Encuesta</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEncuestador">
              <Form.Label>Encuestador</Form.Label>
              <Form.Control
                type="text"
                value={encuestador}
                onChange={(e) => setEncuestador(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEncuestado" className="mt-3">
              <Form.Label>Encuestado</Form.Label>
              <Form.Control
                type="text"
                value={encuestado}
                onChange={(e) => setEncuestado(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formFecha" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Form.Group>

            <h5 className="mt-4">Preguntas</h5>
            {preguntas.map((pregunta, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <Form.Group controlId={`pregunta-${index}`}>
                  <Form.Label>Pregunta #{index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={pregunta}
                    onChange={(e) => handlePreguntaChange(index, e.target.value)}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => eliminarPregunta(index)}
                  >
                    Eliminar
                  </Button>
                </Form.Group>
              </div>
            ))}

            <Button variant="primary" onClick={agregarPregunta} className="mt-2 me-2">
              Agregar Pregunta
            </Button>

            <Button variant="success" type="submit" className="mt-2">
              Guardar Cambios
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EditarEncuesta;
