const { createApp, onMounted, ref } = Vue;
const { jsPDF } = window.jspdf;

// Custom Module to Disable Zoom Scroll
/*
    We need to disable the 'zoomScroll' feature of bpmn-js to prevent mouse wheel zooming.
    Zooming will only be possible via CTRL + Wheel (standard browser behavior) or toolbar buttons if we add them.
    Actually, the request says "scroll do mouse não consiga mover ele", meaning PAN on scroll? 
    Or Zoom on scroll? Usually scroll zooms. 
    "Apenas arrastando com o mouse" means Panning is allowed via drag.
*/

const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="Process_1" isExecutable="false">
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
    </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

createApp({
    setup() {
        const modeler = ref(null);
        const notification = ref('');
        const isDark = ref(false);
        const autoSaveTimer = ref(null);

        onMounted(() => {
            modeler.value = new BpmnJS({
                container: '#canvas',
                keyboard: {
                    bindTo: window
                },
                additionalModules: [{
                    zoomScroll: ['value', {
                        toggle: function() {}, 
                        scroll: function() {}  
                    }]
                }]
            });

            // Hook for applying custom CSS classes to specific elements
            modeler.value.on('shape.added', (e) => {
                const element = e.element;
                const canvas = modeler.value.get('canvas');

                // 1. DataObject and DataStore (White body override)
                if (['bpmn:DataObjectReference', 'bpmn:DataStoreReference'].includes(element.type)) {
                    canvas.addMarker(element, 'light-theme-forced');
                }

                // 2. Message Intermediate Throw Event (Specific styling)
                if (element.type === 'bpmn:IntermediateThrowEvent') {
                    const bo = element.businessObject;
                    if (bo.eventDefinitions && bo.eventDefinitions.some(ed => ed.$type === 'bpmn:MessageEventDefinition')) {
                         canvas.addMarker(element, 'message-event-styled');
                    }
                }
            });

            // Auto-Save Logic
            modeler.value.on('commandStack.changed', () => {
                if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value);
                autoSaveTimer.value = setTimeout(async () => {
                    try {
                        const { xml } = await modeler.value.saveXML({ format: true });
                        localStorage.setItem('cachedDiagram', xml);
                        console.log('Auto-saved to cache');
                        showNotify('Rascunho salvo.');
                    } catch (err) {
                        console.error('Auto-save failed', err);
                    }
                }, 1000); // Wait 1 second after last change
            });

            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                isDark.value = savedTheme === 'dark';
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                isDark.value = true;
            }
            applyTheme();

            // Restore from Cache or Load Empty
            const cachedDiagram = localStorage.getItem('cachedDiagram');
            if (cachedDiagram) {
                openDiagram(cachedDiagram);
                showNotify('Diagrama restaurado do cache.');
            } else {
                openDiagram(initialDiagram);
            }
        });

        const toggleTheme = () => {
            isDark.value = !isDark.value;
            applyTheme();
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        };

        const applyTheme = () => {
            document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
        };

        const openDiagram = async (xml) => {
            try {
                await modeler.value.importXML(xml);
                const canvas = modeler.value.get('canvas');
                canvas.zoom('fit-viewport');
                // No notification for initial load to keep it clean, unless restored
            } catch (err) {
                console.error(err);
                showNotify('Erro ao carregar.');
            }
        };

        const createNewDiagram = () => {
            openDiagram(initialDiagram);
        };

        const loadDiagram = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => openDiagram(e.target.result);
            reader.readAsText(file);
        };

        const saveXML = async () => {
            try {
                const { xml } = await modeler.value.saveXML({ format: true });
                const blob = new Blob([xml], { type: 'application/xml' });
                saveAs(blob, 'diagrama.bpmn');
                showNotify('Salvo em XML!');
            } catch (err) {
                showNotify('Erro ao salvar XML.');
            }
        };

        const saveSVG = async () => {
            try {
                const { svg } = await modeler.value.saveSVG();
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                saveAs(blob, 'diagrama.svg');
                showNotify('Salvo em SVG!');
            } catch (err) {
                showNotify('Erro ao salvar SVG.');
            }
        };

        const savePDF = async () => {
            try {
                const { svg } = await modeler.value.saveSVG();
                
                // Parse SVG to get dimensions
                const parser = new DOMParser();
                const svgElem = parser.parseFromString(svg, "image/svg+xml").documentElement;
                const originalWidth = parseInt(svgElem.getAttribute("width")) || 800;
                const originalHeight = parseInt(svgElem.getAttribute("height")) || 600;

                // High Quality Scale Factor (3x makes it look like vector on most screens/prints)
                const scale = 3; 
                const scaledWidth = originalWidth * scale;
                const scaledHeight = originalHeight * scale;

                const canvas = document.createElement('canvas');
                canvas.width = scaledWidth;
                canvas.height = scaledHeight;
                const ctx = canvas.getContext('2d');
                
                // Scale the context so canvg draws bigger
                ctx.scale(scale, scale);

                const v = await canvg.Canvg.fromString(ctx, svg);
                await v.render();
                
                const imgData = canvas.toDataURL('image/png', 1.0); // Highest quality PNG
                
                // Initialize PDF with original dimensions (points/px)
                const orientation = originalWidth > originalHeight ? 'l' : 'p';
                const pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'px', // Use pixels to match SVG dimensions easily
                    format: [originalWidth + 40, originalHeight + 40]
                });
                
                // Add the high-res image into the PDF at the original size
                // This compresses pixels, creating high DPI output
                pdf.addImage(imgData, 'PNG', 20, 20, originalWidth, originalHeight);
                pdf.save("diagrama.pdf");
                showNotify('Salvo em PDF (Alta Qualidade)!');
            } catch (e) {
                console.error(e);
                showNotify('Erro ao exportar PDF: ' + e.message);
            }
        };

        const showNotify = (msg) => {
            notification.value = msg;
            setTimeout(() => notification.value = '', 3000);
        };

        const undo = () => {
            const commandStack = modeler.value.get('commandStack');
            commandStack.undo();
        };

        const redo = () => {
            const commandStack = modeler.value.get('commandStack');
            commandStack.redo();
        };

        const clearCanvas = () => {
             // Create a new empty diagram effectively clearing it
             if(confirm('Tem certeza que deseja limpar tudo?')) {
                 createNewDiagram();
             }
        };

        return {
            notification,
            createNewDiagram,
            loadDiagram,
            saveXML,
            saveSVG,
            savePDF,
            isDark,
            toggleTheme,
            undo,
            redo,
            clearCanvas
        };
    }
}).mount('#app');
