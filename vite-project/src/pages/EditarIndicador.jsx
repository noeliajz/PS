import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function EditarIndicador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [formula, setFormula] = useState('');

  useEffect(() => {
    obtenerIndicador();
  }, []);

  const obtenerIndicador = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/indicador/${id}`);
      const data = await res.json();
      setNombre(data.indicador.nombre || '');
      setFormula(data.indicador.formula || '');
    } catch (err) {
      console.error('Error al obtener el indicador:', err);
      Swal.fire('Error', 'No se pudo cargar el indicador', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !formula.trim()) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/indicador/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, formula }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Actualizado', 'El indicador fue actualizado correctamente', 'success').then(() => {
        navigate('/IndicadorTodos');
      });
    } catch (err) {
      console.error('Error al actualizar:', err);
      Swal.fire('Error', 'No se pudo actualizar el indicador', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3>Editar Indicador</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre del Indicador</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formFormula" className="mt-3">
              <Form.Label>Fórmula del Indicador</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
              />
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

export default EditarIndicador;
