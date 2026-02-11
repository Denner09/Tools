const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'components', 'media', 'ImageEditor.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let startIdx = -1;
let toolButtonIdx = -1;

// Procurar primeira ocorrência de ProjectWorkspace (a duplicada/errada)
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function ProjectWorkspace') && i < 3000) {
        startIdx = i;
        break;
    }
}

// Procurar ToolButton (logo após o fim da função duplicada)
for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes('const ToolButton')) {
        toolButtonIdx = i;
        break;
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
        console.log(`Removendo função duplicada das linhas ${startIdx + 1} até ${endIdx + 1}`);
        // Remove lines from startIdx to endIdx (inclusive)
        lines.splice(startIdx, endIdx - startIdx + 1);
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log('Arquivo limpo com sucesso.');
    } else {
        console.log('Não foi possível encontrar o fechamento da função duplicada.');
    }
} else {
    console.log(`Marcadores não encontrados. startIdx: ${startIdx}, toolButtonIdx: ${toolButtonIdx}`);
}
