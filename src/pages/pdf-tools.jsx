"use client";

import React, { useState, useCallback, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import * as Diff from 'diff';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PDFToolsSidebar, { tools } from '../components/pdf-tools/PDFToolsSidebar';
import FileDropzone from '../components/pdf-tools/FileDropzone';

export default function PDFToolsPage() {
    const router = useRouter();
    const [activeTool, setActiveTool] = useState('merge');
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [splitRanges, setSplitRanges] = useState('');
    const [diffResult, setDiffResult] = useState(null);

    const [ocrProgress, setOcrProgress] = useState(0);
    const [compressionLevel, setCompressionLevel] = useState('normal');
    const [customTargetMB, setCustomTargetMB] = useState('');
    const [showSplitConfirm, setShowSplitConfirm] = useState(false);
    const [compressedBlob, setCompressedBlob] = useState(null);
    const [splitMode, setSplitMode] = useState('range'); // 'range' or 'size'
    const [ocrMode, setOcrMode] = useState('extract'); // 'extract', 'searchable', 'compare'
    const [extractedText, setExtractedText] = useState('');
    
    // Crop States
    const [cropPage, setCropPage] = useState(1);
    const [cropSelection, setCropSelection] = useState(null); // {x, y, w, h} (normalized 0-1 or pixels)
    const [cropFormat, setCropFormat] = useState('png'); // png, jpg, pdf
    const [cropImgData, setCropImgData] = useState(null); // To store the rendered page data URL for display

    // Rotate States
    const [rotateMode, setRotateMode] = useState('all'); // 'all', 'page'
    const [rotateAngle, setRotateAngle] = useState(90); // 90, 180, 270 (clockwise adds to current)
    const [rotatePage, setRotatePage] = useState(1);
    const [rotateImgData, setRotateImgData] = useState(null);

    // Numbering States
    const [numPosition, setNumPosition] = useState('bottom-center'); // 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'
    const [numStart, setNumStart] = useState(1);
    const [numColor, setNumColor] = useState('#000000');
    const [numTextFormat, setNumTextFormat] = useState('page_num'); // 'page_num' ("Página X") or 'num_only' ("X")
    const [numPage, setNumPage] = useState(1); // For preview navigation
    const [numImgData, setNumImgData] = useState(null); // Preview image logic

    // Convert States
    const [convertFormat, setConvertFormat] = useState('word'); // 'word', 'excel', 'powerpoint', 'jpg', 'png', 'svg'

    // Crop Refs
    const dragStart = useRef(null);
    const isDragging = useRef(false);

    const onCropMouseDown = (e) => {
        if (activeTool !== 'crop') return;
        // Don't start drag if clicking on the control handles (if we had them)
        // For simple Box drawing:
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        dragStart.current = { x, y };
        isDragging.current = true;
        
        // Update selection to start point
        setCropSelection(prev => ({
            ...prev,
            x: x, 
            y: y, 
            width: 0, 
            height: 0
        }));
    };

    const onCropMouseMove = (e) => {
        if (!isDragging.current || !dragStart.current) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const startX = dragStart.current.x;
        const startY = dragStart.current.y;
        
        // Calculate new box
        let newX = Math.min(startX, currentX);
        let newY = Math.min(startY, currentY);
        let newW = Math.abs(currentX - startX);
        let newH = Math.abs(currentY - startY);

        // Bounds Checking (cannot go outside image)
        // We need the image dimensions. cropSelection.imgWidth should be set.
        const maxW = cropSelection?.imgWidth || rect.width;
        const maxH = cropSelection?.imgHeight || rect.height;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + newW > maxW) newW = maxW - newX;
        if (newY + newH > maxH) newH = maxH - newY;

        setCropSelection(prev => ({
            ...prev,
            x: newX,
            y: newY,
            width: newW,
            height: newH
        }));
    };

    const onCropMouseUp = () => {
        isDragging.current = false;
        dragStart.current = null;
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (activeTool === 'split' || activeTool === 'compress' || activeTool === 'crop' || activeTool === 'rotate' || activeTool === 'number' || activeTool === 'convert' || activeTool === 'repair') {
            setFiles([acceptedFiles[0]]);
            // Reset crop state on new file
            if (activeTool === 'crop') {
                setCropPage(1);
                setCropSelection(null);
                setCropImgData(null);
            }
            // Reset rotate state on new file
            if (activeTool === 'rotate') {
                setRotatePage(1);
                setRotateAngle(0);
                setRotateImgData(null);
                setRotateMode('all');
            }
            // Reset number state
            if (activeTool === 'number') {
                setNumPosition('bottom-center');
                setNumStart(1);
                setNumPage(1);
                setNumImgData(null);
                setNumColor('#000000');
                setNumTextFormat('page_num');
            }
        } else if (activeTool === 'ocr') {
            if (ocrMode === 'compare') {
                setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 2));
            } else {
                setFiles([acceptedFiles[0]]);
            }
        } else {
            setFiles((prev) => [...prev, ...acceptedFiles]);
        }
    }, [activeTool, ocrMode]);

    const handleCompressClientSide = async () => {
        try {
            setProcessing(true);
            
            // Import PDF.js
            const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
            
            // Set worker properly
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;

            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfJS.getDocument(arrayBuffer).promise;
            const totalPages = pdf.numPages;
            
            const { PDFDocument } = await import('pdf-lib');
            const newPdf = await PDFDocument.create();

            let scale = 1.0;
            let quality = 0.7;

            // Ajuste de parâmetros
            let level = compressionLevel;
            if (level === 'custom') level = 'normal'; // Base para custom é normal

            // Ajuste de parâmetros focado em LEGIBILIDADE
            // Scale mais alto = Menos pixelado (texto nítido)
            // Quality menor = Arquivo menor (compensar o scale alto)
            
            // Ajuste de parâmetros REFINADO
            // Scale 1.5 gerou arquivos gigantes (dobrou o tamanho). Vamos reduzir.
            // Scale 1.0 é o ideal para leitura. Quality define a limpeza do traço.
            
            // Ajuste de parâmetros - ESTRATÉGIA "NIITIDEZ"
            // Mantemos a escala mais alta (para o texto não borrar/pixelar)
            // Mas reduzimos a qualidade do JPEG (para o arquivo diminuir)
            // Texto nítido com leve ruído é melhor que texto limpo mas borrado.
            
            if (level === 'normal') {
                // Escala 1.0 (Tamanho real) - Qualidade 0.5 (Média)
                // Deve ficar legível e tentar reduzir o tamanho.
                scale = 1.0; 
                quality = 0.5; 
            } else if (level === 'high') {
                // Escala 0.8 (Leve redução) - Qualidade 0.4
                // Deve reduzir bem o tamanho.
                scale = 0.8;
                quality = 0.4;
            } else if (level === 'extreme') {
                scale = 0.6;
                quality = 0.3;
            }

            for (let i = 1; i <= totalPages; i++) {
                setOcrProgress(Math.round((i / totalPages) * 100));
                
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: scale }); 
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;

                const imgData = canvas.toDataURL('image/jpeg', quality);
                const imgBytes = await fetch(imgData).then(r => r.arrayBuffer());
                
                const jpgImage = await newPdf.embedJpg(imgBytes);
                const newPage = newPdf.addPage([viewport.width, viewport.height]);
                newPage.drawImage(jpgImage, {
                    x: 0,
                    y: 0,
                    width: viewport.width,
                    height: viewport.height,
                });
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const newSizeMB = blob.size / 1024 / 1024;

            // Lógica Personalizada
            if (compressionLevel === 'custom' && customTargetMB) {
                const target = parseFloat(customTargetMB);
                if (newSizeMB > target) {
                    setCompressedBlob(blob);
                    setShowSplitConfirm(true);
                    setProcessing(false);
                    return;
                }
            }
            
            // Download normal
            downloadBlob(blob, `comprimido_${compressionLevel}_${file.name}`);
            
            const originalSize = file.size / 1024 / 1024;
            const reduction = (100 - (newSizeMB/originalSize*100)).toFixed(1);
            
            if (newSizeMB > originalSize) {
                alert(`Atenção: O arquivo ficou maior (${reduction}%)!\n\nIsso acontece porque converter texto em imagem gasta mais espaço se o PDF original já for otimizado. Tente o nível 'Extremo'.\n\nOriginal: ${originalSize.toFixed(2)} MB\nNovo: ${newSizeMB.toFixed(2)} MB`);
            } else {
                alert(`Compressão Concluída!\n\nOriginal: ${originalSize.toFixed(2)} MB\nNovo: ${newSizeMB.toFixed(2)} MB\nRedução: ${reduction}%`);
            }
            
            setFiles([]);
        } catch (e) {
            console.error(e);
            alert("Erro na compressão local: " + e.message);
        } finally {
            if (!showSplitConfirm) {
                setProcessing(false);
                setOcrProgress(0);
            }
        }
    };

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleSplitAndDownload = async () => {
        if (!compressedBlob || !customTargetMB) return;
        setProcessing(true);
        setShowSplitConfirm(false);
        setOcrProgress(0);

        try {
            const JSZip = (await import('jszip')).default;
            const { PDFDocument } = await import('pdf-lib');
            const zip = new JSZip();
            
            const arrayBuffer = await compressedBlob.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const totalPages = sourcePdf.getPageCount();
            const totalSize = arrayBuffer.byteLength;
            const avgPageSize = totalSize / totalPages;
            const targetBytes = parseFloat(customTargetMB) * 1024 * 1024; 

            // Robust "Average Estimation" Strategy
            let currentPartIndices = [];
            let currentEstimatedSize = 0;
            let partIndex = 1;

            for (let i = 0; i < totalPages; i++) {
                if (currentEstimatedSize + avgPageSize > targetBytes && currentPartIndices.length > 0) {
                     await saveBatch(currentPartIndices, partIndex);
                     currentPartIndices = [];
                     currentEstimatedSize = 0;
                     partIndex++;
                }
                currentPartIndices.push(i);
                currentEstimatedSize += avgPageSize;
            }

            if (currentPartIndices.length > 0) {
                 await saveBatch(currentPartIndices, partIndex);
            }

            async function saveBatch(indices, idx) {
                 const newPdf = await PDFDocument.create();
                 const copiedPages = await newPdf.copyPages(sourcePdf, indices);
                 
                 for (const page of copiedPages) {
                     newPdf.addPage(page);
                 }
                 
                 let pdfBytes = await newPdf.save();

                 // Optimization Check (For handleSplitAndDownload)
                 // If the part is > 40% of standard size but has < 40% of pages, it's bloated.
                 // We use compressedBlob here because handleSplitAndDownload works on it.
                 if (pdfBytes.byteLength > totalSize * 0.4 && indices.length < totalPages * 0.4) {
                      try {
                          // Note: optimizePdfPart expects a Blob/File. compressedBlob is a Blob.
                          const optBytes = await optimizePdfPart(compressedBlob, indices);
                          if (optBytes.byteLength < pdfBytes.byteLength) {
                              pdfBytes = optBytes;
                          }
                      } catch (e) {
                          console.warn("Optimization failed for chunk " + idx, e);
                      }
                 }
                 
                 zip.file(`parte_${idx}.pdf`, pdfBytes);
                 
                 // Visual progress
                 const progress = Math.round((idx / (totalPages / (indices.length || 1))) * 100); 
                 setOcrProgress(Math.min(99, progress)); 
            }

            const content = await zip.generateAsync({ type: "blob" });
            downloadBlob(content, `comprimido_dividido_partes.zip`);
            alert("Arquivo dividido e baixado com sucesso!");
            setFiles([]);

        } catch (e) {
            console.error(e);
            alert("Erro ao dividir: " + e.message);
        } finally {
            setProcessing(false);
            setOcrProgress(0);
            setCompressedBlob(null);
        }
    };

    // Helper: Optimize specific pages by rasterization (Reduces size for bloated PDFs)
    const optimizePdfPart = async (file, pageIndices) => {
        const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
        pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfJS.getDocument(arrayBuffer).promise;
        const { PDFDocument } = await import('pdf-lib');
        const newPdf = await PDFDocument.create();

        for (const idx of pageIndices) {
            const pageNum = idx + 1; // pdfjs is 1-based
            try {
                const page = await pdf.getPage(pageNum);
                // Reduce scale slightly to ensure size reduction logic works
                // Scale 1.25 offers good balance between quality and size
                const viewport = page.getViewport({ scale: 1.25 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;
                
                // Compress quality 0.7
                const imgData = canvas.toDataURL('image/jpeg', 0.7);
                const imgBytes = await fetch(imgData).then(r => r.arrayBuffer());
                
                const jpgImage = await newPdf.embedJpg(imgBytes);
                const newPage = newPdf.addPage([viewport.width, viewport.height]);
                newPage.drawImage(jpgImage, {
                    x: 0,
                    y: 0,
                    width: viewport.width,
                    height: viewport.height,
                });
            } catch (e) {
                console.warn(`Skipping page ${pageNum} during optimization`, e);
            }
        }
        return await newPdf.save();
    };

    const handleSplitByRangeClient = async () => {
        if (!files.length) return;
        setProcessing(true);
        setOcrProgress(0);

        try {
            const { PDFDocument } = await import('pdf-lib');
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const totalPages = pdfDoc.getPageCount();

            // Parse Ranges "1-5, 8"
            const indices = new Set();
            const parts = splitRanges.split(',').map(p => p.trim());
            for (const part of parts) {
                if (!part) continue;
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(n => parseInt(n));
                    if (!isNaN(start) && !isNaN(end)) {
                        for (let i = start; i <= end; i++) indices.add(i - 1);
                    }
                } else {
                    const page = parseInt(part);
                    if (!isNaN(page)) indices.add(page - 1);
                }
            }
            
            const sortedIndices = Array.from(indices).filter(i => i >= 0 && i < totalPages).sort((a,b) => a-b);
            
            if (sortedIndices.length === 0) throw new Error("Nenhuma página válida selecionada.");

            // Create Standard PDF
            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdfDoc, sortedIndices);
            copiedPages.forEach(p => newPdf.addPage(p));
            let pdfBytes = await newPdf.save();
            
            // Check Size & Optimize if bloated
            const currentSizeMB = pdfBytes.byteLength / 1024 / 1024;
            const originalSizeMB = arrayBuffer.byteLength / 1024 / 1024;
            
            // Heuristic: If split file is > 10MB OR if size didn't reduce proportionally
            if ((currentSizeMB > 10 && sortedIndices.length < 50) || (currentSizeMB > originalSizeMB * 0.8 && sortedIndices.length < totalPages * 0.5)) {
                 console.log("Bloat detected, optimizing...");
                 try {
                     setOcrProgress(50); // visual feedback
                     const optimizedBytes = await optimizePdfPart(file, sortedIndices);
                     if (optimizedBytes.byteLength < pdfBytes.byteLength) {
                         pdfBytes = optimizedBytes;
                     }
                 } catch (optErr) {
                     console.warn("Optimization failed", optErr);
                 }
            }
            
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            downloadBlob(blob, `split_paginas_${file.name}`);
            setFiles([]);

        } catch (e) {
            console.error(e);
            alert("Erro ao dividir: " + e.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleSplitBySize = async () => {
        if (!files[0] || !customTargetMB) return;
        setProcessing(true);
        setOcrProgress(0);

        try {
            const JSZip = (await import('jszip')).default;
            const { PDFDocument } = await import('pdf-lib');
            const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;

            const zip = new JSZip();
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            
            // Load for PDF-Lib (Structure) and PDF.js (Rendering)
            const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const sourcePdfJS = await pdfJS.getDocument(arrayBuffer).promise;
            
            const totalPages = sourcePdf.getPageCount();
            const totalSize = arrayBuffer.byteLength;
            const targetBytes = parseFloat(customTargetMB) * 1024 * 1024;
            
            // 1. Analyze "Bloat"
            const testDoc = await PDFDocument.create();
            const [page1] = await testDoc.copyPages(sourcePdf, [0]);
            testDoc.addPage(page1);
            const testBytes = await testDoc.save();
            const page1Size = testBytes.byteLength;
            const isBloated = (page1Size > totalSize * 0.5) || (page1Size > 5 * 1024 * 1024);
            
            console.log(`Deep Analysis: Total ${totalSize}, Page1 ${page1Size}, Bloated? ${isBloated}`);

            let chunks = [];
            
            if (isBloated) {
                // DYNAMIC RASTERIZATION STRATEGY
                // Accumulate pages one by one until target size is reached
                
                let currentChunkPdf = await PDFDocument.create();
                let currentChunkSize = 0; // Estimated based on JPG sizes
                let currentChunkPageCount = 0;
                let chunkIndex = 1;

                for (let i = 0; i < totalPages; i++) {
                    setOcrProgress(Math.round((i / totalPages) * 100));
                    
                    try {
                        // Render Page
                        const page = await sourcePdfJS.getPage(i + 1);
                        const viewport = page.getViewport({ scale: 1.25 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        await page.render({ canvasContext: context, viewport }).promise;
                        
                        // Compress
                        const imgData = canvas.toDataURL('image/jpeg', 0.7);
                        // Very rough estimate: DataURL length * 0.75 ~= bytes. 
                        // Or accurate: fetch.
                        const res = await fetch(imgData);
                        const imgBytes = await res.arrayBuffer();
                        const imgSize = imgBytes.byteLength;
                        
                        // Check Estimate (Add 5KB overhead for PDF structure per page)
                        const estimatedAddition = imgSize + 5 * 1024;
                        
                        if (currentChunkSize + estimatedAddition > targetBytes && currentChunkPageCount > 0) {
                            // Save Chunk
                            const pdfBytes = await currentChunkPdf.save();
                            zip.file(`parte_${chunkIndex}.pdf`, pdfBytes);
                            
                            // Reset
                            chunkIndex++;
                            currentChunkPdf = await PDFDocument.create();
                            currentChunkSize = 0;
                            currentChunkPageCount = 0;
                        }
                        
                        // Add to current
                        const jpgImage = await currentChunkPdf.embedJpg(imgBytes);
                        const newPage = currentChunkPdf.addPage([viewport.width, viewport.height]);
                        newPage.drawImage(jpgImage, {
                            x: 0,
                            y: 0,
                            width: viewport.width,
                            height: viewport.height,
                        });
                        
                        currentChunkSize += estimatedAddition;
                        currentChunkPageCount++;
                        
                    } catch (err) {
                        console.error(`Error processing page ${i} for split`, err);
                    }
                }
                
                // Save last chunk
                if (currentChunkPageCount > 0) {
                     const pdfBytes = await currentChunkPdf.save();
                     zip.file(`parte_${chunkIndex}.pdf`, pdfBytes);
                }

            } else {
                // STANDARD STRATEGY (Non-Bloated)
                // (Optimized verified greedy approach)
                let startIndex = 0;
                let chunkIndex = 1;
                while (startIndex < totalPages) {
                    let collected = [];
                    let currentEstSize = 0;
                    const avgPage = totalSize / totalPages;

                    for (let i = startIndex; i < totalPages; i++) {
                         collected.push(i);
                         currentEstSize += avgPage;
                         if (currentEstSize > targetBytes * 1.5) break; 
                    }
                    
                    let validChunk = false;
                    while (!validChunk && collected.length > 0) {
                         const tempDoc = await PDFDocument.create();
                         const pgs = await tempDoc.copyPages(sourcePdf, collected);
                         pgs.forEach(p => tempDoc.addPage(p));
                         const bytes = await tempDoc.save();
                         
                         if (bytes.byteLength <= targetBytes || collected.length === 1) {
                             zip.file(`parte_${chunkIndex}.pdf`, bytes);
                             chunkIndex++;
                             validChunk = true;
                             startIndex += collected.length;
                         } else {
                             collected.pop();
                         }
                    }
                    if (collected.length === 0) startIndex++; 
                    setOcrProgress(Math.round((startIndex / totalPages) * 100));
                }
            }

            setOcrProgress(100);
            const content = await zip.generateAsync({ type: "blob" });
            downloadBlob(content, `split_por_tamanho_${files[0].name}.zip`);
            alert("Processo concluído!");
            setFiles([]);

        } catch (e) {
            console.error(e);
            alert("Erro ao dividir por tamanho: " + e.message);
        } finally {
            setProcessing(false);
            setOcrProgress(0);
        }
    };

    // Recortar: Lógica de Renderização da Página
    const renderCropPage = useCallback(async () => {
        if (activeTool !== 'crop' || !files.length) return;
        
        try {
            setProcessing(true);
            const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
             
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            
            if (cropPage > pdf.numPages) setCropPage(pdf.numPages);
            if (cropPage < 1) setCropPage(1);

            const page = await pdf.getPage(cropPage);
            // Escala reduzida para 0.75 conforme solicitado (redução de 50% em relação ao anterior 1.5)
            const viewport = page.getViewport({ scale: 0.75 }); 
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({ canvasContext: context, viewport }).promise;
            setCropImgData(canvas.toDataURL('image/png'));
            setProcessing(false);
            
            // Seleção automática ao centro se não houver seleção
            const w = viewport.width;
            const h = viewport.height;
            
            if (!cropSelection) {
                 setCropSelection({
                      x: w * 0.25,
                      y: h * 0.25,
                      width: w * 0.5,
                      height: h * 0.5,
                      imgWidth: w,
                      imgHeight: h
                 });
            } else {
                 // Ensure img dims are up to date for bounds checking
                 setCropSelection(prev => ({ ...prev, imgWidth: w, imgHeight: h }));
            }

        } catch (e) {
            console.error(e);
            alert("Erro ao renderizar página para corte");
            setProcessing(false);
        }
    }, [activeTool, files, cropPage]);

    React.useEffect(() => {
        if (activeTool === 'crop' && files.length > 0) {
            renderCropPage();
        }
    }, [activeTool, files, cropPage, renderCropPage]);

    const handleCropDownload = async () => {
        if (!cropSelection || !cropImgData) return;

        try {
            // Carrega a imagem de origem (a página renderizada)
            const img = new Image();
            img.src = cropImgData;
            await new Promise(r => img.onload = r);

            // Cria canvas para a área recortada
            const canvas = document.createElement('canvas');
            canvas.width = cropSelection.width;
            canvas.height = cropSelection.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                img, 
                cropSelection.x, cropSelection.y, cropSelection.width, cropSelection.height,
                0, 0, cropSelection.width, cropSelection.height
            );

            if (cropFormat === 'pdf') {
                const { PDFDocument } = await import('pdf-lib');
                const newPdf = await PDFDocument.create();
                const pngUrl = canvas.toDataURL('image/png');
                const pngImageBytes = await fetch(pngUrl).then(res => res.arrayBuffer());
                
                const embeddedImage = await newPdf.embedPng(pngImageBytes);
                const page = newPdf.addPage([cropSelection.width, cropSelection.height]);
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: cropSelection.width,
                    height: cropSelection.height,
                });
                
                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                downloadBlob(blob, `corte_pagina_${cropPage}.pdf`);
            } else {
                canvas.toBlob((blob) => {
                    downloadBlob(blob, `corte_pagina_${cropPage}.${cropFormat}`);
                }, `image/${cropFormat}`);
            }

        } catch (e) {
            console.error(e);
            alert("Erro ao realizar o corte: " + e.message);
        }
    };

    // Rotacionar: Lógica de Renderização da Página
    const renderRotatePage = useCallback(async () => {
        if (activeTool !== 'rotate' || !files.length) return;
        
        try {
            setProcessing(true);
            const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
             
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            
            if (rotatePage > pdf.numPages) setRotatePage(pdf.numPages);
            if (rotatePage < 1) setRotatePage(1);

            const page = await pdf.getPage(rotatePage);
            const viewport = page.getViewport({ scale: 0.5 }); // Small preview
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({ canvasContext: context, viewport }).promise;
            setRotateImgData(canvas.toDataURL('image/png'));
            setProcessing(false);

        } catch (e) {
            console.error(e);
            alert("Erro ao renderizar página para rotação");
            setProcessing(false);
        }
    }, [activeTool, files, rotatePage]);

    React.useEffect(() => {
        if (activeTool === 'rotate' && files.length > 0) {
            renderRotatePage();
        }
    }, [activeTool, files, rotatePage, renderRotatePage]);

    const handleRotate = async () => {
        if (!files.length) return;
        try {
             setProcessing(true);
             const { PDFDocument, degrees } = await import('pdf-lib');
             const arrayBuffer = await files[0].arrayBuffer();
             const pdfDoc = await PDFDocument.load(arrayBuffer);
             const pages = pdfDoc.getPages();

             // Define rotation angle (additive or absolute? Let's treat rotateAngle as additional rotation)
             // The user perceives they are setting an angle.
             // If I say "Rotate 90", I expect it to turn 90 degrees relative to current.
             // But usually tools are "Rotate Clockwise" etc.
             // Let's assume rotateAngle is the DESIRED ROTATION TO APPLY.
             
             if (rotateMode === 'all') {
                 pages.forEach(page => {
                     const currentRotation = page.getRotation().angle;
                     page.setRotation(degrees(currentRotation + rotateAngle));
                 });
             } else {
                 if (rotatePage >= 1 && rotatePage <= pages.length) {
                     const page = pages[rotatePage - 1];
                     const currentRotation = page.getRotation().angle;
                     page.setRotation(degrees(currentRotation + rotateAngle));
                 }
             }

             const pdfBytes = await pdfDoc.save();
             const blob = new Blob([pdfBytes], { type: 'application/pdf' });
             downloadBlob(blob, `rotacionado_${files[0].name}`);
             
             // Reset angle after save? Or keep it? keeping is fine.
             setProcessing(false);
        } catch (e) {
             console.error(e);
             alert("Erro ao rotacionar PDF: " + e.message);
             setProcessing(false);
        }
    };

    // Numbering: Render Page Logic for Preview
    const renderNumPage = useCallback(async () => {
        if (activeTool !== 'number' || !files.length) return;
        
        try {
            // We use pdfjs to render the base page
            const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
             
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            
            if (numPage > pdf.numPages) setNumPage(pdf.numPages);
            if (numPage < 1) setNumPage(1);

            const page = await pdf.getPage(numPage);
            const viewport = page.getViewport({ scale: 0.6 }); // Preview scale
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({ canvasContext: context, viewport }).promise;

            // Now draw the number on top of the canvas
            // Logic must match handleNumbering but adapted for Canvas coordinate system (Top-Left 0,0)
            const fontSize = 14; 
            context.font = `${fontSize}px Helvetica, Arial, sans-serif`;
            context.fillStyle = numColor;
            
            const text = numTextFormat === 'page_num' ? `Página ${numStart + numPage - 1}` : `${numStart + numPage - 1}`;
            const textMetrics = context.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = fontSize; // Approximate height

            const margin = 20; // Visual margin

            let x = 0;
            let y = 0; // Canvas Y starts from top

            // Position Logic for Canvas
            // Top in Canvas is small Y. Bottom in Canvas is large Y.
            if (numPosition.includes('top')) {
                y = margin + textHeight; 
            } else { // bottom
                y = canvas.height - margin;
            }

            if (numPosition.includes('left')) {
                x = margin;
            } else if (numPosition.includes('right')) {
                x = canvas.width - margin - textWidth;
            } else { // center
                x = (canvas.width / 2) - (textWidth / 2);
            }

            context.fillText(text, x, y);

            setNumImgData(canvas.toDataURL('image/png'));

        } catch (e) {
            console.error(e);
            // Silent fail for preview or alert?
        }
    }, [activeTool, files, numPage, numPosition, numStart, numColor, numTextFormat]);

    React.useEffect(() => {
        if (activeTool === 'number' && files.length > 0) {
            renderNumPage();
        }
    }, [activeTool, files, numPage, numPosition, numStart, numColor, numTextFormat, renderNumPage]);

    const handleNumbering = async () => {
        if (!files.length) return;
        try {
            setProcessing(true);
            const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
            
            // Helper to parse hex color to rgb (0-1)
            const r = parseInt(numColor.slice(1, 3), 16) / 255;
            const g = parseInt(numColor.slice(3, 5), 16) / 255;
            const b = parseInt(numColor.slice(5, 7), 16) / 255;

            const arrayBuffer = await files[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            
            pages.forEach((page, index) => {
                const { width, height } = page.getSize();
                const fontSize = 12;
                // Correct logic for text
                const text = numTextFormat === 'page_num' ? `Página ${numStart + index}` : `${numStart + index}`;
                
                const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
                const textHeight = helveticaFont.heightAtSize(fontSize);

                let x = 0;
                let y = 0;
                const margin = 20;

                // Position Logic for PDF-Lib (Bottom-Left 0,0)
                // Top in PDF is Large Y. Bottom in PDF is Small Y.
                if (numPosition.includes('top')) {
                    y = height - margin - textHeight;
                } else {
                    y = margin;
                }

                if (numPosition.includes('left')) {
                    x = margin;
                } else if (numPosition.includes('right')) {
                    x = width - margin - textWidth;
                } else { // center
                    x = (width / 2) - (textWidth / 2);
                }

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font: helveticaFont,
                    color: rgb(r, g, b),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            downloadBlob(blob, `numerado_${files[0].name}`);
            setProcessing(false);

        } catch (e) {
            console.error(e);
            alert("Erro ao inserir numeração: " + e.message);
            setProcessing(false);
        }
    };

    const handleConvert = async () => {
        if (!files.length) return;
        setProcessing(true);
        
        try {
            // Setup PDFJS for rasterization (JPG, PNG) or SVG extraction
            const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
             
            const buffer = await files[0].arrayBuffer();
            const pdf = await pdfJS.getDocument(buffer).promise;
            
            // Format Specific Logic
            if (['jpg', 'png', 'svg'].includes(convertFormat)) {
                const JSZip = (await import('jszip')).default;
                const zip = new JSZip();

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 }); // High quality

                    if (convertFormat === 'svg') {
                         // Fallback: Embed rendered image in SVG (True vector is complex without external libs)
                         const canvas = document.createElement('canvas');
                         const context = canvas.getContext('2d');
                         canvas.width = viewport.width;
                         canvas.height = viewport.height;
                         await page.render({ canvasContext: context, viewport }).promise;
                         const imgData = canvas.toDataURL('image/png');
                         const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${viewport.width}" height="${viewport.height}">
                            <image href="${imgData}" width="100%" height="100%" />
                         </svg>`;
                         zip.file(`pagina_${i}.svg`, svgString);
                    } else { // JPG or PNG
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        
                        await page.render({ canvasContext: context, viewport }).promise;
                        
                        const blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${convertFormat}`));
                        zip.file(`pagina_${i}.${convertFormat}`, blob);
                    }
                    
                    // Update progress (reusing ocrProgress for visual feedback if needed, distinct from OCR)
                    setOcrProgress(Math.round((i / pdf.numPages) * 100));
                }

                const content = await zip.generateAsync({ type: "blob" });
                downloadBlob(content, `convertido_${convertFormat}.zip`);

            } else {
            if (convertFormat === 'word') {
                // Use 'docx' library for genuine Word files
                const { Document, Packer, Paragraph, ImageRun, PageBreak } = await import('docx');
                
                const children = [];
                
                for (let i = 1; i <= pdf.numPages; i++) {
                     setOcrProgress(Math.round((i / pdf.numPages) * 100));
                     const page = await pdf.getPage(i);
                     const viewport = page.getViewport({ scale: 1.5 });
                     
                     const canvas = document.createElement('canvas');
                     const context = canvas.getContext('2d');
                     canvas.width = viewport.width;
                     canvas.height = viewport.height;
                     
                     await page.render({ canvasContext: context, viewport }).promise;
                     const imgData = canvas.toDataURL('image/jpeg', 0.8);
                     const imgBuffer = await fetch(imgData).then(r => r.arrayBuffer());
                     
                     children.push(
                         new Paragraph({
                             children: [
                                 new ImageRun({
                                     data: imgBuffer,
                                     transformation: {
                                         width: viewport.width,
                                         height: viewport.height,
                                     },
                                 }),
                             ],
                         })
                     );
                     
                     // Add page break after each page except the last one (optional, but good for one-image-per-page)
                     if (i < pdf.numPages) {
                         children.push(new Paragraph({ children: [new PageBreak()] }));
                     }
                }
                
                const doc = new Document({
                    sections: [{
                        properties: {},
                        children: children,
                    }],
                });
                
                const blob = await Packer.toBlob(doc);
                downloadBlob(blob, `convertido_${files[0].name}.docx`);
                
            } else {
                // Fallback for Excel/PowerPoint (HTML Hack)
                // We will basically save images and tell user to insert them, OR 
                // we can try to generate a basic HTML file that Word opens.
                
                alert("Aviso: Conversão para Excel/PPT via navegador é experimental. Imagens serão extraídas em um arquivo compatível.");
                
                const JSZip = (await import('jszip')).default;
                
                let htmlContent = `<html><body>`;
                
                for (let i = 1; i <= pdf.numPages; i++) {
                     const page = await pdf.getPage(i);
                     const viewport = page.getViewport({ scale: 1.5 });
                     const canvas = document.createElement('canvas');
                     const context = canvas.getContext('2d');
                     canvas.width = viewport.width;
                     canvas.height = viewport.height;
                     await page.render({ canvasContext: context, viewport }).promise;
                     const imgData = canvas.toDataURL('image/jpeg', 0.8);
                     
                     htmlContent += `<img src="${imgData}" style="width:100%; max-width: ${viewport.width}px;"><br><br>`;
                     setOcrProgress(Math.round((i / pdf.numPages) * 100));
                }
                
                htmlContent += `</body></html>`;
                
                const mimeType = convertFormat === 'excel' ? 'application/vnd.ms-excel' : 
                                 'application/vnd.ms-powerpoint';
                                 
                const extension = convertFormat === 'excel' ? 'xls' : 
                                  'ppt';

                const blob = new Blob(['\ufeff', htmlContent], {
                    type: mimeType
                });
                
                downloadBlob(blob, `documento_convertido.${extension}`);
            }
        }

            setProcessing(false);
            setOcrProgress(0);

        } catch (e) {
             console.error(e);
             alert("Erro na conversão: " + e.message);
             setProcessing(false);
        }
    };


    const handleRepair = async () => {
        if (!files.length) return;
        setProcessing(true);
        try {
            // "Repair" strategy:
            // 1. Try to load with pdf-lib. It has some self-repair capabilities for XRef tables.
            // 2. If valid, save it as a new fresh PDF.
            // 3. If standard load fails, we can try to use pdfjs to read pages one by one and reconstruct.
            
            const { PDFDocument } = await import('pdf-lib');
            const arrayBuffer = await files[0].arrayBuffer();
            let pdfDoc;
            
            try {
                // Try standard load (ignores some garbage)
                pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            } catch (loadErr) {
                 console.warn("Load failed, trying fallback with PDF.js...", loadErr);
                 try {
                     // Fallback: Use PDF.js to render pages and reconstruct
                     const pdfJS = await import('pdfjs-dist/build/pdf.min.mjs');
                     pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;
                     
                     const pdf = await pdfJS.getDocument(arrayBuffer).promise;
                     const newPdf = await PDFDocument.create();
                     
                     for (let i = 1; i <= pdf.numPages; i++) {
                         setOcrProgress(Math.round((i / pdf.numPages) * 100));
                         const page = await pdf.getPage(i);
                         const viewport = page.getViewport({ scale: 1.5 }); // Good quality for repair
                         
                         const canvas = document.createElement('canvas');
                         const context = canvas.getContext('2d');
                         canvas.width = viewport.width;
                         canvas.height = viewport.height;
                         
                         await page.render({ canvasContext: context, viewport }).promise;
                         const imgData = canvas.toDataURL('image/jpeg', 0.8);
                         const imgBytes = await fetch(imgData).then(r => r.arrayBuffer());
                         
                         const jpgImage = await newPdf.embedJpg(imgBytes);
                         const newPage = newPdf.addPage([viewport.width, viewport.height]);
                         newPage.drawImage(jpgImage, {
                             x: 0,
                             y: 0,
                             width: viewport.width,
                             height: viewport.height,
                         });
                     }
                     
                     pdfDoc = newPdf; // Assign to main variable to save later
                     
                 } catch (fallbackErr) {
                     console.error("Fallback also failed", fallbackErr);
                     throw new Error("O arquivo está muito corrompido e não pôde ser lido nem recuperado visualmente.");
                 }
            }

            // If loaded, we "repair" by saving it fresh, which reconstructs the XRef table and file structure.
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            downloadBlob(blob, `reparado_${files[0].name}`);
            setProcessing(false);
            alert("Arquivo processado! Se ele estava com erros leves, agora deve abrir normalmente.");

        } catch (e) {
             console.error(e);
             alert("Erro ao reparar PDF: " + e.message + "\n\nO arquivo pode estar criptografado ou irreparável.");
             setProcessing(false);
        }
    };

    const handleOCR = async () => {
        if (!files.length) return;
        setProcessing(true);
        setExtractedText('');
        setDiffResult(null);
        setOcrProgress(0);

        try {
            // Setup Worker
            const worker = await createWorker('por');
            
            // Helper to rasterize PDF page to Image URL
            const getPageImage = async (pdf, pageNum, scale = 2.0) => {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;
                return canvas.toDataURL('image/png');
            };

            const pdfJS = await import('pdfjs-dist/build/pdf');
            pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs`;

            if (ocrMode === 'extract') {
                 const file = files[0];
                 const arrayBuffer = await file.arrayBuffer();
                 const pdf = await pdfJS.getDocument(arrayBuffer).promise;
                 const numPages = pdf.numPages;
                 let fullText = '';

                 for (let i = 1; i <= numPages; i++) {
                     setOcrProgress(Math.round(((i - 1) / numPages) * 100));
                     const imgUrl = await getPageImage(pdf, i);
                     const { data: { text } } = await worker.recognize(imgUrl);
                     fullText += `--- Página ${i} ---\n${text}\n\n`;
                 }
                 setExtractedText(fullText);
                 
                 // Auto download txt
                 const blob = new Blob([fullText], { type: 'text/plain' });
                 downloadBlob(blob, `texto_extraido_${file.name}.txt`);
            } 
            else if (ocrMode === 'searchable') {
                 // For searchable PDF, we'll try to use Tesseract's PDF output if possible or simple text overlay construction.
                 // Tesseract JS `getPDF` returns a PDF file with text layer.
                 // We need to do this page by page and merge.
                 const { PDFDocument } = await import('pdf-lib');
                 const mergedPdf = await PDFDocument.create();
                 
                 const file = files[0];
                 const arrayBuffer = await file.arrayBuffer();
                 const pdf = await pdfJS.getDocument(arrayBuffer).promise;
                 const numPages = pdf.numPages;

                 for (let i = 1; i <= numPages; i++) {
                     setOcrProgress(Math.round(((i - 1) / numPages) * 100));
                     const imgUrl = await getPageImage(pdf, i);
                     
                     // Tesseract PDF output
                     // in v6+, recognize returns the pdf data directly if requested
                     const { data } = await worker.recognize(imgUrl, { pdfTitle: `Page ${i}` }, { pdf: true });
                     
                     // data.pdf contains the PDF bytes
                     const pdfBytes = data.pdf;
                     
                     if (!pdfBytes) throw new Error("Falha ao gerar PDF pesquisável para página " + i);

                     const pageDoc = await PDFDocument.load(pdfBytes);
                     const [copiedPage] = await mergedPdf.copyPages(pageDoc, [0]);
                     mergedPdf.addPage(copiedPage);
                 }
                 
                 const pdfBytes = await mergedPdf.save();
                 const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                 downloadBlob(blob, `ocr_pesquisavel_${file.name}`);
            }
            else if (ocrMode === 'compare') {
                 if (files.length < 2) throw new Error("Precisa de 2 arquivos");
                 
                 const getText = async (file, startProg, endProg) => {
                     const ab = await file.arrayBuffer();
                     const pdf = await pdfJS.getDocument(ab).promise;
                     let txt = '';
                     for(let i=1; i<=pdf.numPages; i++){
                         const img = await getPageImage(pdf, i);
                         const { data } = await worker.recognize(img);
                         txt += data.text + '\n';
                         const currentProg = startProg + ((i / pdf.numPages) * (endProg - startProg));
                         setOcrProgress(Math.round(currentProg));
                     }
                     return txt;
                 };

                 setOcrProgress(10);
                 const text1 = await getText(files[0], 10, 50);
                 const text2 = await getText(files[1], 50, 90);
                 setOcrProgress(90);

                 const diff = Diff.diffLines(text1, text2);
                 setDiffResult(diff);
            }

            await worker.terminate();
            setOcrProgress(100);
            setProcessing(false);

        } catch (e) {
            console.error(e);
            alert("Erro no OCR: " + e.message);
            setProcessing(false);
        }
    };

    const handleProcess = async () => {
        if (files.length === 0) return;
        
        if (activeTool === 'compress') {
             await handleCompressClientSide();
             return;
        }

        if (activeTool === 'split') {
            if (splitMode === 'size') await handleSplitBySize();
            else await handleSplitByRangeClient();
            return;
        }

        if (activeTool === 'ocr') {
            await handleOCR();
            return;
        }

        setProcessing(true);
        setDiffResult(null);

        // Server-side processing
        try {
            const formData = new FormData();
            formData.append('action', activeTool);
            // splitRanges logic removed explicitly as split is now client-side

            
            files.forEach((file) => {
                formData.append('file', file);
            });

            const res = await fetch('/api/process-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error(await res.text());

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = activeTool === 'split' && splitRanges.includes(',') ? 'resultado_divisao.zip' : `saida_${activeTool}.pdf`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            setFiles([]);
        } catch (err) {
            console.error(err);
            alert("Erro no Processamento: " + err.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)]" style={{ backgroundColor: 'var(--bg-page)' }}>
            
            {/* Split Confirmation Modal - Keep standard white modal for now or adapt */}
            {showSplitConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-cut text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Alvo Não Atingido</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                O arquivo comprimido ficou com <strong>{(compressedBlob?.size / 1024 / 1024).toFixed(2)} MB</strong>, 
                                o que é maior que seu alvo de <strong>{customTargetMB} MB</strong>.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Deseja dividir o arquivo em múltiplas partes para respeitar o limite de tamanho?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => { setShowSplitConfirm(false); setCompressedBlob(null); setFiles([]); }}
                                className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => downloadBlob(compressedBlob, `comprimido_parcial_${files[0].name}`)}
                                className="flex-1 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900"
                            >
                                Baixar Inteiro
                            </button>
                            <button 
                                onClick={handleSplitAndDownload}
                                className="flex-1 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
                            >
                                Dividir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra Lateral Fixa (Desktop) */}
            <PDFToolsSidebar 
                activeTool={activeTool} 
                setActiveTool={setActiveTool} 
                onToolChange={() => { setFiles([]); setDiffResult(null); }} 
            />

            {/* Cabeçalho/Nav Mobile (Visível apenas em telas pequenas) */}
            <div 
                className="md:hidden w-full border-b p-4 sticky top-16 z-30 overflow-x-auto whitespace-nowrap"
                style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-card)' 
                }}
            >
                 <div className="flex gap-2">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => { setActiveTool(tool.id); setFiles([]); setDiffResult(null); }}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                activeTool === tool.id 
                                    ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400" 
                                    : "border-gray-200 dark:border-gray-700"
                            )}
                            style={{ 
                                backgroundColor: activeTool === tool.id ? undefined : 'var(--bg-card)',
                                color: activeTool === tool.id ? undefined : 'var(--text-muted)'
                            }}
                        >
                            <i className={`fas ${tool.icon}`}></i>
                            {tool.label}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Área de Conteúdo Principal - Empurrada para a direita pela largura da barra lateral no desktop */}
            <main className="flex-1 md:ml-72 p-6 md:p-10 w-full min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
                <div className="max-w-[1600px] mx-auto">
                    
                    {/* Cabeçalho */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
                             {tools.find(t => t.id === activeTool)?.label}
                        </h1>
                        <span className="inline-block bg-zinc-800 dark:bg-gray-800 rounded px-3 py-1 text-sm font-medium text-white">
                            {activeTool === 'merge' && 'Junte múltiplos arquivos PDF em um único documento'}
                            {activeTool === 'split' && 'Separe um PDF em várias páginas ou extraia intervalos'}
                            {activeTool === 'compress' && 'Otimize o tamanho dos seus arquivos PDF'}
                            {activeTool === 'ocr' && 'Reconhecimento de texto e conversão par formatos editáveis'}
                            {activeTool === 'crop' && 'Recorte partes específicas das páginas do seu PDF'}
                            {activeTool === 'rotate' && 'Gire páginas ou todo o documento de forma permanente'}
                            {activeTool === 'number' && 'Adicione numeração de página personalizada'}
                            {activeTool === 'convert' && 'Converta PDF para Word, Excel, JPG e outros formatos'}
                            {activeTool === 'repair' && 'Recupere dados de arquivos PDF corrompidos'}
                            {activeTool === 'compare' && 'Compare o texto entra dois arquivos automaticamente'}
                        </span>
                    </div>

                    <div 
                        className="rounded-xl shadow-sm border overflow-hidden min-h-[600px] flex flex-col justify-between"
                        style={{ 
                            backgroundColor: 'var(--bg-card)', 
                            borderColor: 'var(--border-card)' 
                        }}
                    >
                         <div className="p-8 flex-grow flex flex-col">
                             
                             <h4 className="font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>Selecione seus arquivos PDF (Ordem de seleção importa)</h4>

                             {/* Área de Drop - Expandida */}
                             <FileDropzone 
                                onDrop={onDrop} 
                                activeTool={activeTool} 
                                ocrMode={ocrMode} 
                             />

                             {/* Lista de Arquivos */}
                             {files.length > 0 && (
                                 <div className="mt-6">
                                     <div className="grid grid-cols-1 gap-2">
                                         {files.map((f, i) => (
                                             <div key={i} className="flex items-center justify-between p-3 border rounded-lg shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                                 <div className="flex items-center gap-3">
                                                     <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                                                     <span className="font-medium" style={{ color: 'var(--text-main)' }}>{f.name} ({ (f.size/1024/1024).toFixed(2) } MB)</span>
                                                 </div>
                                                 <i className="fas fa-check text-green-500"></i>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             {/* Área de Opções (Dividir/OCR) */}
                             {(activeTool === 'split' || activeTool === 'ocr') && files.length > 0 && (
                                 <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                     {activeTool === 'split' && (
                                         <>
                                              <div className="flex gap-4 mb-4">
                                                  <label className="flex items-center gap-2 cursor-pointer">
                                                      <input type="radio" value="range" checked={splitMode === 'range'} onChange={() => setSplitMode('range')} className="text-orange-500" />
                                                      <span className="font-medium" style={{ color: 'var(--text-main)' }}>Por Página/Intervalo</span>
                                                  </label>
                                                  <label className="flex items-center gap-2 cursor-pointer">
                                                      <input type="radio" value="size" checked={splitMode === 'size'} onChange={() => setSplitMode('size')} className="text-orange-500" />
                                                      <span className="font-medium" style={{ color: 'var(--text-main)' }}>Por Tamanho (MB)</span>
                                                  </label>
                                              </div>

                                             {splitMode === 'range' ? (
                                                <>
                                                 <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-main)' }}>Intervalos (Ex: 1-5, 8)</label>
                                                 <input 
                                                     type="text" 
                                                     value={splitRanges}
                                                     onChange={(e) => setSplitRanges(e.target.value)}
                                                     className="w-full p-2 border rounded focus:border-orange-500 focus:outline-none" 
                                                     style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                 />
                                                </>
                                             ) : (
                                                 <div className="p-3 border rounded" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                                     <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-main)' }}>Tamanho Máximo por Arquivo (MB)</label>
                                                     <div className="flex items-center gap-2">
                                                         <input 
                                                             type="number" 
                                                             value={customTargetMB}
                                                             onChange={(e) => setCustomTargetMB(e.target.value)}
                                                             className="w-24 p-2 border rounded focus:border-orange-500 focus:outline-none" 
                                                             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                             placeholder="Ex: 5"
                                                         />
                                                         <span className="text-sm" style={{ color: 'var(--text-muted)' }}>MB</span>
                                                     </div>
                                                     <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                                                         O arquivo será dividido em partes menores que este valor.
                                                     </p>
                                                 </div>
                                             )}
                                         </>
                                     )}
                                     {activeTool === 'ocr' && (
                                         <div>
                                             <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-main)' }}>Modo de OCR</label>
                                             <div className="flex flex-col gap-2">
                                                 <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                                    <input type="radio" name="ocrMode" value="extract" checked={ocrMode === 'extract'} onChange={() => setOcrMode('extract')} className="text-orange-500 focus:ring-orange-500" />
                                                    <div>
                                                        <span className="font-bold block text-sm" style={{ color: 'var(--text-main)' }}>Extrair Texto (.txt)</span>
                                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Lê o conteúdo e gera um arquivo de texto simples.</span>
                                                    </div>
                                                 </label>
                                                 <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                                    <input type="radio" name="ocrMode" value="searchable" checked={ocrMode === 'searchable'} onChange={() => setOcrMode('searchable')} className="text-orange-500 focus:ring-orange-500" />
                                                    <div>
                                                        <span className="font-bold block text-sm" style={{ color: 'var(--text-main)' }}>PDF Pesquisável</span>
                                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Gera um novo PDF onde o texto da imagem pode ser selecionado/pesquisado.</span>
                                                    </div>
                                                 </label>
                                                 <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                                    <input type="radio" name="ocrMode" value="compare" checked={ocrMode === 'compare'} onChange={() => { setOcrMode('compare'); if(files.length > 2) setFiles(files.slice(0, 2)); }} className="text-orange-500 focus:ring-orange-500" />
                                                    <div>
                                                        <span className="font-bold block text-sm" style={{ color: 'var(--text-main)' }}>Comparar Arquivos (Original vs Alterado)</span>
                                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Extrai o texto de dois arquivos e mostra as diferenças.</span>
                                                    </div>
                                                 </label>
                                             </div>
                                         </div>
                                     )}
                                 </div>
                             )}

                             {/* Crop Area */}
                             {activeTool === 'crop' && files.length > 0 && cropImgData && (
                                <div className="mt-6 flex flex-col gap-6">
                                     <div className="flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                         <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setCropPage(p => Math.max(1, p - 1))}
                                                className="w-10 h-10 flex items-center justify-center border rounded transition-colors"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                title="Página Anterior"
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            <span className="font-bold" style={{ color: 'var(--text-main)' }}>Página {cropPage}</span>
                                            <button 
                                                onClick={() => setCropPage(p => p + 1)}
                                                className="w-10 h-10 flex items-center justify-center border rounded transition-colors"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                title="Próxima Página"
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                         </div>
                                         <div className="flex items-center gap-4">
                                            <select 
                                                value={cropFormat}
                                                onChange={(e) => setCropFormat(e.target.value)}
                                                className="p-2 border rounded focus:border-orange-500 focus:outline-none text-sm font-medium"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                            >
                                                <option value="png">Salvar como PNG</option>
                                                <option value="jpg">Salvar como JPG</option>
                                                <option value="pdf">Salvar como PDF</option>
                                            </select>
                                         </div>
                                     </div>

                                     <div className="relative overflow-auto border rounded-lg flex justify-center p-4" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                         <div 
                                             className="relative shadow-lg select-none cursor-crosshair"
                                             onMouseDown={onCropMouseDown}
                                             onMouseMove={onCropMouseMove}
                                             onMouseUp={onCropMouseUp}
                                             onMouseLeave={onCropMouseUp}
                                             style={{ width: cropSelection?.imgWidth, height: cropSelection?.imgHeight }}
                                         >
                                             <img 
                                                 src={cropImgData} 
                                                 alt="Page" 
                                                 className="block max-w-none pointer-events-none" 
                                                 style={{ width: '100%', height: '100%' }}
                                             />
                                             
                                             {cropSelection && cropSelection.width > 0 && (
                                                <div 
                                                    className="absolute border-2 border-orange-500 bg-orange-500/20"
                                                    style={{
                                                        // Convert stored Source coordinates back to Visual percentage/pixels for display
                                                        left: `${(cropSelection.x / cropSelection.imgWidth) * 100}%`,
                                                        top: `${(cropSelection.y / cropSelection.imgHeight) * 100}%`,
                                                        width: `${(cropSelection.width / cropSelection.imgWidth) * 100}%`,
                                                        height: `${(cropSelection.height / cropSelection.imgHeight) * 100}%`
                                                    }}
                                                >
                                                </div>
                                             )}
                                         </div>
                                     </div>
                                     
                                     <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                                         <i className="fas fa-info-circle mt-0.5"></i>
                                         <div>
                                            <p className="font-bold">Instruções:</p>
                                            <p>Clique e arraste na imagem para selecionar a área que deseja cortar. Use os botões de navegação para trocar de página.</p>
                                         </div>
                                     </div>

                                     <div className="flex justify-end">
                                        <button 
                                            onClick={handleCropDownload}
                                            disabled={!cropSelection || cropSelection.width === 0}
                                            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <i className="fas fa-cut"></i>
                                            Cortar e Salvar
                                        </button>
                                     </div>
                                </div>
                             )}

                             {/* Rotate Area */}
                             {activeTool === 'rotate' && files.length > 0 && rotateImgData && (
                                <div className="mt-6 flex flex-col gap-6">
                                     <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg gap-4" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                         
                                         {/* Page Navigation */}
                                         <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setRotatePage(p => Math.max(1, p - 1))}
                                                className="w-10 h-10 flex items-center justify-center border rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            <span className="font-bold" style={{ color: 'var(--text-main)' }}>Página {rotatePage}</span>
                                            <button 
                                                onClick={() => setRotatePage(p => p + 1)}
                                                className="w-10 h-10 flex items-center justify-center border rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                         </div>

                                         {/* Rotate Mode */}
                                         <div className="flex rounded-lg border p-1" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                             <button
                                                onClick={() => setRotateMode('all')}
                                                className={clsx(
                                                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                                    rotateMode === 'all' ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                                                )}
                                             >
                                                 Todas as Páginas
                                             </button>
                                             <button
                                                onClick={() => setRotateMode('page')}
                                                className={clsx(
                                                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                                    rotateMode === 'page' ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                                                )}
                                             >
                                                 Apenas Esta Página
                                             </button>
                                         </div>

                                         {/* Controls */}
                                         <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setRotateAngle(a => a - 90)}
                                                className="px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                title="Girar 90° Anti-horário"
                                            >
                                                <i className="fas fa-undo"></i>
                                                <span className="hidden sm:inline">Esq.</span>
                                            </button>
                                            <button 
                                                onClick={() => setRotateAngle(0)}
                                                className="px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-white/5 font-bold"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                title="Resetar"
                                            >
                                                0°
                                            </button>
                                            <button 
                                                onClick={() => setRotateAngle(a => a + 90)}
                                                className="px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                title="Girar 90° Horário"
                                            >
                                                <span className="hidden sm:inline">Dir.</span>
                                                <i className="fas fa-redo"></i>
                                            </button>
                                         </div>
                                     </div>

                                     {/* Preview */}
                                     <div className="relative overflow-hidden border rounded-lg flex justify-center p-8" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                         <div 
                                             className="shadow-xl transition-transform duration-300 ease-in-out"
                                             style={{ 
                                                 transform: `rotate(${rotateAngle}deg)`,
                                                 maxWidth: '100%',
                                                 maxHeight: '60vh'
                                             }}
                                         >
                                             <img 
                                                 src={rotateImgData} 
                                                 alt="Page Preview" 
                                                 className="block rounded"
                                             />
                                         </div>
                                     </div>

                                     <div className="flex justify-end gap-4 items-center">
                                         <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                             {rotateMode === 'all' 
                                                ? `Rotacionando TODO o documento em ${rotateAngle}°` 
                                                : `Rotacionando a página ${rotatePage} em ${rotateAngle}°`
                                             }
                                         </div>
                                        <button 
                                            onClick={handleRotate}
                                            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2"
                                        >
                                            <i className="fas fa-save"></i>
                                            Salvar Rotação
                                        </button>
                                     </div>
                                </div>
                             )}



                             {/* Numbering Area */}
                             {activeTool === 'number' && files.length > 0 && (
                                <div className="mt-6 flex flex-col gap-6">
                                     <div className="flex flex-col gap-4 p-6 border rounded-lg" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                         
                                         <div className="flex flex-col md:flex-row gap-8">
                                             {/* Position Grid */}
                                             <div className="flex-1">
                                                 <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-main)' }}>Posição da Numeração</label>
                                                 <div className="grid grid-cols-3 gap-3 w-48 mx-auto md:mx-0">
                                                     {['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                                                         <button
                                                             key={pos}
                                                             onClick={() => setNumPosition(pos)}
                                                             className={clsx(
                                                                 "w-12 h-16 border-2 rounded transition-all flex items-center justify-center relative",
                                                                 numPosition === pos 
                                                                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
                                                                    : "hover:border-orange-300"
                                                             )}
                                                             style={{ 
                                                                 backgroundColor: numPosition === pos ? undefined : 'var(--bg-card)',
                                                                 borderColor: numPosition === pos ? undefined : 'var(--border-card)'
                                                             }}
                                                             title={pos}
                                                         >
                                                             <div className={clsx(
                                                                 "absolute w-2 h-2 rounded-full",
                                                                 pos.includes('top') ? "top-2" : "bottom-2",
                                                                 pos.includes('left') ? "left-2" : pos.includes('right') ? "right-2" : "left-1/2 -translate-x-1/2"
                                                             )}
                                                             style={{ backgroundColor: 'var(--text-muted)' }}
                                                             >
                                                                 {numPosition === pos && <div className="absolute inset-0 bg-orange-600 rounded-full animate-ping"></div>}
                                                                 {numPosition === pos && <div className="absolute inset-0 bg-orange-600 rounded-full"></div>}
                                                             </div>
                                                             {/* Page Preview Lines */}
                                                             <div className="w-8 h-0.5 top-6 absolute rounded" style={{ backgroundColor: 'var(--border-card)' }}></div>
                                                             <div className="w-8 h-0.5 top-8 absolute rounded" style={{ backgroundColor: 'var(--border-card)' }}></div>
                                                             <div className="w-6 h-0.5 top-10 absolute rounded" style={{ backgroundColor: 'var(--border-card)' }}></div>
                                                         </button>
                                                     ))}
                                                 </div>
                                             </div>
 
                                             {/* Start Number */}
                                             <div className="flex-1">
                                                 <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-main)' }}>Iniciar em</label>
                                                 <div className="flex items-center gap-2 mb-4">
                                                     <input 
                                                         type="number" 
                                                         min="1"
                                                         value={numStart}
                                                         onChange={(e) => setNumStart(parseInt(e.target.value) || 1)}
                                                         className="w-24 p-3 border rounded-lg text-lg font-bold text-center focus:border-orange-500 focus:outline-none"
                                                         style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                     />
                                                     <span className="text-sm" style={{ color: 'var(--text-muted)' }}>(A primeira página do PDF será "{numStart}")</span>
                                                 </div>

                                                 <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-main)' }}>Cor da Numeração</label>
                                                 <div className="flex items-center gap-2 mb-4">
                                                     <input 
                                                         type="color" 
                                                         value={numColor}
                                                         onChange={(e) => setNumColor(e.target.value)}
                                                         className="h-10 w-10 p-1 border rounded cursor-pointer"
                                                         style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                                                     />
                                                     <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{numColor}</span>
                                                 </div>

                                                 <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-main)' }}>Formato do Texto</label>
                                                 <div className="flex gap-2">
                                                     <button
                                                         onClick={() => setNumTextFormat('page_num')}
                                                         className={clsx(
                                                             "px-3 py-2 rounded text-sm font-bold border transition-colors",
                                                             numTextFormat === 'page_num' 
                                                                 ? "bg-orange-100 dark:bg-orange-900/40 border-orange-500 text-orange-700 dark:text-orange-400" 
                                                                 : "hover:bg-gray-50 dark:hover:bg-white/5"
                                                         )}
                                                         style={{ 
                                                             backgroundColor: numTextFormat === 'page_num' ? undefined : 'var(--bg-card)',
                                                             borderColor: numTextFormat === 'page_num' ? undefined : 'var(--border-card)',
                                                             color: numTextFormat === 'page_num' ? undefined : 'var(--text-muted)'
                                                         }}
                                                     >
                                                         Página X
                                                     </button>
                                                     <button
                                                         onClick={() => setNumTextFormat('num_only')}
                                                         className={clsx(
                                                             "px-3 py-2 rounded text-sm font-bold border transition-colors",
                                                             numTextFormat === 'num_only' 
                                                                 ? "bg-orange-100 dark:bg-orange-900/40 border-orange-500 text-orange-700 dark:text-orange-400" 
                                                                 : "hover:bg-gray-50 dark:hover:bg-white/5"
                                                         )}
                                                         style={{ 
                                                             backgroundColor: numTextFormat === 'num_only' ? undefined : 'var(--bg-card)',
                                                             borderColor: numTextFormat === 'num_only' ? undefined : 'var(--border-card)',
                                                             color: numTextFormat === 'num_only' ? undefined : 'var(--text-muted)'
                                                         }}
                                                     >
                                                         XX
                                                     </button>
                                                 </div>
                                             </div>
                                         </div>

                                     </div>

                                     {/* Preview */}
                                     {numImgData && (
                                         <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Pré-visualização:</h4>
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => setNumPage(p => Math.max(1, p - 1))}
                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
                                                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                                                    >
                                                        <i className="fas fa-chevron-left text-xs" style={{ color: 'var(--text-muted)' }}></i>
                                                    </button>
                                                    <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>Página {numPage}</span>
                                                    <button 
                                                        onClick={() => setNumPage(p => p + 1)}
                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
                                                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                                                    >
                                                        <i className="fas fa-chevron-right text-xs" style={{ color: 'var(--text-muted)' }}></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="relative overflow-hidden border rounded-lg flex justify-center p-8" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                                <div className="shadow-xl">
                                                    <img 
                                                        src={numImgData} 
                                                        alt="Page Preview" 
                                                        className="block rounded max-h-[50vh]"
                                                    />
                                                </div>
                                            </div>
                                         </div>
                                     )}

                                     <div className="flex justify-end gap-4 items-center">
                                        <button 
                                            onClick={handleNumbering}
                                            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2"
                                        >
                                            <i className="fas fa-list-ol"></i>
                                            Inserir Numeração
                                        </button>
                                     </div>
                                </div>
                             )}


                             {/* Convert Area */}
                             {activeTool === 'convert' && files.length > 0 && (
                                <div className="mt-6 flex flex-col gap-6">
                                     <div className="p-6 border rounded-lg" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                         <label className="block text-sm font-bold mb-4" style={{ color: 'var(--text-main)' }}>Escolha o formato de destino:</label>
                                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                             {[
                                                 { id: 'word', label: 'Word (.doc)', icon: 'fa-file-word', color: 'text-blue-600' },
                                                 { id: 'excel', label: 'Excel (.xls)', icon: 'fa-file-excel', color: 'text-green-600' },
                                                 { id: 'powerpoint', label: 'PowerPoint (.ppt)', icon: 'fa-file-powerpoint', color: 'text-orange-600' },
                                                 { id: 'jpg', label: 'Imagem (.jpg)', icon: 'fa-file-image', color: 'text-purple-600' },
                                                 { id: 'png', label: 'Imagem (.png)', icon: 'fa-file-image', color: 'text-purple-600' },
                                                 { id: 'svg', label: 'Vetor (.svg)', icon: 'fa-bezier-curve', color: 'text-pink-600' },
                                             ].map(fmt => (
                                                 <button
                                                     key={fmt.id}
                                                     onClick={() => setConvertFormat(fmt.id)}
                                                     className={clsx(
                                                         "flex flex-col items-center gap-3 p-6 border-2 rounded-xl transition-all",
                                                         convertFormat === fmt.id 
                                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md" 
                                                            : "hover:border-orange-300 hover:shadow-sm"
                                                     )}
                                                     style={{ 
                                                         backgroundColor: convertFormat === fmt.id ? undefined : 'var(--bg-card)',
                                                         borderColor: convertFormat === fmt.id ? undefined : 'var(--border-card)'
                                                     }}
                                                 >
                                                     <i className={clsx("fas fa-3x", fmt.icon, fmt.color)}></i>
                                                     <span className="font-bold" style={{ color: 'var(--text-main)' }}>{fmt.label}</span>
                                                 </button>
                                             ))}
                                         </div>
                                         
                                         {['word', 'excel', 'powerpoint'].includes(convertFormat) && (
                                             <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm border border-yellow-200 dark:border-yellow-800">
                                                 <i className="fas fa-exclamation-triangle mr-2"></i>
                                                 Atenção: A conversão para Office irá gerar um arquivo contendo as páginas como imagens para garantir a fidelidade visual.
                                             </div>
                                         )}
                                     </div>

                                     <div className="flex justify-end gap-4 items-center">
                                        <button 
                                            onClick={handleConvert}
                                            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition flex items-center gap-2"
                                        >
                                            <i className="fas fa-exchange-alt"></i>
                                            Converter agora
                                        </button>
                                     </div>
                                </div>
                             )}


                             {/* Repair Area */}
                             {activeTool === 'repair' && files.length > 0 && (
                                <div className="mt-6 flex flex-col gap-6">
                                     <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                         <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">
                                             <i className="fas fa-search-plus mr-2"></i>
                                             Análise de Integridade
                                         </h4>
                                         <p className="text-blue-700 dark:text-blue-200 text-sm mb-4">
                                             O PDFMaster tentará reconstruir a tabela de referências do seu arquivo (XRef) e salvar uma nova cópia limpa.
                                             Isso geralmente corrige erros como "Arquivo corrompido", "Fim de arquivo inesperado" ou páginas em branco.
                                         </p>
                                         <div className="p-4 rounded border border-blue-100 dark:border-blue-800 text-sm" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                                             Status: <span className="font-bold" style={{ color: 'var(--text-main)' }}>Pronto para análise</span>
                                         </div>
                                     </div>

                                     <div className="flex justify-end gap-4 items-center">
                                        <button 
                                            onClick={handleRepair}
                                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                                        >
                                            <i className="fas fa-wrench"></i>
                                            Reparar Arquivo
                                        </button>
                                     </div>
                                </div>
                             )}

                             {/* Compress Options */}
                             {activeTool === 'compress' && files.length > 0 && (
                                 <div className="mb-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-card)' }}>
                                     <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-main)' }}>Nível de Compressão</label>
                                     <div className="flex flex-col gap-2">
                                         <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                            <input type="radio" name="compLevel" value="normal" checked={compressionLevel === 'normal'} onChange={() => setCompressionLevel('normal')} className="text-orange-500 focus:ring-orange-500" />
                                            <div>
                                                <span className="font-bold block text-sm" style={{ color: 'var(--text-main)' }}>Normal (Recomendado)</span>
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Boa qualidade, tamanho reduzido (Qualidade ~70%)</span>
                                            </div>
                                         </label>
                                         <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                            <input type="radio" name="compLevel" value="high" checked={compressionLevel === 'high'} onChange={() => setCompressionLevel('high')} className="text-orange-500 focus:ring-orange-500" />
                                            <div>
                                                <span className="font-bold block text-sm" style={{ color: 'var(--text-main)' }}>Alta Compressão</span>
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Qualidade de imagem reduzida, foco em tamanho (Qualidade ~50%)</span>
                                            </div>
                                         </label>
                                         <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                            <input type="radio" name="compLevel" value="extreme" checked={compressionLevel === 'extreme'} onChange={() => setCompressionLevel('extreme')} className="text-orange-500 focus:ring-orange-500" />
                                            <div>
                                                <span className="font-bold block text-sm" style={{ color: 'var(--text-main)' }}>Extrema</span>
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Baixa resolução, máxima redução (Ideal para rascunhos)</span>
                                            </div>
                                         </label>
                                         <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-orange-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                            <input type="radio" name="compLevel" value="custom" checked={compressionLevel === 'custom'} onChange={() => setCompressionLevel('custom')} className="text-orange-500 focus:ring-orange-500" />
                                            <div className="w-full">
                                                <span className="font-bold block text-sm" style={{ color: 'var(--text-main)' }}>Personalizado (Alvo MB)</span>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tamanho Máximo:</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Ex: 5" 
                                                        value={customTargetMB}
                                                        onChange={(e) => setCustomTargetMB(e.target.value)}
                                                        disabled={compressionLevel !== 'custom'}
                                                        className="w-24 px-2 py-1 text-sm border rounded focus:ring-orange-500 focus:outline-none"
                                                        style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                                    />
                                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>MB</span>
                                                </div>
                                            </div>
                                         </label>
                                     </div>
                                     <div className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                                         <i className="fas fa-info-circle mr-1"></i> 
                                         Se o Alvo Personalizado não for atingido, ofereceremos dividir o arquivo automaticamente.
                                     </div>
                                 </div>
                             )}

                             {/* Progress Bar */}
                             {processing && (
                                 <div className="mt-6">
                                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                         <div 
                                             className="bg-orange-500 h-full transition-all duration-300 striped-progress" 
                                             style={{ width: `${(activeTool === 'ocr' || activeTool === 'compress' || activeTool === 'split') ? ocrProgress : 100}%` }}
                                         ></div>
                                     </div>
                                     <p className="text-center text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                                         Processando... { (activeTool === 'ocr' || activeTool === 'compress' || activeTool === 'split') ? `${ocrProgress}%` : '' }
                                     </p>
                                 </div>
                             )}

                             {/* Diff Result Box */}
                             {diffResult && (
                                 <div className="mt-6">
                                     <h5 className="font-bold mb-2" style={{ color: 'var(--text-main)' }}>Resultado da Comparação:</h5>
                                     <div className="bg-slate-900 text-gray-300 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                                         {diffResult.map((part, index) => (
                                             <span key={index} className={part.added ? 'text-green-400 bg-green-900/30' : part.removed ? 'text-red-400 bg-red-900/30 line-through' : ''}>
                                                 {part.value}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             {/* Extracted Text Result Box */}
                             {/* Extracted Text Result Box */}
                             {extractedText && (
                                 <div className="mt-6 animate-fade-in">
                                     <div className="flex items-center justify-between mb-2">
                                         <h5 className="font-bold" style={{ color: 'var(--text-main)' }}>Texto Extraído:</h5>
                                         <button 
                                            onClick={() => {
                                                localStorage.setItem('business_tools_editor_content', extractedText);
                                                router.push('/text-editor');
                                            }}
                                            className="text-sm px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded hover:bg-orange-200 transition-colors font-medium flex items-center gap-2"
                                         >
                                             <i className="fas fa-edit"></i>
                                             Editar no Editor de Texto
                                         </button>
                                     </div>
                                     <div 
                                        className="border p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap shadow-inner"
                                        style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-card)', color: 'var(--text-main)' }}
                                     >
                                         {extractedText}
                                     </div>
                                 </div>
                             )}
                         </div>

                         {/* Footer Action Area - Hide for Crop/Rotate/Number/Convert/Repair as they have inline buttons */}
                         {activeTool !== 'crop' && activeTool !== 'rotate' && activeTool !== 'number' && activeTool !== 'convert' && activeTool !== 'repair' && (
                             <div className="p-6 border-t" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                                 <button
                                     onClick={handleProcess}
                                     disabled={processing || files.length === 0}
                                     className={clsx(
                                         "w-full py-4 rounded-xl text-lg font-bold text-white transition-all shadow-md",
                                         processing || files.length === 0
                                             ? "bg-orange-300 cursor-not-allowed opacity-70"
                                             : "bg-orange-400 hover:bg-orange-500 shadow-orange-200"
                                     )}
                                 >
                                     {processing ? 'Processando...' : `${tools.find(t => t.id === activeTool)?.label}s`}
                                 </button>
                             </div>
                         )}
                    </div>
                </div>
            </main>
        </div>
    );
}
