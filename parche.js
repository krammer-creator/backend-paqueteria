const fs = require('fs');
const path = './frontend/src/components/PanelCustodia.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = '{paquetes.some((p) => (p.estado || \'\').toUpperCase() === \'ENTREGADO\') && (';
const replacement = '{paquetes.some((p) => String(p.estado || \'\').trim().toUpperCase().includes(\'ENTREGADO\')) && (';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log('¡Parche aplicado con exito!');
} else {
    console.log('Ya estaba aplicado o la linea es diferente.');
}
