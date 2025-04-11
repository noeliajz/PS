import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function EditarComentario() {
  const { id } = useParams();

  const [comentario, setComentario] = useState('');
  const [error, setError] = useState(false);

  const getComentario = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/foro/${id}`);
      if (!res.ok) throw new Error('No se pudo obtener el comentario');

      const data = await res.json();
      console.log("Comentario recibido:", data);
      setComentario(data.comentario?.comentario || '');
    } catch (error) {
      console.error('Error al obtener comentario:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 250) {
      setComentario(value);
    }
    setError(value.length < 3 || value.length > 250);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!comentario || comentario.length < 3 || comentario.length > 250) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El comentario debe tener entre 3 y 250 caracteres',
      });
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/foro/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario }),
      });

      if (!res.ok) throw new Error('Error al actualizar el comentario');

      Swal.fire({
        icon: 'success',
        title: 'Comentario actualizado',
        text: 'El comentario se actualizó correctamente',
      }).then(() => {
        window.location.href = "/Foro";
      });
    } catch (error) {
      console.error('Error actualizando el comentario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el comentario',
      });
    }
  };

  useEffect(() => {
    if (id) getComentario();
  }, [id]);

  if (!id) return <p>Error: no se proporcionó un ID válido.</p>;

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form>
            <Form.Group controlId="inputComentario">
              <Form.Label>Editar comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="comentario"
                value={comentario}
                onChange={handleChange}
              />
              {error && (
                <small style={{ color: 'red' }}>
                  El comentario debe tener entre 3 y 250 caracteres.
                </small>
              )}
            </Form.Group>

            <Button variant="success" className="mt-3" onClick={handleClick}>
              Guardar Cambios
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EditarComentario;
