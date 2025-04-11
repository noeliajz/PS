import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";

function Diagrama() {
  const [diagramas, setDiagramas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [imagen, setImagen] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    obtenerDiagramas();
  }, []);

  const obtenerDiagramas = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/diagrama");
      const data = await res.json();
      setDiagramas(data.diagramas || []);
    } catch (error) {
      console.error("Error al obtener diagramas:", error);
    }
  };

  const handleToggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setImagen(value);
    setError(!value.startsWith("http")); // puede mejorar la validación si es necesario
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagen.trim()) {
      Swal.fire("Error", "La URL de la imagen no puede estar vacía", "error");
      return;
    }

    if (error) {
      Swal.fire("Error", "La URL debe ser válida", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/diagrama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagen }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje);

      Swal.fire("Éxito", "Diagrama creado correctamente", "success");
      setImagen("");
      setMostrarFormulario(false);
      obtenerDiagramas();
    } catch (error) {
      console.error("Error al crear diagrama:", error);
      Swal.fire("Error", "No se pudo crear el diagrama", "error");
    }
  };

  const eliminarDiagrama = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este diagrama?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/diagrama/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        Swal.fire("Eliminado", "Diagrama eliminado correctamente", "success");
        obtenerDiagramas();
      } else {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    } catch (error) {
      console.error("Error al eliminar diagrama:", error);
    }
  };

  const editarDiagrama = (id) => {
    Swal.fire("Función de edición aún no implementada");
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <Button onClick={handleToggleFormulario} className="btn-success">
            {mostrarFormulario ? "Cancelar" : "Agregar Diagrama"}
          </Button>
        </Col>
      </Row>

      {mostrarFormulario && (
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="imagenURL">
                <Form.Label>URL de la imagen</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://..."
                  value={imagen}
                  onChange={handleChange}
                />
                {error && (
                  <small style={{ color: "red" }}>
                    Debe ser una URL válida que comience con http
                  </small>
                )}
              </Form.Group>
              <Button type="submit" className="mt-3 btn-success">
                Guardar
              </Button>
            </Form>
          </Col>
        </Row>
      )}

      <Row className="mt-4">
        <Col>
          <h3>Diagramas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {diagramas.map((d) => (
                <tr key={d._id}>
                  <td>
                    <Image
                      src={d.imagen}
                      alt="Diagrama"
                      style={{ maxWidth: "200px" }}
                      thumbnail
                    />
                  </td>
                  <td>
                  <Link to={`/EditarDiagrama/${d._id}`}>
                    <Button variant="warning" size="sm">
                    <FontAwesomeIcon icon={faFilePen} beat />
                    </Button>
                  </Link>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarDiagrama(d._id)}
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

export default Diagrama;
