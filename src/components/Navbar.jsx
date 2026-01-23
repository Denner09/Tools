import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import logo from '../assets/logo.png';

const AppNavbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar expand="lg" fixed="top" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Business tools" height="30" className="d-inline-block align-top me-2" />
            Business tools
        </Navbar.Brand>
        
        <div className="d-flex align-items-center gap-3 order-lg-last ms-lg-3">
             <div className="theme-toggle" onClick={toggleTheme} style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}>
                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
             <NavDropdown title="Menu" id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={NavLink} to="/" end>Início</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/text-editor">Editor de Texto</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/pdf-tools">Ferramentas PDF</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/bpmn">Fluxograma BPMN</NavDropdown.Item>
             </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
