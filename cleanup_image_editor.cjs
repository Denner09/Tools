const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'components', 'media', 'ImageEditor.jsx');
try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let startIdx = -1;
    let toolButtonIdx = -1;

    console.log('Total lines:', lines.length);

    // Procurar primeira ocorrência de ProjectWorkspace (a duplicada/errada)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('function ProjectWorkspace') && i < 3000) {
            startIdx = i;
            break;
        }
    }

    // Procurar ToolButton (logo após o fim da função duplicada)
    if (startIdx !== -1) {
        for (let i = startIdx; i < lines.length; i++) {
            if (lines[i].includes('const ToolButton')) {
                toolButtonIdx = i;
                break;
            }
        }
    }

    if (startIdx !== -1 && toolButtonIdx !== -1) {
        // Procurar o '}' que fecha a função, antes de ToolButton
        let endIdx = toolButtonIdx - 1;
        while (endIdx > startIdx) {
            if (lines[endIdx].trim() === '}') {
                break;
            }
            endIdx--;
        }

        if (lines[endIdx].trim() === '}') {
            console.log(`Removing duplicated function from line ${startIdx + 1} to ${endIdx + 1}`);
            // Remove lines from startIdx to endIdx (inclusive)
            // splice(start, deleteCount)
            lines.splice(startIdx, endIdx - startIdx + 1);
            fs.writeFileSync(filePath, lines.join('\n'));
            console.log('File cleaned successfully.');
        } else {
            console.log('Could not find closing brace for duplicated function.');
        }
    } else {
        console.log(`Markers not found. startIdx: ${startIdx}, toolButtonIdx: ${toolButtonIdx}`);
    }
} catch (err) {
    console.error('Error:', err);
}
