import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Entrevista = () => {
  const [formulario, setFormulario] = useState({
    entrevistador: '',
    entrevistado: '',
    preguntas: ['', '', '', '', ''],
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [entrevistas, setEntrevistas] = useState([]);

  const handleChangePregunta = (index, value) => {
    const nuevasPreguntas = [...formulario.preguntas];
    nuevasPreguntas[index] = value;
    setFormulario({ ...formulario, preguntas: nuevasPreguntas });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formulario.entrevistador || !formulario.entrevistado || formulario.preguntas.some(p => p.trim() === '')) {
      alert('Completá todos los campos antes de guardar.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/entrevista', formulario);
      setFormulario({ entrevistador: '', entrevistado: '', preguntas: ['', '', '', '', ''] });
      setMostrarFormulario(false); // Oculta el formulario después de guardar
      obtenerEntrevistas(); // Refresca la lista
    } catch (error) {
      console.error('Error al guardar la entrevista:', error);
    }
  };

  const obtenerEntrevistas = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/entrevista');
      setEntrevistas(res.data.Entrevistas);
    } catch (error) {
      console.error('Error al obtener entrevistas:', error);
    }
  };

  useEffect(() => {
    obtenerEntrevistas();
  }, []);

  return (
    <>
      <div className="text-center mt-3">
        <Button variant="success" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? 'Cancelar' : 'Hacer Entrevista'}
        </Button>
      </div>

      {mostrarFormulario && (
        <Form className='text-center py-3' onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Entrevistador</Form.Label>
            <Form.Control
              type="text"
              value={formulario.entrevistador}
              onChange={(e) => setFormulario({ ...formulario, entrevistador: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Entrevistado</Form.Label>
            <Form.Control
              type="text"
              value={formulario.entrevistado}
              onChange={(e) => setFormulario({ ...formulario, entrevistado: e.target.value })}
            />
          </Form.Group>

          {[
            '1. ¿Qué edad tenés?',
            '2. ¿Hace cuántos años trabajás en la empresa?',
            '3. ¿Qué te pareció la simulación?',
            '4. ¿Recomendás repetirla?',
            '5. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?'
          ].map((pregunta, i) => (
            <Form.Group className="mb-3" key={i}>
              <Form.Label>{pregunta}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formulario.preguntas[i]}
                onChange={(e) => handleChangePregunta(i, e.target.value)}
              />
            </Form.Group>
          ))}

          <Button type="submit" variant="primary">Guardar</Button>
        </Form>
      )}

      <hr />
      <h3 className="text-center">Entrevistas Realizadas</h3>
      <div className="px-4">
        {entrevistas.length === 0 ? (
          <p>No hay entrevistas registradas aún.</p>
        ) : (
          entrevistas.map((e, index) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <p><strong>Entrevistador:</strong> {e.entrevistador}</p>
              <p><strong>Entrevistado:</strong> {e.entrevistado}</p>
              <p><strong>Fecha:</strong> {new Date(e.fecha).toLocaleDateString()}</p>
              <ol>
                {e.preguntas.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ol>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Entrevista;
