import Button from "react-bootstrap/Button";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";  // Importa useState

function Agroquimico() {
  const [selecciones, setSelecciones] = useState({
    select1: "", // Almacena el valor de la primera selección
    select2: "", // Almacena el valor de la segunda selección
    select3: "", // Almacena el valor de la tercera selección
    select4: "", // Almacena el valor de la cuarta selección
    select5: "", // Almacena el valor de la quinta selección
  });

  const [resultado, setResultado] = useState("");  // Estado para mostrar el resultado (Aprobado/Desaprobado)
  const [suma, setSuma] = useState(0);  // Estado para almacenar la suma de los valores seleccionados

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelecciones((prevSelecciones) => ({
      ...prevSelecciones,
      [name]: value,  // Actualiza el valor correspondiente en el objeto de selecciones
    }));
  };

  const handleSubmit = () => {
    // Calcula la suma de acuerdo con los valores seleccionados
    let total = 0;

    // Definir los valores correspondientes
    const valores = {
      "1": 0, "2": 2, "3": 0, // Primera selección
      "4": 0, "5": 2, "6": 0, // Segunda selección
      "7": 0, "8": 0, "9": 2, // Tercera selección
      "10": 2, "11": 0, // Cuarta selección
      "12": 0, "13": 0, "14": 2, // Quinta selección
    };

    // Sumar los valores de las selecciones
    total += valores[selecciones.select1] || 0;
    total += valores[selecciones.select2] || 0;
    total += valores[selecciones.select3] || 0;
    total += valores[selecciones.select4] || 0;
    total += valores[selecciones.select5] || 0;

    setSuma(total); // Actualiza la suma total

    // Verificar si la suma es mayor o igual a 6
    if (total >= 6) {
      setResultado("Aprobado");
    } else {
      setResultado("Desaprobado");
    }
  };

  return (
    <Container fluid className="colorHome py-2">
      <Row>
        <h3 className="text-center py-2">Evaluación</h3>

        <Col sm={12} md={10} lg={10} className="d-flex justify-content-center flex-column">
          {/* Primer select */}
          <Form.Select name="select1" onChange={handleChange} aria-label="Default select example" className="mb-3">
            <option>1. ¿Qué son los agroquímicos?</option>
            <option value="1">Son sustancias no tóxicas</option>
            <option value="2">Son sustancias que se usan en la agricultura que pueden tener consecuencias en la salud</option>
            <option value="3">Ninguna</option>
          </Form.Select>
          
          {/* Segundo select */}
          <Form.Select name="select2" onChange={handleChange} aria-label="Default select example" className="mb-3">
            <option>2. ¿Qué tipo de agroquímicos existen?</option>
            <option value="4">Herbicidas</option>
            <option value="5">Herbicidas, Insecticidas, acaricidas, orgánicos</option>
            <option value="6">Ninguno</option>
          </Form.Select>

          {/* Tercer select */}
          <Form.Select name="select3" onChange={handleChange} aria-label="Default select example" className="mb-3">
            <option>3. ¿Cuales son las consecuencias en nuestra salud?</option>
            <option value="7">Ninguna</option>
            <option value="8">Piel</option>
            <option value="9">Piel, pulmones</option>
          </Form.Select>

          {/* Cuarto select */}
          <Form.Select name="select4" onChange={handleChange} aria-label="Default select example" className="mb-3">
            <option>4. ¿Existen normas de seguridad para ellos?</option>
            <option value="10">Si</option>
            <option value="11">No</option>
          </Form.Select>

          {/* Quinto select */}
          <Form.Select name="select5" onChange={handleChange} aria-label="Default select example" className="mb-3">
            <option>5. ¿A donde acudir en caso de intoxicación?</option>
            <option value="12">Caps</option>
            <option value="13">Sanatorios</option>
            <option value="14">Todos</option>
          </Form.Select>

          {/* Mostrar el resultado */}
          <div className="text-center mt-2">
            <h4>Resultado: {resultado}</h4>
            <h5>Total: {suma}</h5>
          </div>

          {/* Botón de enviar */}
          <Button variant="primary" className="m-5" onClick={handleSubmit}>Enviar</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Agroquimico;
