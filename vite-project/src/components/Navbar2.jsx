// src/components/Navbar2.jsx
import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import icono from '../assets/icono.png';
import '../css/style.css';

function Navbar2() {
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="colorNavbar">
      <Container>
        <Navbar.Brand href="/" className="colorLetrasNavbar fs-3">
          <img src={icono} alt="icono" width="40px" height="40px" /> PS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
{/*             <Nav.Link href="/" className="colorLetrasNavbar fs-4">Inicio</Nav.Link>
 */}            {token && (
              <>
                <Nav.Link href="/Foro" className="colorLetrasNavbar fs-4">Foro</Nav.Link>
                <Nav.Link href="/Diagramas" className="colorLetrasNavbar fs-4">Diagramas</Nav.Link>
                <Nav.Link href="/Video" className="colorLetrasNavbar fs-4">Videos</Nav.Link>
                <Nav.Link href="/Evaluacion" className="colorLetrasNavbar fs-4">Evaluaciones</Nav.Link>
                <Nav.Link href="/Entrevista" className="colorLetrasNavbar fs-4">Entrevistas</Nav.Link>
                <Nav.Link href="/Indicadores" className="colorLetrasNavbar fs-4">Indicadores</Nav.Link>
                <Nav.Link href="/Encuesta" className="colorLetrasNavbar fs-4">Encuestas</Nav.Link>
                <Nav.Link href="/Simulaciones" className="colorLetrasNavbar fs-4">Simulaciones</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {token ? (
              <Nav.Link className="colorLetrasNavbar fs-4" onClick={handleLogout}>
                Cerrar sesión
              </Nav.Link>
            ) : (
              <>
                <Nav.Link href="/Login" className="colorLetrasNavbar fs-4">Login</Nav.Link>
                <Nav.Link href="/Register" className="colorLetrasNavbar fs-4">Registro</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar2;
