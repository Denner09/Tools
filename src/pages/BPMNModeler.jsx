import React, { useEffect, useRef } from 'react';
import BpmnModelerLib from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';

const BPMNModeler = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    
    useEffect(() => {
        if (!modelerRef.current && containerRef.current) {
            modelerRef.current = new BpmnModelerLib({
                container: containerRef.current,
                keyboard: {
                    bindTo: window
                }
            });

            // Create initial diagram
            modelerRef.current.createDiagram().catch(err => {
                console.error('Error creating diagram', err);
            });
        }

        return () => {
            if (modelerRef.current) {
                modelerRef.current.destroy();
                modelerRef.current = null;
            }
        };
    }, []);

    const exportXML = async () => {
        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diagram.bpmn';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    const exportSVG = async () => {
        try {
            const { svg } = await modelerRef.current.saveSVG();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diagram.svg';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

     const handleFileLoad = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                modelerRef.current.importXML(reader.result).catch(err => console.error(err));
            };
            reader.readAsText(file);
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            <div className="p-2 border-bottom d-flex justify-content-between align-items-center bg-light">
                 <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={() => document.getElementById('bpmnInput').click()}>
                        <i className="fas fa-folder-open me-2"></i> Abrir
                    </Button>
                    <input type="file" id="bpmnInput" accept=".bpmn,.xml" onChange={handleFileLoad} className="d-none" />
                    
                    <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-success">Exportar</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={exportXML}>BPMN (.bpmn)</Dropdown.Item>
                            <Dropdown.Item onClick={exportSVG}>Imagem (.svg)</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                 </div>
                 <div className="text-muted small fw-bold">BPMN 2.0 Modeler</div>
            </div>
            <div className="modeler-container" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
                 <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
            </div>
        </div>
    );
};

export default BPMNModeler;
