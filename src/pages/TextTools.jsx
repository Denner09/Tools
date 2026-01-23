import React, { useState } from 'react';
import { Container, Button, Form, ButtonGroup, Dropdown } from 'react-bootstrap';
import { jsPDF } from 'jspdf';

const TextTools = () => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({ words: 0, chars: 0 });

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        updateStats(newText);
    };

    const updateStats = (txt) => {
        const trimmed = txt.trim();
        setStats({
            words: trimmed ? trimmed.split(/\s+/).length : 0,
            chars: txt.length
        });
    };

    const formatCNJ = (input) => {
        // If it looks formatted and has digits, strip formatting
        const hasFormatting = /[\.\-]/.test(input) && /\d/.test(input);
        if (hasFormatting) {
            return input.replace(/\D/g, ''); // Return plain numbers
        }

        let transformedText = input;
        let matchFound = false;

        // 20-digit pattern (already has DD)
        // Pattern: 7(Seq) 2(DD) 4(Year) 1(J) 2(TR) 4(OOOO)
        const cnj20Regex = /\b(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})\b/g;
        
        transformedText = transformedText.replace(cnj20Regex, (match, seq, dd, year, j, tr, oooo) => {
            matchFound = true;
            return `${seq}-${dd}.${year}.${j}.${tr}.${oooo}`;
        });

        // 18-digit pattern (calculate DD)
        const cnj18Regex = /\b(\d{7})\D*(\d{4})\D*(\d{1})\D*(\d{2})\D*(\d{4})\b/g;

        transformedText = transformedText.replace(cnj18Regex, (match, seq, year, j, tr, oooo) => {
            // Avoid re-matching already formatted parts if they fit the pattern loosely
            if (match.includes('-') || match.includes('.')) {
                return match;
            }

            matchFound = true;
            // Suffix is J + TR + OOOO
            const suffix = j + tr + oooo;
            
            // Calculate Mod 97
            // Seq + Year + Suffix + "00"
            const numStr = seq + year + suffix + "00";
            
            try {
                // Ensure we use BigInt
                let remainder = BigInt(numStr) % 97n;
                let dd = 98n - remainder;
                let ddStr = dd.toString().padStart(2, '0');
                
                return `${seq}-${ddStr}.${year}.${j}.${tr}.${oooo}`;
            } catch (e) {
                console.error("CNJ Calc Error", e);
                return match;
            }
        });

        if (!matchFound) {
             // Optional: alert or toast
             // console.log("No CNJ patterns found");
        }
        return transformedText;
    };

    const transform = (type) => {
        let newText = text;
        switch (type) {
            case 'upper':
                newText = text.toUpperCase();
                break;
            case 'lower':
                newText = text.toLowerCase();
                break;
            case 'title':
                newText = text.toLowerCase().replace(/(^|\s)\S/g, t => t.toUpperCase());
                break;
            case 'sentence':
                newText = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
                break;
            case 'alternating':
                 newText = "";
                 for (let i = 0; i < text.length; i++) {
                     newText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
                 }
                break;
            case 'nolinebreak':
                newText = text.replace(/(\r\n|\n|\r)/gm, " ");
                break;
            case 'cnj':
                 newText = formatCNJ(text);
                break;
            default: break;
        }
        setText(newText);
        updateStats(newText);
    };

    const downloadFile = (content, fileName, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        const maxLineWidth = pageWidth - (margin * 2);
        
        const splitText = doc.splitTextToSize(text, maxLineWidth);
        
        doc.setFontSize(12);
        let y = 10;
        const pageHeight = doc.internal.pageSize.getHeight();
        
        splitText.forEach(line => {
            if (y > pageHeight - 10) {
                doc.addPage();
                y = 10;
            }
            doc.text(line, margin, y);
            y += 7;
        });
        
        doc.save('documento.pdf');
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Editor de Texto</h2>
            <div className="mb-3 d-flex flex-wrap gap-2">
                <ButtonGroup>
                    <Button variant="outline-primary" onClick={() => transform('upper')}>MAIÚSCULAS</Button>
                    <Button variant="outline-primary" onClick={() => transform('lower')}>minúsculas</Button>
                    <Button variant="outline-primary" onClick={() => transform('title')}>Título</Button>
                    <Button variant="outline-primary" onClick={() => transform('sentence')}>Frase</Button>
                </ButtonGroup>
                 <ButtonGroup>
                    <Button variant="outline-secondary" onClick={() => transform('nolinebreak')}>Rm Quebras</Button>
                    <Button variant="outline-info" onClick={() => transform('cnj')}>CNJ</Button>
                 </ButtonGroup>
            </div>
            
            <Form.Group className="mb-3">
                <Form.Control 
                    as="textarea" 
                    rows={12} 
                    value={text} 
                    onChange={handleTextChange} 
                    placeholder="Cole ou digite seu texto aqui..."
                />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="text-muted mb-2 mb-md-0">
                    {stats.words} palavras | {stats.chars} caracteres
                </div>
                <div className="d-flex gap-2">
                     <Button variant="success" onClick={() => navigator.clipboard.writeText(text)}>Copiar</Button>
                     <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle variant="outline-dark">Exportar</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => downloadFile(text, 'texto.txt', 'text/plain')}>TXT</Dropdown.Item>
                            <Dropdown.Item onClick={() => downloadFile(JSON.stringify({text}), 'texto.json', 'application/json')}>JSON</Dropdown.Item>
                            <Dropdown.Item onClick={downloadPDF}>PDF</Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                </div>
            </div>
        </Container>
    );
};

export default TextTools;
