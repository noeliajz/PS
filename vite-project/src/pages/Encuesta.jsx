import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function Encuesta() {
  return (
    <Container>
      <Form>
        <Form.Label>1. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?</Form.Label>
        <div className="d-flex flex-row gap-3 py-3"> 
          {[...Array(10)].map((_, index) => (
            <Form.Check
              key={index + 1}
              inline
              label={index + 1}
              name="group1"
              type="checkbox"
              id={`checkbox-${index + 1}`}
            />
          ))}
        </div>
      </Form>
      <Form>
        <Form.Label>2. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?</Form.Label>
        <div className="d-flex flex-row gap-3 py-3"> 
          {[...Array(10)].map((_, index) => (
            <Form.Check
              key={index + 1}
              inline
              label={index + 1}
              name="group1"
              type="checkbox"
              id={`checkbox-${index + 1}`}
            />
          ))}
        </div>
      </Form>
      <Form>
        <Form.Label>3. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?</Form.Label>
        <div className="d-flex flex-row gap-3 py-3"> 
          {[...Array(10)].map((_, index) => (
            <Form.Check
              key={index + 1}
              inline
              label={index + 1}
              name="group1"
              type="checkbox"
              id={`checkbox-${index + 1}`}
            />
          ))}
        </div>
      </Form>
      <Form>
        <Form.Label>4. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?</Form.Label>
        <div className="d-flex flex-row gap-3 py-3"> 
          {[...Array(10)].map((_, index) => (
            <Form.Check
              key={index + 1}
              inline
              label={index + 1}
              name="group1"
              type="checkbox"
              id={`checkbox-${index + 1}`}
            />
          ))}
        </div>
      </Form>
      <Form>
        <Form.Label>5. Del 1 al 10, ¿qué puntaje le pondrías al capacitador?</Form.Label>
        <div className="d-flex flex-row gap-3 py-3"> 
          {[...Array(10)].map((_, index) => (
            <Form.Check
              key={index + 1}
              inline
              label={index + 1}
              name="group1"
              type="checkbox"
              id={`checkbox-${index + 1}`}
            />
          ))}
        </div>
      </Form>
    </Container>
  );
}

export default Encuesta;
