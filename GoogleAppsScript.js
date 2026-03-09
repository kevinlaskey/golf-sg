// ================================================================
// LATROBE CC - STROKES GAINED · Google Apps Script
// ================================================================
// SETUP INSTRUCTIONS:
// 1. Go to script.google.com
// 2. Click "New Project", paste this entire file
// 3. Click Deploy > New Deployment > Web App
// 4. Set "Who has access" to "Anyone"
// 5. Click Deploy, copy the Web App URL
// 6. Paste that URL into the golf app's SHEETS_URL variable
// ================================================================

const SHEET_NAME = 'Rounds';

const HEADERS = [
  'Date', 'Round ID', 'Hole', 'Par', 'Hole Yds',
  'Shot #', 'Shot Type', 'Dist From (yds)', 'Dist To (yds)',
  'Miss Direction', 'Club', 'Strokes Gained'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create the Rounds sheet
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground('#2d5a27');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Append each shot as a row
    data.rows.forEach(row => {
      sheet.appendRow([
        row.date,
        row.roundId,
        row.hole,
        row.par,
        row.holeYds,
        row.shotNum,
        row.shotType,
        row.distFrom,
        row.distTo,
        row.miss,
        row.club,
        row.sg
      ]);
    });

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', rowsAdded: data.rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this manually in the editor to verify setup
function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected to: ' + ss.getName());
  Logger.log('Setup looks good! Deploy as Web App to get your URL.');
}
