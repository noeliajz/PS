import React, { useState } from "react";
import Swal from "sweetalert2";
import { Container, Row, Col, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function NuevoComentario() {
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setComentario(value);
    setError(value.length < 3 || value.length > 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comentario.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El comentario no puede estar vacío",
      });
      return;
    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El comentario debe tener entre 3 y 300 caracteres",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token"); // 👈 Obtenemos el token del localStorage

      const res = await fetch("http://localhost:8080/api/foro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 Enviamos el token al backend
        },
        body: JSON.stringify({ comentario }),
      });

      if (!res.ok) throw new Error("Error al crear el comentario");

      Swal.fire({
        icon: "success",
        title: "Comentario publicado",
        text: "Tu comentario ha sido agregado correctamente",
      });

      setComentario("");
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el comentario",
      });
    }
  };

  return (
    <Container fluid className="estiloLoginContenedor pt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="textareaComentario">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="comentario"
                value={comentario}
                onChange={handleChange}
              />
              {error && (
                <small style={{ color: "red" }}>
                  El comentario debe tener entre 3 y 300 caracteres.
                </small>
              )}
            </Form.Group>

            <button type="submit" className="colorBoton fs-4 mt-4">
              Guardar
            </button>
          </Form>
          <NavLink to="/Foro" className="btn btn-link mt-3">
            Volver al foro
          </NavLink>
        </Col>
      </Row>
    </Container>
  );
}

export default NuevoComentario;
