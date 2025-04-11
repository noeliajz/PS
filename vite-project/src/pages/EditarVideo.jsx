import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function EditarVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    obtenerVideo();
  }, []);

  const obtenerVideo = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/video/${id}`);
      const data = await res.json();
      setTitulo(data.video.titulo || '');
      setDescripcion(data.video.descripcion || '');

    } catch (err) {
      console.error('Error al obtener el video:', err);
      Swal.fire('Error', 'No se pudo cargar el video', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      Swal.fire('Error', 'El título no puede estar vacío', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);
      if (archivo) formData.append('video', archivo); // Solo si hay nuevo archivo

      const res = await fetch(`http://localhost:8080/api/video/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Error al actualizar');

      Swal.fire('Actualizado', 'El video fue actualizado correctamente', 'success').then(() => {
        navigate('/Video');
      });
    } catch (err) {
      console.error('Error al actualizar:', err);
      Swal.fire('Error', 'No se pudo actualizar el video', 'error');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3>Editar Video</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formArchivo">
              <Form.Label>Cambiar archivo de video (opcional)</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={(e) => setArchivo(e.target.files[0])}
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

export default EditarVideo;
