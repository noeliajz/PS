import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function EditarDiagrama() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagen, setImagen] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    obtenerDiagrama();
  }, []);

  const obtenerDiagrama = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/diagrama/${id}`);
      const data = await res.json();
      setImagen(data.imagen || '');
    } catch (err) {
      console.error('Error al obtener el diagrama:', err);
      Swal.fire('Error', 'No se pudo cargar el diagrama', 'error');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setImagen(value);
    setError(!value.startsWith('http'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagen.trim()) {
      Swal.fire('Error', 'La URL no puede estar vacía', 'error');
      return;
    }

    if (error) {
      Swal.fire('Error', 'La URL debe ser válida', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/diagrama/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagen }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Actualizado', 'El diagrama fue actualizado correctamente', 'success').then(() => {
        navigate('/Diagramas');
      });
    } catch (err) {
      console.error('Error al actualizar:', err);
      Swal.fire('Error', 'No se pudo actualizar el diagrama', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3>Editar Diagrama</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formImagen">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="text"
                value={imagen}
                onChange={handleChange}
                placeholder="https://..."
              />
              {error && (
                <small style={{ color: 'red' }}>
                  La URL debe comenzar con http
                </small>
              )}
            </Form.Group>
            <Button variant="success" type="submit" className="mt-3">
              Guardar Cambios
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EditarDiagrama;
