import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar } from 'react-bootstrap';
import { PDFDocument, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const PDFTools = () => {
    const [activeTool, setActiveTool] = useState('merge');
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);

    const tools = [
        { id: 'merge', icon: 'fa-layer-group', label: 'Juntar PDF' },
        { id: 'split', icon: 'fa-cut', label: 'Dividir PDF' },
        { id: 'rotate', icon: 'fa-sync-alt', label: 'Rodar PDF' },
        { id: 'compress', icon: 'fa-compress-arrows-alt', label: 'Comprimir PDF' },
    ];

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const processMerge = async () => {
        if (files.length < 2) return alert("Selecione pelo menos 2 arquivos");
        setProcessing(true);
        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, 'merged.pdf');
        } catch (error) {
            console.error(error);
            alert("Erro ao processar: " + error.message);
        }
        setProcessing(false);
    };

    const processSplit = async () => {
        if (files.length !== 1) return alert("Selecione 1 arquivo");
        setProcessing(true);
        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const zip = new JSZip();

            const pageCount = pdf.getPageCount();
            for (let i = 0; i < pageCount; i++) {
                const newPdf = await PDFDocument.create();
                const [page] = await newPdf.copyPages(pdf, [i]);
                newPdf.addPage(page);
                const pdfBytes = await newPdf.save();
                zip.file(`page_${i + 1}.pdf`, pdfBytes);
            }
            
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'split_pages.zip');
        } catch (error) {
            console.error(error);
            alert("Erro ao processar: " + error.message);
        }
        setProcessing(false);
    };

    const processRotate = async () => {
         if (files.length !== 1) return alert("Selecione 1 arquivo");
         setProcessing(true);
         try {
             // Rotate all pages 90 degrees clockwise
             const arrayBuffer = await files[0].arrayBuffer();
             const pdf = await PDFDocument.load(arrayBuffer);
             const pages = pdf.getPages();
             pages.forEach(page => {
                 const currentRotation = page.getRotation().angle;
                 page.setRotation(degrees(currentRotation + 90));
             });
             const pdfBytes = await pdf.save();
             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
             saveAs(blob, 'rotated.pdf');
         } catch(e) { 
             console.error(e); 
             alert("Erro ao processar: " + e.message); 
         }
         setProcessing(false);
    };

    const processAction = () => {
        if (activeTool === 'merge') processMerge();
        if (activeTool === 'split') processSplit();
        if (activeTool === 'rotate') processRotate();
        if (activeTool === 'compress') alert("Compressão avançada requer Ghostscript/Backend. (Não implementado nesta versão React ainda)");
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={3} className="mb-4">
                     <Card>
                        <Card.Header>Ferramentas PDF</Card.Header>
                        <div className="list-group list-group-flush">
                            {tools.map(tool => (
                                <button
                                    key={tool.id}
                                    className={`list-group-item list-group-item-action ${activeTool === tool.id ? 'active' : ''}`}
                                    onClick={() => { setActiveTool(tool.id); setFiles([]); }}
                                >
                                    <i className={`fas ${tool.icon} me-2`}></i> {tool.label}
                                </button>
                            ))}
                        </div>
                     </Card>
                </Col>
                <Col md={9}>
                    <Card style={{ minHeight: '400px' }}>
                        <Card.Body>
                            <h3>{tools.find(t => t.id === activeTool)?.label}</h3>
                            <hr />
                            
                            <Form.Group controlId="formFile" className="mb-4">
                                <Form.Label className="fw-bold">Selecione os arquivos PDF</Form.Label>
                                <div className="p-5 bg-light rounded border border-dashed text-center position-relative" style={{borderStyle: 'dashed', cursor: 'pointer', borderColor: '#ccc'}} onClick={() => document.getElementById('fileInput').click()}>
                                     <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                                     <p className="mb-0">Clique para selecionar</p>
                                     <p className="small text-muted mb-3">{activeTool === 'merge' ? 'Múltiplos arquivos permitidos' : 'Apenas um arquivo'}</p>
                                     
                                     {files.length > 0 && (
                                         <div className="text-success mt-3">
                                             <h5 className="mb-2">{files.length} arquivo(s) selecionado(s)</h5>
                                             <ul className="text-muted small list-unstyled">
                                                 {files.map((f, i) => <li key={i}>{f.name} ({(f.size/1024/1024).toFixed(2)} MB)</li>)}
                                             </ul>
                                         </div>
                                     )}
                                </div>
                                <Form.Control 
                                    type="file" 
                                    id="fileInput" 
                                    multiple={activeTool === 'merge'} 
                                    accept=".pdf" 
                                    onChange={handleFileChange} 
                                    className="d-none"
                                />
                            </Form.Group>

                            {activeTool === 'rotate' && (
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    A rotação será aplicada em 90° (horário) em todas as páginas.
                                </div>
                            )}

                             {processing && <ProgressBar animated now={100} label="Processando..." className="mb-3" />}

                            <Button variant="primary" size="lg" className="w-100" onClick={processAction} disabled={processing || files.length === 0}>
                                {processing ? 'Processando...' : 'Executar'}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
export default PDFTools;
