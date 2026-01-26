export const applyBpmnTheme = (modeler) => {
    // Hook for applying custom CSS classes (Legacy Dark Mode Support)
    modeler.on('shape.added', (e) => {
        const element = e.element;
        const canvas = modeler.get('canvas');

        // 1. DataObject and DataStore (Fix for Dark Mode fills)
        if (['bpmn:DataObjectReference', 'bpmn:DataStoreReference'].includes(element.type)) {
            canvas.addMarker(element, 'dark-fill-fix');
        }

        // 2. Message Intermediate Throw Event (Specific styling)
        if (element.type === 'bpmn:IntermediateThrowEvent') {
            const bo = element.businessObject;
            if (bo.eventDefinitions && bo.eventDefinitions.some(ed => ed.$type === 'bpmn:MessageEventDefinition')) {
                    canvas.addMarker(element, 'message-event-styled');
            }
        }
    });
};
