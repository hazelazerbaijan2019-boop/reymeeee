const SPREADSHEET_ID = "1FlUr_O4FRemx12OoBhPTvBz_bq-a5DDro7TDJ3IEki4";
const PREFERRED_SHEET_NAMES = ["Qeydiyyat", "Sheet1", "1 vərəq"];

const HEADERS = [
  "Tarix/Saat",
  "Ad",
  "Telefon",
  "E-mail",
  "Məhsul",
  "Razılıq",
  "Səhifə URL",
  "UTM Source",
  "UTM Campaign",
  "UTM Medium",
  "UTM Content",
  "UTM Term",
  "Status",
  "Qeyd"
];

function doGet() {
  return jsonResponse({
    success: true,
    message: "Potensialist qeydiyyat endpoint-i aktivdir."
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const params = getParams(e);
    const sheet = getTargetSheet();
    ensureHeaders(sheet);

    const nextRow = sheet.getLastRow() + 1;
    const values = [
      new Date(),
      params.name || "",
      params.phone || "",
      params.email || "",
      params.product || "İlk Milyonum",
      params.consent || "",
      params.page_url || "",
      params.utm_source || "",
      params.utm_campaign || "",
      params.utm_medium || "",
      params.utm_content || "",
      params.utm_term || "",
      "Yeni",
      ""
    ];

    sheet.getRange(nextRow, 1, 1, HEADERS.length).setValues([values]);

    return jsonResponse({
      success: true,
      message: "Müraciət Google Sheets-ə yazıldı."
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error && error.message ? error.message : "Xəta baş verdi"
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (error) {
      // Lock may not be acquired if execution failed before waitLock.
    }
  }
}

function testWrite() {
  const sheet = getTargetSheet();
  ensureHeaders(sheet);
  const nextRow = sheet.getLastRow() + 1;
  const values = [
    new Date(),
    "Apps Script test",
    "+994 00 000 00 00",
    "test@example.com",
    "İlk Milyonum",
    "accepted",
    "Apps Script editor",
    "test",
    "test",
    "",
    "",
    "",
    "Test",
    "Bu sətri testdən sonra silmək olar"
  ];

  sheet.getRange(nextRow, 1, 1, HEADERS.length).setValues([values]);

  return "Test sətri Google Sheets-ə yazıldı.";
}

function getParams(e) {
  if (e && e.parameter) return e.parameter;
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      return {};
    }
  }
  return {};
}

function getTargetSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  for (const name of PREFERRED_SHEET_NAMES) {
    const sheet = spreadsheet.getSheetByName(name);
    if (sheet) return sheet;
  }
  return spreadsheet.insertSheet(PREFERRED_SHEET_NAMES[0]);
}

function ensureHeaders(sheet) {
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = current.some(Boolean);
  if (!hasHeaders || current.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  sheet.getRange("C:C").setNumberFormat("@");
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
