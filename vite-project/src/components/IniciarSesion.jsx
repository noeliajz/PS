import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const IniciarSesion = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formInputs, setFormInputs] = useState({
    usuario: "",
    contrasenia: "",
  });

  const [errores, setErrores] = useState({
    usuario: "",
    contrasenia: "",
  });

  const [loading, setLoading] = useState(false);

  const validarUsuario = (usuario) => {
    if (usuario.length < 3 || usuario.length > 40) {
      return "Debe tener entre 3 y 40 caracteres.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario)) {
      return "Debe ser un correo válido.";
    }
    return "";
  };

  const validarContrasenia = (contrasenia) => {
    if (contrasenia.length < 4 || contrasenia.length > 25) {
      return "Debe tener entre 4 y 25 caracteres.";
    }
    return "";
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    if (value.length > 25) return;

    setFormInputs({ ...formInputs, [name]: value });

    let errorMsg = "";
    if (name === "usuario") errorMsg = validarUsuario(value);
    if (name === "contrasenia") errorMsg = validarContrasenia(value);

    setErrores({ ...errores, [name]: errorMsg });
  };

  const handleLogin = async (ev) => {
    ev.preventDefault();

    const usuarioError = validarUsuario(formInputs.usuario);
    const contraseniaError = validarContrasenia(formInputs.contrasenia);

    if (usuarioError || contraseniaError) {
      setErrores({ usuario: usuarioError, contrasenia: contraseniaError });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          typeof errorData.msg === "string"
            ? errorData.msg
            : "Credenciales incorrectas."
        );
      }

      const data = await response.json();

      // ✅ Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("categoria", data.categoria);

      // ✅ Guardar en el contexto global
      login(data.token, data.role, data.categoria);

      alert("Inicio de sesión exitoso");
      navigate("/PagParaTodos");
    } catch (error) {
      alert("Error en el inicio de sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("Enviando al backend:", formInputs);

  return (
    <Container fluid className="estiloLoginContenedor colorHome">
      <Row>
        <Col className="d-flex justify-content-center" sm={12} md={10} lg={12}>
          <Form className="p-5 text-center" onSubmit={handleLogin}>
            <Form.Group controlId="formBasicUsuario">
              <Form.Label className="fs-5">Ingresar usuario</Form.Label>
              <Form.Control
                name="usuario"
                value={formInputs.usuario}
                onChange={handleChange}
                className={
                  errores.usuario ? "form-control is-invalid" : "form-control"
                }
                type="text"
                maxLength={50}
                required
              />
              {errores.usuario && (
                <Form.Text className="text-danger">
                  {errores.usuario}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="fs-5">Ingresar contraseña</Form.Label>
              <Form.Control
                name="contrasenia"
                value={formInputs.contrasenia}
                onChange={handleChange}
                className={
                  errores.contrasenia
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="password"
                maxLength={50}
                required
              />
              {errores.contrasenia && (
                <Form.Text className="text-danger">
                  {errores.contrasenia}
                </Form.Text>
              )}
            </Form.Group>

            <NavLink
              to="#"
              className="fs-4 colorBoton nav-link"
              onClick={handleLogin}
              style={{
                pointerEvents: loading ? "none" : "auto",
                textAlign: "center",
              }}
            >
              {loading ? "Cargando..." : "Ingresar"}
            </NavLink>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default IniciarSesion;
