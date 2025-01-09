document.addEventListener('DOMContentLoaded', () => {
  // Inicializar inventario u otros datos si es necesario
});

function startScanner() {
  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: document.querySelector('#interactive'),
      constraints: {
        facingMode: "environment" // Usa la cámara trasera
      },
    },
    decoder: {
      readers: ["ean_reader"] // Puedes añadir otros tipos de lectores aquí
    }
  }, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(function(data) {
    document.getElementById('barcode').value = data.codeResult.code;
    // Detener Quagga después del primer escaneo
    Quagga.stop();
    // Aquí podrías realizar la búsqueda en internet para auto completar el nombre del medicamento
    document.getElementById('name').value = 'Nombre simulado'; // Simulación
  });
}

function addItem() {
  const barcode = document.getElementById('barcode').value;
  const name = document.getElementById('name').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const location = document.getElementById('location').value;

  if (barcode && name && expiryDate) {
    const table = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cellBarcode = newRow.insertCell(0);
    const cellName = newRow.insertCell(1);
    const cellExpiryDate = newRow.insertCell(2);
    const cellLocation = newRow.insertCell(3);
    const cellStatus = newRow.insertCell(4);

    cellBarcode.textContent = barcode;
    cellName.textContent = name;
    cellExpiryDate.textContent = expiryDate;
    cellLocation.textContent = location;

    const now = new Date();
    const expiry = new Date(expiryDate);
    const differenceInDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (differenceInDays <= 30) {
      cellStatus.textContent = 'Próximo a vencer';
      newRow.classList.add('status-red');
    } else if (differenceInDays <= 90) {
      cellStatus.textContent = 'Vencimiento cercano';
      newRow.classList.add('status-yellow');
    } else if (differenceInDays <= 365) {
      cellStatus.textContent = 'En buen estado';
      newRow.classList.add('status-green');
    } else {
      cellStatus.textContent = 'Vencimiento lejano';
    }
  } else {
    alert('Por favor complete todos los campos.');
  }
}

function exportToExcel() {
  const table = document.getElementById('inventory-table');
  let tableHTML = table.outerHTML.replace(/ /g, '%20');
  
  const filename = 'inventory.xls';
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);
  
  downloadLink.href = 'data:application/vnd.ms-excel,' + tableHTML;
  downloadLink.download = filename;
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

