import React from 'react'
import Form from 'react-bootstrap/Form';

const Entrevista = () => {
  return (
    <>
     <Form className='text-center py-3'>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>1. ¿Qué edad tenes?</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>2. ¿Hace cuantos años trabajas en la empresa?</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>3. ¿Que te pareció la simulación?</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>4. ¿Recomendas repetirla?</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>5. Del 1 al 10 que puntaje le pondrías al capacitador?</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <button>Guardar</button>
    </Form> 
    </>
  )
}

export default Entrevista
