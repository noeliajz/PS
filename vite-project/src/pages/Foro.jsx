import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";

function Foro() {
  const [comentarios, setComentarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    obtenerComentarios();
  }, []);

  const obtenerComentarios = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/foro");
      const data = await res.json();
      console.log("Comentarios obtenidos:", data.comentarios);
      setComentarios(data.comentarios || []);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const handleToggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setComentario(value);
    setError(value.length < 3 || value.length > 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comentario.trim() === "") {
      Swal.fire({ icon: "error", title: "Oops...", text: "El comentario no puede estar vacío" });
      return;
    }

    if (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: "El comentario debe tener entre 3 y 300 caracteres" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token usado:", token);

      const res = await fetch("http://localhost:8080/api/foro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 Asegurate de que el backend lo acepta así
        },
        body: JSON.stringify({ comentario }),
      });

      const data = await res.json();
      console.log("Respuesta del backend:", data);

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al crear el comentario");
      }

      Swal.fire({
        icon: "success",
        title: "Comentario publicado",
        text: "Tu comentario ha sido agregado correctamente",
      });

      setComentario("");
      setMostrarFormulario(false);
      obtenerComentarios();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el comentario" });
    }
  };

  const eliminarComentario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este comentario?");
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/foro/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        Swal.fire({ icon: "success", title: "Comentario eliminado" });
        obtenerComentarios();
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el comentario" });
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  const editarComentario = (id) => {
    Swal.fire("Función de edición aún no implementada");
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <Button onClick={handleToggleFormulario}>
            {mostrarFormulario ? "Cancelar" : "Agregar Comentario"}
          </Button>
        </Col>
      </Row>

      {mostrarFormulario && (
        <Row className="mb-4">
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nuevoComentario">
                <Form.Label>Comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comentario}
                  onChange={handleChange}
                />
                {error && (
                  <small style={{ color: "red" }}>
                    El comentario debe tener entre 3 y 300 caracteres.
                  </small>
                )}
              </Form.Group>
              
              <Button type="submit" className="mt-3">
                Guardar
              </Button>
            </Form>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <h3>Comentarios</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Comentario</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((item) => (
                <tr key={item._id}>
                  <td>{item.comentario}</td>
                  <td>{item.usuario?.nombre || item.usuario?.usuario || "Anónimo"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => editarComentario(item._id)}
                    >
                      <FontAwesomeIcon icon={faFilePen} />
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarComentario(item._id)}
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

export default Foro;
