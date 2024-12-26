// Script para manejar el formulario de Google Sheets
const scriptURL = "https://docs.google.com/spreadsheets/d/12pDS4KLM1m3Rh_TAqbKIa4u-RP3hHS0HovnN8kbz1nc/edit?usp=sharing";
const form = document.forms['google-sheet'];

form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => alert('¡Registro exitoso!'))
        .catch(error => console.error('Error al cargar la información', error.message));
});

document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://script.google.com/macros/s/AKfycbxtmQt8O_g7auWw4P2Ay2Xy-KrmwMasp38cbkPOyP7lR2LRIusOZOp0AMbJvOxAkvtu/exec';

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos obtenidos:', data); // Verificar los datos obtenidos
        const select1 = document.getElementById('selectorHoja1');
        const select2 = document.getElementById('selectorHoja2');

        // Verificar que los elementos select se obtienen correctamente
        console.log('select1:', select1);
        console.log('select2:', select2);

        if (data['BD PERSONAL OP.']) {
            console.log('Datos de Hoja1:', data['BD PERSONAL OP.']);
            data['BD PERSONAL OP.'].forEach(row => {
                const option = document.createElement('option');
                option.text = row.join(' - ');
                select1.add(option);
                console.log('Añadida opción a select1:', option);
            });
        } else {
            console.warn('No se encontraron datos para Hoja1');
        }

        if (data['BD CLIENTES']) {
            console.log('Datos de Hoja2:', data['BD CLIENTES']);
            data['BD CLIENTES'].forEach(row => {
                const option = document.createElement('option');
                option.text = row.join(' - ');
                select2.add(option);
                console.log('Añadida opción a select2:', option);
            });
        } else {
            console.warn('No se encontraron datos para Hoja2');
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la operación fetch:', error);
    });
});

function calcularTotal() {
    const filas = document.querySelectorAll("#dynamicTable tr:not(:first-child)");
    let totalMonto = 0;
    
    filas.forEach(fila => {
        const cantidad = fila.querySelector('input[name="cantidad"]').value;
        const cu = fila.querySelector('input[name="cu"]').value;
        const costo = fila.querySelector('input[name="costo"]');
        if (cantidad && cu) {
            const total = parseFloat(cantidad) * parseFloat(cu);
            costo.value = total.toFixed(2);
            totalMonto += total;
        }
    });
    document.getElementById("totalMonto").value = totalMonto.toFixed(2);
}

function addRow(tableId = "dynamicTable") {
    var table = document.getElementById(tableId);
    var row = table.insertRow(-1);
    for (var i = 0; i < 5; i++) { // Ajustado a 5 para incluir la columna "Costo"
        var cell = row.insertCell(i);
        cell.innerHTML = `<input type="text" name="${tableId}_input${i}_row${table.rows.length - 1}" onchange="sumarCostos()" />`;
    }
    sumarCostos(); // Actualiza la suma al agregar una nueva fila
}

function removeRow(tableId = "dynamicTable") {
    var table = document.getElementById(tableId);
    var rowCount = table.rows.length;
    if (rowCount > 2) {
        table.deleteRow(-1);
        sumarCostos(); // Actualiza la suma al eliminar una fila
    } else {
        alert('No se puede eliminar la fila inicial.');
    }
}

function sumarCostos() {
    var tables = document.querySelectorAll('table');
    var total = 0;

    tables.forEach(function(table) {
        for (var i = 1; i < table.rows.length; i++) { // Comienza en 1 para omitir el encabezado
            var cells = table.rows[i].cells;
            if (cells.length > 4) {
                var costo = cells[4].getElementsByTagName("input")[0].value;
                total += parseFloat(costo) || 0; // Suma y convierte el valor a número
            }
        }
    });

    document.getElementById("totalMonto").value = total.toFixed(2); // Muestra el total en la tabla "Monto"
}

function addTable() {
    var container = document.querySelector('.container');
    var tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');

    var newTable = document.createElement('table');
    var tableId = `newTable_${document.querySelectorAll('.table-container').length + 1}`;
    newTable.id = tableId;
    newTable.border = "1";

    var headerRow = newTable.insertRow();
    var headers = ["Cantidad", "UM", "Descripción", "P.U.", "Costo"];
    headers.forEach(function(header) {
        var cell = document.createElement('th');
        cell.textContent = header;
        headerRow.appendChild(cell);
    });

    // Añadir una fila de ejemplo
    var exampleRow = newTable.insertRow();
    for (var i = 0; i < headers.length; i++) {
        var cell = exampleRow.insertCell();
        cell.innerHTML = `<input type="text" name="${tableId}_input${i}_row0" onchange="sumarCostos()" />`;
    }

    // Añadir botones de agregar y quitar fila
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.innerHTML = `
        <button class="add" type="button" onclick="addRow('${tableId}')">+</button>
        <button class="remove" type="button" onclick="removeRow('${tableId}')">-</button>
    `;

    tableContainer.appendChild(newTable);
    tableContainer.appendChild(buttonContainer);
    container.appendChild(tableContainer);
}

function removeTable() {
    var container = document.querySelector('.container');
    var tables = container.querySelectorAll('.table-container');
    if (tables.length > 0) { 
        container.removeChild(tables[tables.length - 1]);
        sumarCostos(); // Actualiza la suma al eliminar una tabla
    } else {
        alert('No hay tablas adicionales para eliminar.');
    }
}

function changeLogo() {
    console.log('changeLogo function called'); // Agrega esta línea
    var empresa = document.getElementById('empresa_options').value;
    var logoContainer = document.getElementById('logo-container');
    
    if (empresa === 'ISI') {
        logoContainer.innerHTML = '<img src="images/Logo ISI simple.png" alt="Logo ISI simple">';
    } else if (empresa === 'CSM') {  
        logoContainer.innerHTML = '<img src="images/Logo CSM sello.png" alt="Logo CSM">';
    } else if (empresa === 'MIC') {
        logoContainer.innerHTML = '<img src="images/logo mic.jpg" alt="Logo MIC">';
    } else {
        logoContainer.innerHTML = `
            <img src="images/Logo ISI simple.png" alt="Logo ISI simple">
            <img src="images/Logo CSM sello.png" alt="Logo CSM">
            <img src="images/logo mic.jpg" alt="Logo MIC">
        `;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    changeLogo();
});

function generateFolio() {
    var folio = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('folio').value = folio;
}
