/**
 * Google Apps Script — RSVP backend for diadange.com
 *
 * Setup:
 *   1. Go to script.google.com → New project (standalone, no need to open from Sheet)
 *   2. Paste this file's contents, save
 *   3. Make sure the Sheet's first tab is named "RSVPs" and has these headers in row 1:
 *      Timestamp | Attending | Name | Plus Ones | Phone | Message
 *      Also add a second tab named "Grid-Game" with these headers in row 1:
 *      Timestamp | Name | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | Score
 *   4. Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   5. Copy the deployment URL and paste it as SCRIPT_URL in:
 *      - first-birthday/index.html
 *      - rsvp/index.html
 *      - grid-game/index.html
 */

const SPREADSHEET_ID  = '1u7SQzg6jlcgUAQJBh0t6vlVJA4cQdiQNlVsVuIcNbEc';
const SHEET_NAME       = 'RSVPs';
const GRID_SHEET_NAME  = 'Grid-Game';

// Index i of GRID_KEY holds the winning number for grid row i.
const GRID_KEY = "5,2,9,6,1,3,7,4,11,8,10,0".split(',').map(Number);

function scoreGridGame(numbers) {
  let score = 0;
  for (let i = 0; i <= 11; i++) {
    const entered = numbers[i];
    if (entered !== undefined && entered !== '' && Number(entered) === GRID_KEY[i]) {
      score++;
    }
  }
  return score;
}

function getSheet() {
  return SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(SHEET_NAME);
}

function getGridSheet() {
  return SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(GRID_SHEET_NAME);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.type === 'grid-game') {
    const sheet = getGridSheet();
    const numbers = data.numbers || {};
    const score = scoreGridGame(numbers);
    const row = [new Date(), data.name || ''];
    for (let i = 0; i <= 11; i++) {
      row.push(numbers[i] !== undefined ? numbers[i] : '');
    }
    row.push(score);
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', score: score }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getSheet();

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
