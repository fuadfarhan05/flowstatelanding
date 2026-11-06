/**
 * Saves claims from enteryourflowstate.app/stickers to this Google Sheet and
 * enforces the per-sticker limit and one claim per email.
 *
 * Setup:
 * 1. In the sheet, open Extensions > Apps Script and paste in this file.
 * 2. Deploy > New deployment > Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 3. Copy the web app URL (it ends in /exec) into the Vercel environment
 *    variable REACT_APP_STICKER_SHEET_URL, then redeploy the site.
 *
 * After changing this file, publish it with Deploy > Manage deployments >
 * edit > New version. That keeps the same URL.
 *
 * The sheet is the source of truth: deleting a row frees its stickers and lets
 * that email claim again.
 */

var HEADERS = ["Submitted At", "First Name", "Email", "Friend Email", "Stickers"];
var EMAIL_COLUMN = 2;
var STICKERS_COLUMN = 4;
var STICKERS = ["Conviction Within", "Original Wave Logo", "Text & Speech Bars"];
var LIMIT_PER_STICKER = 20;
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var MAX_LENGTH = 254;
var LOCK_WAIT_MS = 25000;

function doGet() {
  return respond({ ok: true, remaining: countRemaining(readClaims(getSheet())) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    var claim = parseClaim(JSON.parse(e.postData.contents));

    // Checking and saving must happen as one step, or two people could both
    // take the last sticker.
    lock.waitLock(LOCK_WAIT_MS);
    locked = true;

    var sheet = getSheet();
    var claims = readClaims(sheet);
    var remaining = countRemaining(claims);

    // Only the Email column counts. A referred friend can still claim, and a
    // friend can be referred by any number of people.
    var claimKey = normalizeEmail(claim.email);
    var alreadyClaimed = claims.some(function (row) {
      return normalizeEmail(row[EMAIL_COLUMN]) === claimKey;
    });
    if (alreadyClaimed) {
      return respond({ ok: false, code: "already_claimed" });
    }

    var soldOut = claim.stickers.filter(function (name) {
      return remaining[name] <= 0;
    });
    if (soldOut.length) {
      return respond({ ok: false, code: "sold_out", soldOut: soldOut, remaining: remaining });
    }

    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      new Date(),
      escapeCell(claim.first),
      escapeCell(claim.email),
      escapeCell(claim.friend),
      claim.stickers.join(", "),
    ]);
    // Write now so the next request in line sees this claim.
    SpreadsheetApp.flush();
    return respond({ ok: true });
  } catch (error) {
    console.error(error);
    return respond({
      ok: false,
      code: error.code || "error",
      error: "Invalid or unsaved claim",
    });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// Claim rows, without the header row.
function readClaims(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
}

function countRemaining(claims) {
  var remaining = {};
  STICKERS.forEach(function (name) {
    remaining[name] = LIMIT_PER_STICKER;
  });
  claims.forEach(function (row) {
    String(row[STICKERS_COLUMN])
      .split(",")
      .forEach(function (part) {
        var name = part.trim();
        if (remaining[name] > 0) remaining[name] -= 1;
      });
  });
  return remaining;
}

// Treats addresses that reach the same inbox as one person: letter case and
// +tags everywhere, plus dots on Gmail.
function normalizeEmail(value) {
  var parts = String(value).trim().toLowerCase().split("@");
  var local = parts[0].split("+")[0];
  var domain = parts[1] === "googlemail.com" ? "gmail.com" : parts[1];
  if (domain === "gmail.com") local = local.replace(/\./g, "");
  return local + "@" + domain;
}

function claimError(code, message) {
  var error = new Error(message);
  error.code = code;
  return error;
}

// The URL is public, so requests can't be assumed to come from the form.
function parseClaim(body) {
  var first = cleanText(body.first);
  var email = cleanText(body.email);
  var friend = cleanText(body.friend);
  var stickers = Array.isArray(body.stickers)
    ? STICKERS.filter(function (name) {
        return body.stickers.indexOf(name) !== -1;
      })
    : [];

  if (!first) throw new Error("Missing first name");
  if (!EMAIL_RE.test(email)) throw new Error("Invalid email");
  // Friend email is optional: it's blank when someone shares the link instead.
  if (friend && !EMAIL_RE.test(friend)) throw new Error("Invalid friend email");
  if (friend && normalizeEmail(email) === normalizeEmail(friend)) {
    throw claimError("self_referral", "Friend email matches own email");
  }
  if (!stickers.length) throw new Error("No stickers picked");

  return { first: first, email: email, friend: friend, stickers: stickers };
}

function cleanText(value) {
  return String(value == null ? "" : value).trim().slice(0, MAX_LENGTH);
}

// Without the leading apostrophe, Sheets would run input like =IMPORTXML(...)
// as a formula.
function escapeCell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function respond(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
