/**
 * Backend de comentarios para procesos-bailmax.html
 * Despliega este script como Web App (Extensiones → Apps Script desde el Sheet).
 */

const SHEET_ID = '10Mzy6WKOh4jeMhIxN7-nbf1ozP-liiIHx8dOK9Mn0jQ';
const SHEET_NAME = 'Comentarios';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const nombre = String(data.nombre || '').trim().slice(0, 100);
    const comentario = String(data.comentario || '').trim().slice(0, 2000);
    const diagrama = String(data.diagrama || '').trim().slice(0, 50);

    if (!nombre || !comentario || !diagrama) {
      return jsonResponse_({ ok: false, error: 'Campos requeridos: nombre, comentario, diagrama' });
    }

    const sheet = getOrCreateSheet_();
    sheet.appendRow([new Date(), diagrama, nombre, comentario]);
    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const diagrama = (e.parameter.diagrama || '').toString().trim();
    const sheet = getOrCreateSheet_();
    const values = sheet.getDataRange().getValues();
    const comments = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (!diagrama || row[1] === diagrama) {
        comments.push({
          fecha: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
          diagrama: row[1],
          nombre: row[2],
          comentario: row[3]
        });
      }
    }
    comments.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    return jsonResponse_({ ok: true, comments });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Fecha', 'Diagrama', 'Nombre', 'Comentario']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
