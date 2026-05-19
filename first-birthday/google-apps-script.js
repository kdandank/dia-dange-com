/**
 * Google Apps Script — RSVP backend for diadange.com
 *
 * Setup:
 *   1. Go to script.google.com → New project (standalone, no need to open from Sheet)
 *   2. Paste this file's contents, save
 *   3. Make sure the Sheet's first tab is named "RSVPs" and has these headers in row 1:
 *      Timestamp | Attending | Name | Plus Ones | Phone | Message
 *   4. Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   5. Copy the deployment URL and paste it as SCRIPT_URL in:
 *      - first-birthday/index.html
 *      - rsvp/index.html
 */

const SPREADSHEET_ID = '1u7SQzg6jlcgUAQJBh0t6vlVJA4cQdiQNlVsVuIcNbEc';
const SHEET_NAME     = 'RSVPs';

function getSheet() {
  return SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(SHEET_NAME);
}

function doPost(e) {
  const sheet = getSheet();
  const data  = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.attending || '',
    data.name      || '',
    data.plusOnes  || '0',
    data.phone     || '',
    data.message   || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet   = getSheet();
  const rows    = sheet.getDataRange().getValues();
  const headers = rows[0];

  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.toLowerCase().replace(/\s+/g, '')] = row[i];
    });
    return obj;
  });

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
