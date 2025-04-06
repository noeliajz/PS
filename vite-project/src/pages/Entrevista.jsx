import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const Entrevista = () => {
  const [entrevistas, setEntrevistas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [entrevistaActual, setEntrevistaActual] = useState(null);

  const [formulario, setFormulario] = useState({
    entrevistador: '',
    entrevistado: '',
    preguntas: [
      '1. ¿Qué edad tenés?',
      '2. ¿Hace cuántos años trabajás en la empresa?',
      '3. ¿Qué te pareció la simulación?',
      '4. ¿Recomendás repetirla?',
      '5. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?'
    ]
  });

  const obtenerEntrevistas = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/entrevista');
      setEntrevistas(res.data.Entrevistas);
    } catch (error) {
      console.error('Error al obtener entrevistas:', error);
    }
  };

  useEffect(() => {
    obtenerEntrevistas();
  }, []);

  const handleChangePregunta = (index, value) => {
    const nuevasPreguntas = [...formulario.preguntas];
    nuevasPreguntas[index] = value;
    setFormulario({ ...formulario, preguntas: nuevasPreguntas });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { entrevistador, entrevistado, preguntas } = formulario;

    if (!entrevistador || !entrevistado || preguntas.some(p => p.trim() === '')) {
      Swal.fire('Campos incompletos', 'Por favor completá todos los campos.', 'warning');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/entrevista', formulario);
      Swal.fire('Guardado', 'Entrevista registrada con éxito', 'success');
      setFormulario({
        entrevistador: '',
        entrevistado: '',
        preguntas: [
          '1. ¿Qué edad tenés?',
          '2. ¿Hace cuántos años trabajás en la empresa?',
          '3. ¿Qué te pareció la simulación?',
          '4. ¿Recomendás repetirla?',
          '5. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?'
        ]
      });
      setMostrarFormulario(false);
      obtenerEntrevistas();
    } catch (error) {
      console.error('Error al guardar la entrevista:', error);
      Swal.fire('Error', 'No se pudo guardar la entrevista.', 'error');
    }
  };

  const handleResponder = (entrevista) => {
    setEntrevistaActual({
      _id: entrevista._id,
      entrevistador: entrevista.entrevistador,
      entrevistado: entrevista.entrevistado,
      preguntas: Array(entrevista.preguntas.length).fill(''),
      plantilla: entrevista.preguntas
    });
  };

  const enviarRespuestas = async () => {
    if (entrevistaActual.preguntas.some(p => p.trim() === '')) {
      Swal.fire('Completa todas las respuestas', '', 'warning');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/entrevista/${entrevistaActual._id}/responder`, {
        respuestas: entrevistaActual.preguntas
      });

      Swal.fire('¡Gracias!', 'Tus respuestas fueron enviadas', 'success');
      setEntrevistaActual(null);
      obtenerEntrevistas();
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      Swal.fire('Error', 'No se pudieron enviar las respuestas', 'error');
    }
  };

  const eliminarEntrevista = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la entrevista permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/entrevista/${id}`);
        Swal.fire('Eliminado', 'La entrevista fue eliminada con éxito', 'success');
        obtenerEntrevistas();
      } catch (error) {
        console.error('Error al eliminar la entrevista:', error);
        Swal.fire('Error', 'No se pudo eliminar la entrevista', 'error');
      }
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center">Entrevistas</h2>

      <div className="text-center mb-4">
        <Button variant="success" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? 'Cancelar' : 'Crear Entrevista'}
        </Button>
      </div>

      {mostrarFormulario && (
        <Card className="mb-4 p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Entrevistador</Form.Label>
              <Form.Control
                type="text"
                value={formulario.entrevistador}
                onChange={(e) => setFormulario({ ...formulario, entrevistador: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Entrevistado</Form.Label>
              <Form.Control
                type="text"
                value={formulario.entrevistado}
                onChange={(e) => setFormulario({ ...formulario, entrevistado: e.target.value })}
              />
            </Form.Group>

            {formulario.preguntas.map((pregunta, i) => (
              <Form.Group className="mb-3" key={i}>
                <Form.Label>{pregunta}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={pregunta}
                  onChange={(e) => handleChangePregunta(i, e.target.value)}
                />
              </Form.Group>
            ))}

            <Button type="submit" variant="success">Guardar</Button>
          </Form>
        </Card>
      )}

      {entrevistas.length === 0 ? (
        <p className="text-center">No hay entrevistas registradas aún.</p>
      ) : (
        entrevistas.map((e, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>Entrevistado: {e.entrevistado}</Card.Title>
              <p><strong>Entrevistador:</strong> {e.entrevistador}</p>
              <p><strong>Fecha:</strong> {new Date(e.fecha).toLocaleDateString()}</p>
              <ListGroup className="mb-3">
                {e.preguntas.map((pregunta, i) => (
                  <ListGroup.Item key={i}>{i + 1}. {pregunta}</ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="success" onClick={() => handleResponder(e)}>Responder otra vez</Button>
              <Button variant="danger" className="ms-2" onClick={() => eliminarEntrevista(e._id)}>Eliminar</Button>

              {e.respuestas && e.respuestas.length > 0 && (
                <div className="mt-3">
                  <h5>Respuestas recibidas:</h5>
                  {e.respuestas.map((r, i) => (
                    <Card key={i} className="mb-2 p-2">
                      {r.respuestas.map((respuesta, idx) => (
                        <p key={idx}><strong>{idx + 1}:</strong> {respuesta}</p>
                      ))}
                      <small className="text-muted">Fecha: {new Date(r.fecha).toLocaleString()}</small>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      {entrevistaActual && (
        <Card className="mt-4 p-4">
          <Card.Body>
            <h4>Respondiendo entrevista para: {entrevistaActual.entrevistado}</h4>
            <Form>
              {entrevistaActual.plantilla.map((preg, index) => (
                <Form.Group className="mb-3" key={index}>
                  <Form.Label>{index + 1}. {preg}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={entrevistaActual.preguntas[index]}
                    onChange={(e) => {
                      const nuevasRespuestas = [...entrevistaActual.preguntas];
                      nuevasRespuestas[index] = e.target.value;
                      setEntrevistaActual({ ...entrevistaActual, preguntas: nuevasRespuestas });
                    }}
                  />
                </Form.Group>
              ))}
              <Button variant="success" onClick={enviarRespuestas}>Enviar respuestas</Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Entrevista;
