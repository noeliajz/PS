import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  Card,
  ListGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


function Encuesta() {
  const [encuestas, setEncuestas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaEncuesta, setNuevaEncuesta] = useState({
    encuestador: "",
    encuestado: "",
    preguntas: [""],
    fecha: "",
  });
  const [respondiendoEncuesta, setRespondiendoEncuesta] = useState(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState([]);

  useEffect(() => {
    obtenerEncuestas();
  }, []);

  const obtenerEncuestas = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/encuesta");
      const data = await res.json();
      setEncuestas(data.encuestas || []);
    } catch (error) {
      console.error("Error al obtener encuestas:", error);
    }
  };

  
  const agregarPregunta = () => {
    setNuevaEncuesta((prev) => ({
      ...prev,
      preguntas: [...prev.preguntas, ""],
    }));
  };

  const cambiarPregunta = (index, valor) => {
    const preguntas = [...nuevaEncuesta.preguntas];
    preguntas[index] = valor;
    setNuevaEncuesta({ ...nuevaEncuesta, preguntas });
  };

  const enviarEncuesta = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/encuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaEncuesta),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje);

      Swal.fire("Éxito", "Encuesta creada con éxito", "success");
      setMostrarFormulario(false);
      setNuevaEncuesta({
        encuestador: "",
        encuestado: "",
        preguntas: [""],
        fecha: "",
      });
      obtenerEncuestas();
    } catch (error) {
      console.error("Error al crear encuesta:", error);
      Swal.fire("Error", error.message || "No se pudo crear la encuesta", "error");
    }
  };

  const responderEncuesta = (encuesta) => {
    setRespondiendoEncuesta(encuesta);
    setRespuestasUsuario(Array(encuesta.preguntas.length).fill(""));
  };

  const manejarRespuesta = (index, valor) => {
    const nuevasRespuestas = [...respuestasUsuario];
    nuevasRespuestas[index] = valor;
    setRespuestasUsuario(nuevasRespuestas);
  };

  const enviarRespuestas = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/encuesta/${respondiendoEncuesta._id}/responder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas: respuestasUsuario }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje);

      Swal.fire("Éxito", "Respuestas enviadas correctamente", "success");
      setRespondiendoEncuesta(null);
      obtenerEncuestas();
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
      Swal.fire("Error", "No se pudo enviar las respuestas", "error");
    }
  };

  return (
    <Container className="my-4">
      <h2>Encuestas</h2>

      <Button
        variant="success"
        className="mb-3"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "Cancelar" : "Crear Encuesta"}
      </Button>

      {mostrarFormulario && (
        <Card className="mb-4">
          <Card.Body>
            <h4>Nueva Encuesta</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Encuestador</Form.Label>
                <Form.Control
                  type="text"
                  value={nuevaEncuesta.encuestador}
                  onChange={(e) =>
                    setNuevaEncuesta({ ...nuevaEncuesta, encuestador: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Encuestado</Form.Label>
                <Form.Control
                  type="text"
                  value={nuevaEncuesta.encuestado}
                  onChange={(e) =>
                    setNuevaEncuesta({ ...nuevaEncuesta, encuestado: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={nuevaEncuesta.fecha}
                  onChange={(e) =>
                    setNuevaEncuesta({ ...nuevaEncuesta, fecha: e.target.value })
                  }
                />
              </Form.Group>
              {nuevaEncuesta.preguntas.map((pregunta, index) => (
                <Form.Control
                  className="mb-2"
                  key={index}
                  placeholder={`Pregunta ${index + 1}`}
                  value={pregunta}
                  onChange={(e) => cambiarPregunta(index, e.target.value)}
                />
              ))}
              <Button variant="success" className="me-2" onClick={agregarPregunta}>
                Agregar otra pregunta
              </Button>
              <Button variant="success" onClick={enviarEncuesta}>
                Crear Encuesta
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {encuestas.map((encuesta) => (
        <Card key={encuesta._id} className="mb-3">
          <Card.Body>
            <Card.Title>{encuesta.encuestador} - {encuesta.encuestado}</Card.Title>
            <Card.Text><strong>Fecha:</strong> {new Date(encuesta.fecha).toLocaleDateString()}</Card.Text>
            <strong>Preguntas:</strong>
            <ListGroup className="mb-3">
              {encuesta.preguntas.map((pregunta, idx) => (
                <ListGroup.Item key={idx}>
                  {idx + 1}. {pregunta}
                </ListGroup.Item>
              ))}
            </ListGroup>

            <Button variant="success" onClick={() => responderEncuesta(encuesta)}>
              Responder
            </Button>

            {encuesta.respuestas && encuesta.respuestas.length > 0 && (
              <>
                <hr />
                <h5>Respuestas registradas:</h5>
                {encuesta.respuestas.map((respuestaItem, idx) => (
                  <ListGroup className="mb-3" key={idx}>
                    <ListGroup.Item variant="secondary">
                      <strong>Respuestas del usuario {idx + 1}:</strong>
                    </ListGroup.Item>
                    {respuestaItem.respuestas.map((respuesta, i) => (
                      <ListGroup.Item key={i}>
                        {encuesta.preguntas[i]} — <strong>{respuesta}</strong>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ))}
              </>
            )}
          </Card.Body>
        </Card>
      ))}

      {respondiendoEncuesta && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Respondiendo encuesta de {respondiendoEncuesta.encuestador}</Card.Title>
            <Form>
              {respondiendoEncuesta.preguntas.map((pregunta, index) => (
                <div key={index} className="mb-4">
                  <strong>{index + 1}. {pregunta}</strong>
                  <div className="ms-3">
                    <Form.Check
                      type="radio"
                      label="Sí"
                      name={`pregunta-${index}`}
                      value="Sí"
                      checked={respuestasUsuario[index] === "Sí"}
                      onChange={() => manejarRespuesta(index, "Sí")}
                    />
                    <Form.Check
                      type="radio"
                      label="No"
                      name={`pregunta-${index}`}
                      value="No"
                      checked={respuestasUsuario[index] === "No"}
                      onChange={() => manejarRespuesta(index, "No")}
                    />
                  </div>
                </div>
              ))}
              <Button variant="success" onClick={enviarRespuestas}>
                Enviar Respuestas
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Encuesta;
