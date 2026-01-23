import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero */}
      <div className="hero-section">
        <Container>
            <h1 className="display-4 fw-bold">Potencialize seu Trabalho</h1>
            <p className="lead">Ferramentas essenciais para gestão, documentos e processos executivos.</p>
        </Container>
      </div>

      {/* Cards */}
      <Container>
        <Row className="g-4">
            <Col md={6}>
                <Link to="/pdf-tools" className="text-decoration-none">
                    <Card className="h-100 p-4 text-center">
                        <Card.Body>
                            <i className="fas fa-file-pdf fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                            <Card.Title>Ferramentas PDF</Card.Title>
                            <Card.Text>Comprimir, dividir, converter e redimensionar relatórios e documentos em PDF.</Card.Text>
                            <Button variant="outline-primary" className="mt-3">Acessar Ferramentas</Button>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            <Col md={6}>
                 <Link to="/bpmn" className="text-decoration-none">
                    <Card className="h-100 p-4 text-center">
                        <Card.Body>
                            <i className="fas fa-project-diagram fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                            <Card.Title>Modelador BPMN</Card.Title>
                            <Card.Text>Mapeie processos de negócio com o padrão BPMN 2.0. Exporte para apresentações.</Card.Text>
                            <Button variant="outline-primary" className="mt-3">Abrir Editor</Button>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            <Col md={6}>
                 <Link to="/text-editor" className="text-decoration-none">
                    <Card className="h-100 p-4 text-center">
                        <Card.Body>
                            <i className="fas fa-pen-nib fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                            <Card.Title>Editor de Texto</Card.Title>
                            <Card.Text>Ferramentas de correção, formatação e conversão de texto com exportação.</Card.Text>
                            <Button variant="outline-primary" className="mt-3">Abrir Ferramenta</Button>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
