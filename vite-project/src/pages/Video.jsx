import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";

function Video() {
  const [videos, setVideos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    obtenerVideos();
  }, []);

  const obtenerVideos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/video");
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error al obtener videos:", error);
    }
  };

  const handleToggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !archivo) {
      Swal.fire("Error", "El título y el archivo de video son obligatorios", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("video", archivo);

      const res = await fetch("http://localhost:8080/api/video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje);

      Swal.fire("Éxito", "Video agregado correctamente", "success");
      setTitulo("");
      setDescripcion("");
      setArchivo(null);
      setMostrarFormulario(false);
      obtenerVideos();
    } catch (error) {
      console.error("Error al agregar video:", error);
      Swal.fire("Error", "No se pudo agregar el video", "error");
    }
  };

  const eliminarVideo = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este video?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/api/video/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        Swal.fire("Eliminado", "Video eliminado correctamente", "success");
        obtenerVideos();
      } else {
        Swal.fire("Error", "No se pudo eliminar el video", "error");
      }
    } catch (error) {
      console.error("Error al eliminar video:", error);
    }
  };

  const editarVideo = (id) => {
    Swal.fire("Función de edición aún no implementada");
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <Button onClick={handleToggleFormulario}>
            {mostrarFormulario ? "Cancelar" : "Agregar Video"}
          </Button>
        </Col>
      </Row>

      {mostrarFormulario && (
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tituloVideo">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="descripcionVideo">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="archivoVideo">
                <Form.Label>Archivo de Video</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  onChange={(e) => setArchivo(e.target.files[0])}
                />
              </Form.Group>

              <Button type="submit" className="mt-3">
                Guardar
              </Button>
            </Form>
          </Col>
        </Row>
      )}

      <Row className="mt-4">
        <Col>
          <h3>Videos</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Vista Previa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v._id}>
                  <td>{v.titulo}</td>
                  <td>{v.descripcion}</td>
                  <td>
                    <video width="200" controls>
                      <source
                        src={`http://localhost:8080/${v.url.replace(/\\/g, "/")}`}
                        type="video/mp4"
                      />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => editarVideo(v._id)}
                    >
                      <FontAwesomeIcon icon={faFilePen} />
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarVideo(v._id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Video;
