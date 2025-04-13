import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function EditarSimulacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fecha, setFecha] = useState('');
  const [precondicion, setPrecondicion] = useState('');
  const [capacitador, setCapacitador] = useState('');
  const [personalQueAsiste, setPersonalQueAsiste] = useState('');

  useEffect(() => {
    obtenerSimulacion();
  }, []);

  const obtenerSimulacion = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/simulacion/${id}`);
      const data = await res.json();

      setFecha(data.simulacion.fecha?.split('T')[0] || '');
      setPrecondicion(data.simulacion.precondicion || '');
      setCapacitador(data.simulacion.capacitador || '');
      setPersonalQueAsiste(data.simulacion.personalQueAsiste || '');
    } catch (err) {
      console.error('Error al obtener la simulación:', err);
      Swal.fire('Error', 'No se pudo cargar la simulación', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !precondicion.trim() || !capacitador.trim() || !personalQueAsiste.trim()) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/simulacion/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha,
          precondicion,
          capacitador,
          personalQueAsiste,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Actualizado', 'La simulación fue actualizada correctamente', 'success').then(() => {
        navigate('/Simulacion');
      });
    } catch (err) {
      console.error('Error al actualizar:', err);
      Swal.fire('Error', 'No se pudo actualizar la simulación', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3>Editar Simulación</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPrecondicion" className="mt-3">
              <Form.Label>Precondición</Form.Label>
              <Form.Control
                type="text"
                value={precondicion}
                onChange={(e) => setPrecondicion(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formCapacitador" className="mt-3">
              <Form.Label>Capacitador</Form.Label>
              <Form.Control
                type="text"
                value={capacitador}
                onChange={(e) => setCapacitador(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPersonal" className="mt-3">
              <Form.Label>Personal que Asiste</Form.Label>
              <Form.Control
                type="text"
                value={personalQueAsiste}
                onChange={(e) => setPersonalQueAsiste(e.target.value)}
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

export default EditarSimulacion;
