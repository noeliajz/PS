import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
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

function IndicadorTodos() {
  const [indicadores, setIndicadores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState("");
  const [formula, setFormula] = useState("");

  useEffect(() => {
    obtenerIndicadores();
  }, []);

  const obtenerIndicadores = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/indicador");
      const data = await res.json();
      setIndicadores(data.indicadores || []);
    } catch (error) {
      console.error("Error al obtener indicadores:", error);
    }
  };

  const handleToggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !formula.trim()) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/indicador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, formula }),
      });

      // BONUS: chequeo extra por si no es JSON (como cuando hay un error HTML)
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error del servidor: ${text}`);
      }

      const data = await res.json();

      Swal.fire("Éxito", "Indicador creado correctamente", "success");
      setNombre("");
      setFormula("");
      setMostrarFormulario(false);
      obtenerIndicadores();
    } catch (error) {
      console.error("Error al crear indicador:", error);
      Swal.fire("Error", "No se pudo crear el indicador", "error");
    }
  };

  const eliminarIndicador = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este indicador?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:8080/api/indicador/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        Swal.fire("Eliminado", "Indicador eliminado correctamente", "success");
        obtenerIndicadores();
      } else {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    } catch (error) {
      console.error("Error al eliminar indicador:", error);
    }
  };

  const editarIndicador = (id) => {
    Swal.fire("Función de edición aún no implementada");
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <Button onClick={handleToggleFormulario} className="btn-success">
            {mostrarFormulario ? "Cancelar" : "Agregar Indicador"}
          </Button>
        </Col>
      </Row>

      {mostrarFormulario && (
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Nombre del indicador</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Productividad"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Fórmula</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: totalHoras / totalEmpleados"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                />
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
          <h3>Indicadores</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fórmula</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {indicadores.map((ind) => (
                <tr key={ind._id}>
                  <td>{ind.nombre}</td>
                  <td>{ind.formula}</td>
                  <td>
                    <Link to={`/EditarIndicador/${ind._id}`}>
                    <Button variant="warning" size="sm">
                    <FontAwesomeIcon icon={faFilePen} beat />
                    </Button>
                  </Link>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarIndicador(ind._id)}
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

export default IndicadorTodos;
