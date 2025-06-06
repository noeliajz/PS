import React, { useState, useEffect } from "react";
import { Container, Button, Form, Card, ListGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFilePen } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";

function Evaluacion() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evaluacionActual, setEvaluacionActual] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaEvaluacion, setNuevaEvaluacion] = useState({
    titulo: "",
    notaMaxima: 0,
    preguntas: [
      {
        enunciado: "",
        opciones: ["", "", "", ""],
        respuestaCorrecta: "",
      },
    ],
  });

  useEffect(() => {
    obtenerEvaluaciones();
  }, []);

  const obtenerEvaluaciones = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/evaluacion");
      const data = await res.json();
      setEvaluaciones(data.evaluaciones || []);
    } catch (error) {
      console.error("Error al obtener evaluaciones:", error);
    }
  };

  const handleResponderEvaluacion = (eva) => {
    setEvaluacionActual(eva);
    setRespuestas({});
  };

  const handleSeleccionRespuesta = (indexPregunta, valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [indexPregunta]: valor,
    }));
  };

  const enviarRespuestas = async () => {
    try {
      const respuestasUsuario = evaluacionActual.preguntas.map(
        (_, i) => respuestas[i] || ""
      );
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1])); // decodifica el payload del JWT
      const usuario = payload.usuario || payload.nombre || "Anónimo";

      const res = await fetch("http://localhost:8080/api/evaluacion/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluacionId: evaluacionActual._id,
          respuestasUsuario,
          usuario,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje);

      Swal.fire("Resultado", `Tu nota es: ${data.notaFinal}`, "success");
      setEvaluacionActual(null);
      obtenerEvaluaciones();
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
      Swal.fire("Error", "No se pudo calcular la nota", "error");
    }
  };

  const manejarCambio = (indexPregunta, campo, valor, indexOpcion = null) => {
    const preguntas = [...nuevaEvaluacion.preguntas];
    if (campo === "opciones") {
      preguntas[indexPregunta].opciones[indexOpcion] = valor;
    } else {
      preguntas[indexPregunta][campo] = valor;
    }
    setNuevaEvaluacion({ ...nuevaEvaluacion, preguntas });
  };

  const agregarPregunta = () => {
    setNuevaEvaluacion((prev) => ({
      ...prev,
      preguntas: [
        ...prev.preguntas,
        {
          enunciado: "",
          opciones: ["", "", "", ""],
          respuestaCorrecta: "",
        },
      ],
    }));
  };

  const enviarEvaluacion = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/evaluacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaEvaluacion),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Errores de validación:", data.errores);
        throw new Error(data.mensaje);
      }

      Swal.fire("Éxito", "Evaluación creada con éxito", "success");
      setMostrarFormulario(false);
      setNuevaEvaluacion({
        titulo: "",
        notaMaxima: 0,
        preguntas: [
          {
            enunciado: "",
            opciones: ["", "", "", ""],
            respuestaCorrecta: "",
          },
        ],
      });
      obtenerEvaluaciones();
    } catch (error) {
      console.error("Error al crear evaluación:", error.message);
      Swal.fire(
        "Error",
        error.message || "No se pudo crear la evaluación",
        "error"
      );
    }
  };
  const IndicadorEvaluacion = () => {
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "No se encontró token", "error");

    const payload = JSON.parse(atob(token.split(".")[1]));
    const usuario = payload.usuario || payload.nombre || "Anónimo";

    const notasUsuario = [];

    evaluaciones.forEach((eva) => {
      if (eva.notas && eva.notas.length > 0) {
        eva.notas.forEach((nota) => {
          if (nota.usuario === usuario) {
            notasUsuario.push(nota.nota); // sin filtro de >= 4
          }
        });
      }
    });
    
    if (notasUsuario.length === 0) {
      Swal.fire("Indicador", "No tienes evaluaciones aprobadas aún", "info");
      return;
    }

    const promedio = (
      notasUsuario.reduce((acc, nota) => acc + Number(nota), 0) / notasUsuario.length
    ).toFixed(2);
    

    Swal.fire(
      "Indicador de Evaluación",
      `Promedio de aprobadas: ${promedio}`,
      "success"
    );
  };

  return (
    <Container className="my-4">
      <h2>Evaluaciones</h2>
      <div className="d-flex justify-content-center my-4">
        <Button variant="success" onClick={IndicadorEvaluacion}>
          Mi Indicador
        </Button>
      </div>
      {mostrarFormulario && (
        <Card className="mb-4">
          <Card.Body>
            <h4>Nueva Evaluación</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={nuevaEvaluacion.titulo}
                  onChange={(e) =>
                    setNuevaEvaluacion({
                      ...nuevaEvaluacion,
                      titulo: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nota Máxima</Form.Label>
                <Form.Control
                  type="number"
                  value={nuevaEvaluacion.notaMaxima}
                  onChange={(e) =>
                    setNuevaEvaluacion({
                      ...nuevaEvaluacion,
                      notaMaxima: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>

              {nuevaEvaluacion.preguntas.map((pregunta, idx) => (
                <div key={idx} className="mb-4">
                  <h5>Pregunta {idx + 1}</h5>
                  <Form.Control
                    className="mb-2"
                    placeholder="Enunciado"
                    value={pregunta.enunciado}
                    onChange={(e) =>
                      manejarCambio(idx, "enunciado", e.target.value)
                    }
                  />

                  {pregunta.opciones.map((opcion, i) => (
                    <Form.Control
                      key={i}
                      className="mb-1"
                      placeholder={`Opción ${i + 1}`}
                      value={opcion}
                      onChange={(e) =>
                        manejarCambio(idx, "opciones", e.target.value, i)
                      }
                    />
                  ))}

                  <Form.Control
                    className="mt-2"
                    placeholder="Respuesta correcta"
                    value={pregunta.respuestaCorrecta}
                    onChange={(e) =>
                      manejarCambio(idx, "respuestaCorrecta", e.target.value)
                    }
                  />
                </div>
              ))}
            </Form>
          </Card.Body>
        </Card>
      )}

      {evaluaciones.length === 0 ? (
        <p>No hay evaluaciones registradas.</p>
      ) : (
        evaluaciones.map((eva) => (
          <Card key={eva._id} className="my-3">
            <Card.Body>
              <Card.Title>{eva.titulo}</Card.Title>
              <Card.Text>
                <strong>Nota máxima:</strong> {eva.notaMaxima}
              </Card.Text>
              <Card.Text>
                <strong>Fecha de creación:</strong>{" "}
                {new Date(eva.fechaCreacion).toLocaleString()}
              </Card.Text>

              <strong>Preguntas:</strong>
              <ListGroup className="mb-3">
                {eva.preguntas.map((pregunta, index) => (
                  <ListGroup.Item key={index}>
                    <p>
                      <strong>
                        {index + 1}. {pregunta.enunciado}
                      </strong>
                    </p>
                    <ul>
                      {pregunta.opciones.map((opcion, i) => (
                        <li key={i}>{opcion}</li>
                      ))}
                    </ul>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <strong>Notas registradas:</strong>
              {eva.notas && eva.notas.length > 0 ? (
                <ListGroup className="mb-3">
                  {eva.notas.map((nota, idx) => (
                    <ListGroup.Item key={idx}>
                      Usuario: {nota.usuario || "N/A"} - Nota: {nota.nota} -
                      Fecha: {new Date(nota.fecha).toLocaleString()}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No hay notas aún.</p>
              )}

              <Button
                variant="success"
                onClick={() => handleResponderEvaluacion(eva)}
              >
                Responder
              </Button>
            </Card.Body>
          </Card>
        ))
      )}

      {evaluacionActual && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Respondiendo: {evaluacionActual.titulo}</Card.Title>
            <Form>
              {evaluacionActual.preguntas.map((pregunta, index) => (
                <div key={index} className="mb-4">
                  <strong>
                    {index + 1}. {pregunta.enunciado}
                  </strong>
                  {pregunta.opciones.map((opcion, i) => (
                    <Form.Check
                      key={i}
                      type="radio"
                      label={opcion}
                      name={`pregunta-${index}`}
                      value={opcion}
                      checked={respuestas[index] === opcion}
                      onChange={() => handleSeleccionRespuesta(index, opcion)}
                      className="ms-3"
                    />
                  ))}
                </div>
              ))}
              <Button variant="success" onClick={enviarRespuestas}>
                Enviar respuestas
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Evaluacion;
